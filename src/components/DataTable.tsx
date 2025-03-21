import React, { useState } from 'react';
import { SalesData } from '../types';

interface DataTableProps {
  data: SalesData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data
    .filter(item => 
      // Tüm sayısal değerlerin toplamı 0'dan büyük olmalı
      item.aktivasyon > 0 || 
      item.smartPc > 0 || 
      item.tablet > 0 || 
      item.sol > 0 || 
      item.rekontrat > 0 || 
      item.aksesuar > 0 || 
      item.vanilya > 0 || 
      item.akg > 0 || 
      item.aktivasyonPrim > 0 || 
      item.smartPcPrim > 0 || 
      item.tabletPrim > 0 || 
      item.solPrim > 0 || 
      item.rekontratPrim > 0 || 
      item.aksesuarPrim > 0 || 
      item.vanilyaPrim > 0 || 
      item.akgPrim > 0 || 
      item.canliPrim > 0 || 
      item.toplamPrim > 0
    )
    .slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#001c54] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ay</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Yıl</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Şube</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Personel</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aktivasyon</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Smart PC</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tablet</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">SOL</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rekontrat</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Aksesuar</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Vanilya</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">AKG</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Aktivasyon Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Smart PC Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Tablet Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">SOL Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Rekontrat Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Aksesuar Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Vanilya Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">AKG Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Canlı Prim</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Toplam Prim</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#5f7acd]/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.ay}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.yil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.sube}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#001c54]">{sale.personel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.aktivasyon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.smartPc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.tablet}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.sol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.rekontrat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.aksesuar)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.vanilya)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.akg}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.aktivasyonPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.smartPcPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.tabletPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.solPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.rekontratPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.aksesuarPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.vanilyaPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(sale.akgPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2855ac] font-medium text-right">{formatCurrency(sale.canliPrim)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#001c54] text-right">{formatCurrency(sale.toplamPrim)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={22} className="px-6 py-4 text-center text-sm text-gray-500">
                  Veri bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-700">
              Toplam <span className="font-medium">{data.length}</span> kayıttan{' '}
              <span className="font-medium">{indexOfFirstItem + 1}</span>-
              <span className="font-medium">{Math.min(indexOfLastItem, data.length)}</span> arası gösteriliyor
            </p>
          </div>
          <div>
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md mr-2 bg-[#2855ac] text-white disabled:opacity-50 hover:bg-[#001c54] transition-colors"
              >
                Önceki
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md mx-1 ${
                    currentPage === page 
                      ? 'bg-[#001c54] text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-[#5f7acd] hover:text-white'
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md ml-2 bg-[#2855ac] text-white disabled:opacity-50 hover:bg-[#001c54] transition-colors"
              >
                Sonraki
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;