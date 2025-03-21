import { SalesData, DashboardStats } from '../types';

export const analyzeSalesData = (data: SalesData[]): DashboardStats => {
  // Toplam satış sayıları
  const toplamAktivasyonSayisi = data.reduce((sum, sale) => sum + sale.aktivasyon, 0);
  const toplamSmartPcSayisi = data.reduce((sum, sale) => sum + sale.smartPc, 0);
  const toplamTabletSayisi = data.reduce((sum, sale) => sum + sale.tablet, 0);
  const toplamSolSayisi = data.reduce((sum, sale) => sum + sale.sol, 0);
  const toplamRekontratSayisi = data.reduce((sum, sale) => sum + sale.rekontrat, 0);
  const toplamAksesuarSayisi = data.reduce((sum, sale) => sum + sale.aksesuar, 0);
  const toplamVanilyaSayisi = data.reduce((sum, sale) => sum + sale.vanilya, 0);
  const toplamAkgSayisi = data.reduce((sum, sale) => sum + sale.akg, 0);
  
  // Toplam prim
  const toplamPrim = data.reduce((sum, sale) => sum + sale.toplamPrim, 0);
  
  // En iyi personeller
  const personelPerformans = data.reduce((acc: Record<string, number>, sale) => {
    if (!acc[sale.personel]) {
      acc[sale.personel] = 0;
    }
    acc[sale.personel] += sale.toplamPrim;
    return acc;
  }, {});
  
  const enIyiPersoneller = Object.entries(personelPerformans)
    .map(([personel, toplamPrim]) => ({ personel, toplamPrim }))
    .sort((a, b) => b.toplamPrim - a.toplamPrim)
    .slice(0, 5);
  
  // Aylara göre satışlar
  const aylarMap: Record<string, { 
    aktivasyon: number, 
    smartPc: number, 
    tablet: number, 
    sol: number, 
    rekontrat: number 
  }> = {};
  
  data.forEach(sale => {
    const ayYil = `${sale.ay} ${sale.yil}`;
    if (!aylarMap[ayYil]) {
      aylarMap[ayYil] = {
        aktivasyon: 0,
        smartPc: 0,
        tablet: 0,
        sol: 0,
        rekontrat: 0
      };
    }
    
    aylarMap[ayYil].aktivasyon += sale.aktivasyon;
    aylarMap[ayYil].smartPc += sale.smartPc;
    aylarMap[ayYil].tablet += sale.tablet;
    aylarMap[ayYil].sol += sale.sol;
    aylarMap[ayYil].rekontrat += sale.rekontrat;
  });
  
  const satislarByAy = Object.entries(aylarMap)
    .map(([ay, stats]) => ({
      ay,
      ...stats
    }))
    .sort((a, b) => {
      // Ay ve yıl bilgisini ayırıp karşılaştırma yapalım
      const [aAy, aYil] = a.ay.split(' ');
      const [bAy, bYil] = b.ay.split(' ');
      
      // Önce yıla göre sıralama
      if (aYil !== bYil) {
        return Number(aYil) - Number(bYil);
      }
      
      // Sonra aya göre sıralama
      const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      return aylar.indexOf(aAy) - aylar.indexOf(bAy);
    });
  
  // Şubelere göre satışlar
  const subePerformans: Record<string, { toplamSatis: number, toplamPrim: number }> = {};
  
  data.forEach(sale => {
    if (!subePerformans[sale.sube]) {
      subePerformans[sale.sube] = { toplamSatis: 0, toplamPrim: 0 };
    }
    
    const toplamSatis = 
      sale.aktivasyon + 
      sale.smartPc + 
      sale.tablet + 
      sale.sol + 
      sale.rekontrat + 
      sale.aksesuar + 
      sale.vanilya + 
      sale.akg;
    
    subePerformans[sale.sube].toplamSatis += toplamSatis;
    subePerformans[sale.sube].toplamPrim += sale.toplamPrim;
  });
  
  const satislarBySube = Object.entries(subePerformans)
    .map(([sube, { toplamSatis, toplamPrim }]) => ({ 
      sube, 
      toplamSatis, 
      toplamPrim 
    }))
    .sort((a, b) => b.toplamPrim - a.toplamPrim);
  
  // Prim dağılımı
  const primDagilimi = [
    { kategori: 'Aktivasyon', toplamPrim: data.reduce((sum, sale) => sum + sale.aktivasyonPrim, 0) },
    { kategori: 'Smart PC', toplamPrim: data.reduce((sum, sale) => sum + sale.smartPcPrim, 0) },
    { kategori: 'Tablet', toplamPrim: data.reduce((sum, sale) => sum + sale.tabletPrim, 0) },
    { kategori: 'SOL', toplamPrim: data.reduce((sum, sale) => sum + sale.solPrim, 0) },
    { kategori: 'Rekontrat', toplamPrim: data.reduce((sum, sale) => sum + sale.rekontratPrim, 0) },
    { kategori: 'Aksesuar', toplamPrim: data.reduce((sum, sale) => sum + sale.aksesuarPrim, 0) },
    { kategori: 'Vanilya', toplamPrim: data.reduce((sum, sale) => sum + sale.vanilyaPrim, 0) },
    { kategori: 'AKG', toplamPrim: data.reduce((sum, sale) => sum + sale.akgPrim, 0) }
  ].sort((a, b) => b.toplamPrim - a.toplamPrim);
  
  return {
    toplamAktivasyonSayisi,
    toplamSmartPcSayisi,
    toplamTabletSayisi,
    toplamSolSayisi,
    toplamRekontratSayisi,
    toplamAksesuarSayisi,
    toplamVanilyaSayisi,
    toplamAkgSayisi,
    toplamPrim,
    enIyiPersoneller,
    satislarByAy,
    satislarBySube,
    primDagilimi
  };
};