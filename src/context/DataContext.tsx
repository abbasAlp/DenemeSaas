import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SalesData, DashboardStats } from '../types';
import { analyzeSalesData } from '../utils/dataAnalysis';
import { importExcelData } from '../utils/excelImport';
import { db } from '../config/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, writeBatch } from 'firebase/firestore';

// Collection names
const COLLECTIONS = {
  SALES_DATA: 'sales_data',
  DASHBOARD_STATS: 'dashboard_stats'
};

interface DataContextType {
  salesData: SalesData[];
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  importData: (file: File) => Promise<void>;
  clearData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Firebase için veriyi temizle
const cleanDataForFirestore = (data: any) => {
  const cleaned = { ...data };
  
  // undefined değerleri kaldır
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });

  // Tarihleri string'e çevir
  if (cleaned.tarih && cleaned.tarih instanceof Date) {
    cleaned.tarih = cleaned.tarih.toISOString();
  }

  return cleaned;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase'den verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        // Satış verilerini yükle
        const salesSnapshot = await getDocs(collection(db, COLLECTIONS.SALES_DATA));
        const salesDataFromDB: SalesData[] = [];
        salesSnapshot.forEach((doc) => {
          salesDataFromDB.push({ id: doc.id, ...doc.data() } as SalesData);
        });
        setSalesData(salesDataFromDB);

        // Dashboard istatistiklerini yükle
        const statsDoc = await getDocs(collection(db, COLLECTIONS.DASHBOARD_STATS));
        if (!statsDoc.empty) {
          setDashboardStats(statsDoc.docs[0].data() as DashboardStats);
        }
      } catch (err: any) {
        console.error('Error loading data from Firebase:', err);
        setError('Veriler yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const importData = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await importExcelData(file);
      console.log('Data imported successfully:', data.length, 'records');
      
      if (data.length === 0) {
        throw new Error('Excel dosyasından veri alınamadı. Lütfen dosya formatını kontrol edin.');
      }

      // Önce mevcut verileri temizle
      await clearData();

      // Verileri Firebase'e kaydet
      const batch = writeBatch(db);
      
      data.forEach((item, index) => {
        const cleanedItem = cleanDataForFirestore(item);
        const docRef = doc(collection(db, COLLECTIONS.SALES_DATA));
        batch.set(docRef, { ...cleanedItem, id: docRef.id });
      });

      // Batch işlemini gerçekleştir
      await batch.commit();
      
      // İstatistikleri hesapla ve kaydet
      const stats = analyzeSalesData(data);
      const statsRef = doc(collection(db, COLLECTIONS.DASHBOARD_STATS), 'current');
      await setDoc(statsRef, cleanDataForFirestore(stats));
      
      setSalesData(data);
      setDashboardStats(stats);
    } catch (err: any) {
      console.error('Error importing data:', err);
      setError(`Veri içe aktarılırken bir hata oluştu: ${err.message || 'Bilinmeyen hata'}. Lütfen Excel dosyanızı kontrol edin.`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = async () => {
    setIsLoading(true);
    try {
      // Tüm satış verilerini sil
      const salesSnapshot = await getDocs(collection(db, COLLECTIONS.SALES_DATA));
      const batch = writeBatch(db);
      
      salesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Dashboard istatistiklerini sil
      const statsSnapshot = await getDocs(collection(db, COLLECTIONS.DASHBOARD_STATS));
      statsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      setSalesData([]);
      setDashboardStats(null);
      setError(null);
    } catch (err: any) {
      console.error('Error clearing data:', err);
      setError('Veriler silinirken bir hata oluştu: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        salesData,
        dashboardStats,
        isLoading,
        error,
        importData,
        clearData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};