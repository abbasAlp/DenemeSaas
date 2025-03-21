import React from 'react';
import { Smartphone, FileSpreadsheet, BarChart3, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Turkcell Mağaza Yönetim Sistemi</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Excel verilerinizi içe aktarın, satış analizlerinizi görüntüleyin ve mağazanızın performansını takip edin.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/data-import" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
              <FileSpreadsheet size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Veri İçe Aktar</h2>
            <p className="text-gray-600">
              Excel dosyalarınızı sisteme yükleyin ve satış verilerinizi analiz edin.
            </p>
          </div>
        </Link>
        
        <Link to="/dashboard" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mb-4">
              <BarChart3 size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p className="text-gray-600">
              Satış performansınızı grafikler ve istatistiklerle görüntüleyin.
            </p>
          </div>
        </Link>
        
        <Link to="/sales" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-4">
              <Award size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Personel Performansı</h2>
            <p className="text-gray-600">
              Personel bazlı satış ve prim verilerini görüntüleyin.
            </p>
          </div>
        </Link>
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Nasıl Kullanılır?</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li className="text-gray-700">
            <span className="font-medium">Veri İçe Aktar</span> sayfasından Excel dosyanızı yükleyin.
          </li>
          <li className="text-gray-700">
            <span className="font-medium">Dashboard</span> sayfasından satış analizlerinizi görüntüleyin.
          </li>
          <li className="text-gray-700">
            <span className="font-medium">Personel Performansı</span> sayfasından personel bazlı verileri inceleyebilirsiniz.
          </li>
        </ol>
      </div>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">Excel Dosya Formatı</h2>
        <p className="text-gray-700 mb-4">
          Excel dosyanızda aşağıdaki sütunlar bulunmalıdır:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          <li className="text-gray-700"><span className="font-medium">A:</span> Ay</li>
          <li className="text-gray-700"><span className="font-medium">B:</span> Yıl</li>
          <li className="text-gray-700"><span className="font-medium">C:</span> Şube</li>
          <li className="text-gray-700"><span className="font-medium">E:</span> Personel</li>
          <li className="text-gray-700"><span className="font-medium">F:</span> Aktivasyon</li>
          <li className="text-gray-700"><span className="font-medium">G:</span> Smart PC</li>
          <li className="text-gray-700"><span className="font-medium">H:</span> Tablet</li>
          <li className="text-gray-700"><span className="font-medium">I:</span> SOL</li>
          <li className="text-gray-700"><span className="font-medium">J:</span> Rekontrat</li>
          <li className="text-gray-700"><span className="font-medium">K:</span> Aksesuar</li>
          <li className="text-gray-700"><span className="font-medium">L:</span> Vanilya</li>
          <li className="text-gray-700"><span className="font-medium">M:</span> AKG</li>
          <li className="text-gray-700"><span className="font-medium">N-U:</span> Prim Değerleri</li>
          <li className="text-gray-700"><span className="font-medium">V:</span> Toplam Prim</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;