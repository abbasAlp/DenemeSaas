import React from 'react';
import FileUpload from '../components/FileUpload';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const DataImportPage: React.FC = () => {
  const { salesData, isLoading, error, clearData } = useData();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Veri İçe Aktar</h1>
        {salesData.length > 0 && (
          <button
            onClick={clearData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Verileri Temizle
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Excel Dosyası Yükle</h2>
        <FileUpload />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : salesData.length > 0 ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-semibold">Veri başarıyla içe aktarıldı!</p>
          <p>{salesData.length} satış kaydı bulundu.</p>
          <div className="mt-4 flex space-x-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Dashboard'a Git
            </Link>
            <Link
              to="/sales"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Satışları Görüntüle
            </Link>
          </div>
        </div>
      ) : null}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Excel Dosya Formatı</h2>
        <p className="text-gray-600 mb-4">
          Excel dosyanız aşağıdaki sütunları içermelidir:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sütun</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İçerik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Örnek</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">A</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ay</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ocak</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">B</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yıl</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">C</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Şube</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Turkcell Kadıköy</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">E</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Personel</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ahmet Yılmaz</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">F</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Aktivasyon</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">G</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Smart PC</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">H</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tablet</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">I</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SOL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">J</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rekontrat</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">K</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Aksesuar</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">L</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Vanilya</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">M</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AKG</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">N</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Aktivasyon Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">500</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">O</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Smart PC Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">300</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">P</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tablet Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">200</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Q</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SOL Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">R</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rekontrat Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">250</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">S</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Aksesuar Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">T</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Vanilya Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">U</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AKG Primi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">75</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">V</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Toplam Prim</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1625</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataImportPage;