export interface SalesData {
  id: string;
  ay: string;
  yil: string;
  sube: string;
  personel: string;
  aktivasyon: number;
  smartPc: number;
  tablet: number;
  sol: number;
  rekontrat: number;
  aksesuar: number;
  vanilya: number;
  akg: number;
  aktivasyonPrim: number;
  smartPcPrim: number;
  tabletPrim: number;
  solPrim: number;
  rekontratPrim: number;
  aksesuarPrim: number;
  vanilyaPrim: number;
  akgPrim: number;
  canliPrim: number;
  toplamPrim: number;
}

export interface DashboardStats {
  toplamAktivasyonSayisi: number;
  toplamSmartPcSayisi: number;
  toplamTabletSayisi: number;
  toplamSolSayisi: number;
  toplamRekontratSayisi: number;
  toplamAksesuarSayisi: number;
  toplamVanilyaSayisi: number;
  toplamAkgSayisi: number;
  canliPrim: number;
  toplamPrim: number;
  enIyiPersoneller: {personel: string, toplamPrim: number}[];
  satislarByAy: {ay: string, aktivasyon: number, smartPc: number, tablet: number, sol: number, rekontrat: number}[];
  satislarBySube: {sube: string, toplamSatis: number, toplamPrim: number}[];
  primDagilimi: {kategori: string, toplamPrim: number}[];
}