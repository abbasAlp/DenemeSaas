import { read, utils } from 'xlsx';
import { SalesData } from '../types';

export const importExcelData = (file: File): Promise<SalesData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet, { 
          header: 'A', 
          raw: true,
          range: 1  // İlk satırı atla
        });
        
        // Transform the data to match our SalesData interface
        const salesData: SalesData[] = jsonData
          .filter((row: any) => row.A && row.B && row.C)
          .map((row: any, index) => ({
            id: `sale-${index}`,
            ay: String(row.A || '').trim(),
            yil: String(row.B || '').trim(),
            sube: String(row.C || '').trim(),
            personel: String(row.E || '').trim(),
            aktivasyon: Number(row.F) || 0,
            smartPc: Number(row.G) || 0,
            tablet: Number(row.H) || 0,
            sol: Number(row.I) || 0,
            rekontrat: Number(row.J) || 0,
            aksesuar: Math.round(parseFloat(String(row.K).replace(/[^\d.-]/g, '')) || 0),
            vanilya: Math.round(parseFloat(String(row.L).replace(/[^\d.-]/g, '')) || 0),
            akg: Number(row.M) || 0,
            aktivasyonPrim: Math.round(parseFloat(String(row.N).replace(/[^\d.-]/g, '')) || 0),
            smartPcPrim: Math.round(parseFloat(String(row.O).replace(/[^\d.-]/g, '')) || 0),
            tabletPrim: Math.round(parseFloat(String(row.P).replace(/[^\d.-]/g, '')) || 0),
            solPrim: Math.round(parseFloat(String(row.Q).replace(/[^\d.-]/g, '')) || 0),
            rekontratPrim: Math.round(parseFloat(String(row.R).replace(/[^\d.-]/g, '')) || 0),
            aksesuarPrim: Math.round(parseFloat(String(row.S).replace(/[^\d.-]/g, '')) || 0),
            vanilyaPrim: Math.round(parseFloat(String(row.T).replace(/[^\d.-]/g, '')) || 0),
            akgPrim: Math.round(parseFloat(String(row.U).replace(/[^\d.-]/g, '')) || 0),
            canliPrim: Math.round(parseFloat(String(row.V).replace(/[^\d.-]/g, '')) || 0),
            toplamPrim: Math.round(parseFloat(String(row.W).replace(/[^\d.-]/g, '')) || 0)
          }))
          .filter(sale => sale.sube !== '');
        
        console.log('Imported data:', salesData);
        resolve(salesData);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};