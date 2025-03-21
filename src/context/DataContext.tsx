import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SalesData, DashboardStats } from '../types';
import { analyzeSalesData } from '../utils/dataAnalysis';
import { importExcelData } from '../utils/excelImport';

// Local Storage Keys
const STORAGE_KEYS = {
  SALES_DATA: 'turkcell_magaza_sales_data',
  DASHBOARD_STATS: 'turkcell_magaza_dashboard_stats'
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

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [salesData, setSalesData] = useState<SalesData[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SALES_DATA);
    return savedData ? JSON.parse(savedData) : [];
  });

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(() => {
    const savedStats = localStorage.getItem(STORAGE_KEYS.DASHBOARD_STATS);
    return savedStats ? JSON.parse(savedStats) : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (salesData.length > 0) {
      localStorage.setItem(STORAGE_KEYS.SALES_DATA, JSON.stringify(salesData));
    }
  }, [salesData]);

  useEffect(() => {
    if (dashboardStats) {
      localStorage.setItem(STORAGE_KEYS.DASHBOARD_STATS, JSON.stringify(dashboardStats));
    }
  }, [dashboardStats]);

  const importData = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await importExcelData(file);
      console.log('Data imported successfully:', data.length, 'records');
      
      if (data.length === 0) {
        throw new Error('Excel dosyasından veri alınamadı. Lütfen dosya formatını kontrol edin.');
      }
      
      setSalesData(data);
      const stats = analyzeSalesData(data);
      setDashboardStats(stats);
    } catch (err: any) {
      console.error('Error importing data:', err);
      setError(`Veri içe aktarılırken bir hata oluştu: ${err.message || 'Bilinmeyen hata'}. Lütfen Excel dosyanızı kontrol edin.`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setSalesData([]);
    setDashboardStats(null);
    setError(null);
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.SALES_DATA);
    localStorage.removeItem(STORAGE_KEYS.DASHBOARD_STATS);
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