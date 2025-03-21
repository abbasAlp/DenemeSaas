import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import { Search, Filter } from 'lucide-react';

const SalesPage: React.FC = () => {
  const { salesData, isLoading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sube: '',
    personel: '',
    ay: '',
    yil: '',
  });
  
  const subeler = useMemo(() => {
    return [...new Set(salesData.map(sale => sale.sube))]
      .filter(sube => sube && typeof sube === 'string' && !sube.toLowerCase().includes('şube'))
      .sort();
  }, [salesData]);
  
  const personeller = useMemo(() => {
    let filteredData = salesData;
    
    if (filters.sube) {
      filteredData = salesData.filter(sale => sale.sube.trim() === filters.sube.trim());
    }
    
    return [...new Set(filteredData.map(sale => sale.personel))]
      .filter(personel => personel && typeof personel === 'string' && !personel.toLowerCase().includes('personel'))
      .sort();
  }, [salesData, filters.sube]);
  
  const aylar = useMemo(() => {
    const aylarSirasi = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return [...new Set(salesData.map(sale => sale.ay))]
      .filter(ay => ay && typeof ay === 'string' && !ay.toLowerCase().includes('ay'))
      .sort((a, b) => aylarSirasi.indexOf(a) - aylarSirasi.indexOf(b));
  }, [salesData]);
  
  const yillar = useMemo(() => {
    return [...new Set(salesData.map(sale => sale.yil))]
      .filter(yil => yil && typeof yil === 'string' && !yil.toLowerCase().includes('yıl'))
      .sort((a, b) => b.localeCompare(a));
  }, [salesData]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => {
      if (name === 'sube') {
        return { ...prev, [name]: value, personel: '' };
      }
      return { ...prev, [name]: value };
    });
  };
  
  const filteredData = useMemo(() => {
    return salesData.filter(sale => {
      const searchMatch = 
        searchTerm === '' ||
        sale.personel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.sube.toLowerCase().includes(searchTerm.toLowerCase());
      
      const subeMatch = !filters.sube || sale.sube.trim() === filters.sube.trim();
      const personelMatch = !filters.personel || sale.personel === filters.personel;
      const ayMatch = !filters.ay || sale.ay === filters.ay;
      const yilMatch = !filters.yil || sale.yil === filters.yil;
      
      return searchMatch && subeMatch && personelMatch && ayMatch && yilMatch;
    });
  }, [salesData, searchTerm, filters]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      sube: '',
      personel: '',
      ay: '',
      yil: '',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }
  
  if (salesData.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Henüz veri yok</h2>
        <p className="text-gray-600 mb-6">
          Satışları görüntülemek için önce Excel dosyanızı içe aktarın.
        </p>
        <a
          href="/data-import"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Veri İçe Aktar
        </a>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Satış Verileri</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="text-[#001c54] mr-2" size={20} />
            <h2 className="text-lg font-semibold text-[#001c54]">Filtreler</h2>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#2855ac] text-white rounded-md hover:bg-[#001c54] transition-colors"
          >
            Filtreleri Sıfırla
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şube</label>
            <select
              name="sube"
              value={filters.sube}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2855ac]"
            >
              <option value="">Tüm Şubeler</option>
              {subeler.map(sube => (
                <option key={sube} value={sube}>{sube}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personel</label>
            <select
              name="personel"
              value={filters.personel}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2855ac]"
            >
              <option value="">Tüm Personeller</option>
              {personeller.map(personel => (
                <option key={personel} value={personel}>{personel}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ay</label>
            <select
              name="ay"
              value={filters.ay}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2855ac]"
            >
              <option value="">Tüm Aylar</option>
              {aylar.map(ay => (
                <option key={ay} value={ay}>{ay}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label>
            <select
              name="yil"
              value={filters.yil}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2855ac]"
            >
              <option value="">Tüm Yıllar</option>
              {yillar.map(yil => (
                <option key={yil} value={yil}>{yil}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <DataTable data={filteredData} />
    </div>
  );
};

export default SalesPage;