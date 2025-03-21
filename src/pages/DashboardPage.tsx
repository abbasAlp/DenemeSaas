import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { 
  ShoppingBag, DollarSign, TrendingUp, Users, Award, 
  Smartphone, Tablet, Monitor, Repeat, Package, Coffee, 
  Headphones, Briefcase, CreditCard, Wallet, Filter
} from 'lucide-react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Turkcell renk paleti
const colors = {
  dark: '#001c54',
  primary: '#2855ac',
  light: '#5f7acd',
  yellow: '#ffc72c',
  lightBlue: 'rgba(95, 122, 205, 0.1)',
  white: '#ffffff'
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: {
          family: "'Segoe UI', sans-serif",
          size: 12
        },
        padding: 20,
        usePointStyle: true,
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 28, 84, 0.1)',
      },
      ticks: {
        font: {
          family: "'Segoe UI', sans-serif"
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: "'Segoe UI', sans-serif"
        }
      }
    }
  }
};

const DashboardPage: React.FC = () => {
  const { salesData, dashboardStats, isLoading, error } = useData();
  const [selectedPersonel, setSelectedPersonel] = useState<string>('');
  const [selectedSube, setSelectedSube] = useState<string>('');
  const [selectedAy, setSelectedAy] = useState<string>('');
  const [selectedYil, setSelectedYil] = useState<string>('');
  
  const subeler = useMemo(() => {
    return [...new Set(salesData.map(sale => sale.sube))]
      .filter(sube => sube && typeof sube === 'string' && !sube.toLowerCase().includes('şube') && !sube.toLowerCase().includes('sube'))
      .sort();
  }, [salesData]);
  
  const personeller = useMemo(() => {
    let filteredData = salesData;
    if (selectedSube) {
      filteredData = filteredData.filter(sale => sale.sube === selectedSube);
    }
    return [...new Set(filteredData.map(sale => sale.personel))].sort();
  }, [salesData, selectedSube]);
  
  const aylar = useMemo(() => {
    return [...new Set(salesData.map(sale => sale.ay))]
      .filter(ay => ay && typeof ay === 'string' && !ay.toLowerCase().includes('ay'))
      .sort((a, b) => {
        const aylarSirasi = [
          'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        return aylarSirasi.indexOf(a) - aylarSirasi.indexOf(b);
      });
  }, [salesData]);
  
  const yillar = useMemo(() => {
    return [...new Set(salesData.map(sale => sale.yil))]
      .filter(yil => yil && typeof yil === 'string' && !yil.toLowerCase().includes('yıl') && !yil.toLowerCase().includes('yil'))
      .sort((a, b) => b.localeCompare(a));
  }, [salesData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'sube') {
      setSelectedSube(value);
      setSelectedPersonel('');
    } else if (name === 'personel') {
      setSelectedPersonel(value);
    } else if (name === 'ay') {
      setSelectedAy(value);
    } else if (name === 'yil') {
      setSelectedYil(value);
    }
  };

  const resetFilters = () => {
    setSelectedSube('');
    setSelectedPersonel('');
    setSelectedAy('');
    setSelectedYil('');
  };

  const calculatePerformanceStats = useMemo(() => {
    if (!salesData.length) return { branchPerformance: [], companyPerformance: [] };

    // Şube bazlı performans hesaplama
    const branchStats: Record<string, { personel: string; prim: number; total: number }> = {};
    const companyStats: Record<string, { personel: string; prim: number; total: number }> = {};
    let branchTotal = 0;
    let companyTotal = 0;

    // Seçili şube için performans hesaplama
    if (selectedSube) {
      salesData
        .filter(sale => sale.sube === selectedSube)
        .forEach(sale => {
          if (!branchStats[sale.personel]) {
            branchStats[sale.personel] = { personel: sale.personel, prim: 0, total: 0 };
          }
          branchStats[sale.personel].prim += sale.toplamPrim;
          branchTotal += sale.toplamPrim;
        });
    }

    // Firma geneli için performans hesaplama
    salesData.forEach(sale => {
      if (!companyStats[sale.personel]) {
        companyStats[sale.personel] = { personel: sale.personel, prim: 0, total: 0 };
      }
      companyStats[sale.personel].prim += sale.toplamPrim;
      companyTotal += sale.toplamPrim;
    });

    // Yüzdeleri hesaplama
    Object.values(branchStats).forEach(stat => {
      stat.total = branchTotal;
    });

    Object.values(companyStats).forEach(stat => {
      stat.total = companyTotal;
    });

    return {
      branchPerformance: Object.values(branchStats)
        .sort((a, b) => b.prim - a.prim)
        .slice(0, 5)
        .map(stat => ({
          ...stat,
          percentage: ((stat.prim / stat.total) * 100).toFixed(1)
        })),
      companyPerformance: Object.values(companyStats)
        .sort((a, b) => b.prim - a.prim)
        .slice(0, 5)
        .map(stat => ({
          ...stat,
          percentage: ((stat.prim / stat.total) * 100).toFixed(1)
        }))
    };
  }, [salesData, selectedSube]);

  const filteredStats = useMemo(() => {
    if (!dashboardStats) return null;
    
    let filteredData = [...salesData];
    
    if (selectedSube) {
      filteredData = filteredData.filter(sale => sale.sube === selectedSube);
    }
    if (selectedPersonel) {
      filteredData = filteredData.filter(sale => sale.personel === selectedPersonel);
    }
    if (selectedAy) {
      filteredData = filteredData.filter(sale => sale.ay === selectedAy);
    }
    if (selectedYil) {
      filteredData = filteredData.filter(sale => sale.yil === selectedYil);
    }
    
    return {
      ...dashboardStats,
      toplamAktivasyonSayisi: filteredData.reduce((sum, sale) => sum + sale.aktivasyon, 0),
      toplamSmartPcSayisi: filteredData.reduce((sum, sale) => sum + sale.smartPc, 0),
      toplamTabletSayisi: filteredData.reduce((sum, sale) => sum + sale.tablet, 0),
      toplamSolSayisi: filteredData.reduce((sum, sale) => sum + sale.sol, 0),
      toplamRekontratSayisi: filteredData.reduce((sum, sale) => sum + sale.rekontrat, 0),
      toplamAksesuarSayisi: filteredData.reduce((sum, sale) => sum + sale.aksesuar, 0),
      toplamVanilyaSayisi: filteredData.reduce((sum, sale) => sum + sale.vanilya, 0),
      toplamAkgSayisi: filteredData.reduce((sum, sale) => sum + sale.akg, 0),
      canliPrim: filteredData.reduce((sum, sale) => sum + sale.canliPrim, 0),
      toplamPrim: filteredData.reduce((sum, sale) => sum + sale.toplamPrim, 0),
      primDagilimi: [
        { kategori: 'Aktivasyon', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.aktivasyonPrim, 0) },
        { kategori: 'Smart PC', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.smartPcPrim, 0) },
        { kategori: 'Tablet', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.tabletPrim, 0) },
        { kategori: 'SOL', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.solPrim, 0) },
        { kategori: 'Rekontrat', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.rekontratPrim, 0) },
        { kategori: 'Aksesuar', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.aksesuarPrim, 0) },
        { kategori: 'Vanilya', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.vanilyaPrim, 0) },
        { kategori: 'AKG', toplamPrim: filteredData.reduce((sum, sale) => sum + sale.akgPrim, 0) }
      ].sort((a, b) => b.toplamPrim - a.toplamPrim)
    };
  }, [dashboardStats, salesData, selectedSube, selectedPersonel, selectedAy, selectedYil]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2855ac]"></div>
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

  if (!filteredStats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4 text-[#001c54]">Henüz veri yok</h2>
        <p className="text-gray-600 mb-6">
          Dashboard'u görüntülemek için önce Excel dosyanızı içe aktarın.
        </p>
        <a
          href="/data-import"
          className="px-4 py-2 bg-[#2855ac] text-white rounded-md hover:bg-[#001c54] transition-colors"
        >
          Veri İçe Aktar
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#001c54]">Dashboard</h1>
      </div>

      {/* Filtreler */}
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
              value={selectedSube}
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
              value={selectedPersonel}
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
              value={selectedAy}
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
              value={selectedYil}
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

      {/* Satış Performansı */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#001c54]">Satış Performansı</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Aktivasyon"
            value={filteredStats.toplamAktivasyonSayisi}
            icon={Smartphone}
            color="bg-[#2855ac]"
          />
          <StatCard
            title="Smart PC"
            value={filteredStats.toplamSmartPcSayisi}
            icon={Monitor}
            color="bg-[#001c54]"
          />
          <StatCard
            title="Tablet"
            value={filteredStats.toplamTabletSayisi}
            icon={Tablet}
            color="bg-[#5f7acd]"
          />
          <StatCard
            title="SOL"
            value={filteredStats.toplamSolSayisi}
            icon={ShoppingBag}
            color="bg-[#ffc72c]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <StatCard
            title="Rekontrat"
            value={filteredStats.toplamRekontratSayisi}
            icon={Repeat}
            color="bg-[#2855ac]"
          />
          <StatCard
            title="Aksesuar"
            value={formatCurrency(filteredStats.toplamAksesuarSayisi)}
            icon={Package}
            color="bg-[#001c54]"
          />
          <StatCard
            title="Vanilya"
            value={formatCurrency(filteredStats.toplamVanilyaSayisi)}
            icon={Coffee}
            color="bg-[#5f7acd]"
          />
          <StatCard
            title="AKG"
            value={filteredStats.toplamAkgSayisi}
            icon={Headphones}
            color="bg-[#ffc72c]"
          />
        </div>
      </div>

      {/* Prim Kazançları */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#001c54]">Prim Kazançları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Aktivasyon Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'Aktivasyon')?.toplamPrim || 0)}
            icon={Smartphone}
            color="bg-[#2855ac]"
          />
          <StatCard
            title="Smart PC Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'Smart PC')?.toplamPrim || 0)}
            icon={Monitor}
            color="bg-[#001c54]"
          />
          <StatCard
            title="Tablet Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'Tablet')?.toplamPrim || 0)}
            icon={Tablet}
            color="bg-[#5f7acd]"
          />
          <StatCard
            title="SOL Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'SOL')?.toplamPrim || 0)}
            icon={ShoppingBag}
            color="bg-[#ffc72c]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <StatCard
            title="Rekontrat Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'Rekontrat')?.toplamPrim || 0)}
            icon={Repeat}
            color="bg-[#2855ac]"
          />
          <StatCard
            title="Aksesuar Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'Aksesuar')?.toplamPrim || 0)}
            icon={Package}
            color="bg-[#001c54]"
          />
          <StatCard
            title="Vanilya Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'Vanilya')?.toplamPrim || 0)}
            icon={Coffee}
            color="bg-[#5f7acd]"
          />
          <StatCard
            title="AKG Prim"
            value={formatCurrency(filteredStats.primDagilimi.find(p => p.kategori === 'AKG')?.toplamPrim || 0)}
            icon={Headphones}
            color="bg-[#ffc72c]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <StatCard
            title="Canlı Prim"
            value={formatCurrency(filteredStats.canliPrim)}
            icon={Wallet}
            color="bg-[#2855ac]"
          />
          <StatCard
            title="Toplam Prim"
            value={formatCurrency(filteredStats.toplamPrim)}
            icon={DollarSign}
            color="bg-[#001c54]"
          />
          <StatCard
            title="Ortalama Prim"
            value={formatCurrency(filteredStats.toplamPrim / (personeller.length || 1))}
            icon={TrendingUp}
            color="bg-[#5f7acd]"
          />
        </div>
      </div>

      {/* Grafikler ve Performans Tabloları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Taraf - Grafikler */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#001c54]">Prim Dağılımı</h2>
            <div className="h-[300px]">
              <Doughnut 
                data={{
                  labels: filteredStats.primDagilimi.map(item => item.kategori),
                  datasets: [{
                    data: filteredStats.primDagilimi.map(item => item.toplamPrim),
                    backgroundColor: [
                      colors.primary,
                      colors.dark,
                      colors.light,
                      colors.yellow,
                      '#4B9CD3',
                      '#1E3A8A',
                      '#6366F1',
                      '#3B82F6'
                    ]
                  }]
                }}
                options={{
                  ...chartOptions,
                  cutout: '60%',
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#001c54]">Şube Performansı</h2>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: dashboardStats?.satislarBySube?.map(item => item.sube) || [],
                  datasets: [
                    {
                      label: 'Toplam Satış',
                      data: dashboardStats?.satislarBySube?.map(item => item.toplamSatis) || [],
                      backgroundColor: colors.yellow
                    },
                    {
                      label: 'Toplam Prim',
                      data: dashboardStats?.satislarBySube?.map(item => item.toplamPrim) || [],
                      backgroundColor: colors.primary
                    }
                  ]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Performans Tabloları */}
        <div className="space-y-6">
          {/* Şube Bazlı Performans */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#001c54]">
              {selectedSube ? `${selectedSube} Şubesi Performans Sıralaması` : 'Şube Seçiniz'}
            </h2>
            {selectedSube ? (
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-[#001c54] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sıra</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Personel</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Toplam Prim</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Şube Katkısı</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {calculatePerformanceStats.branchPerformance.map((stat, index) => (
                      <tr key={stat.personel} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.personel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(stat.prim)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#2855ac]">
                          %{stat.percentage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Şube bazlı performans için lütfen bir şube seçin.</p>
            )}
          </div>

          {/* Firma Geneli Performans */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#001c54]">Firma Geneli Performans Sıralaması</h2>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#001c54] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sıra</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Personel</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Toplam Prim</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Firma Katkısı</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculatePerformanceStats.companyPerformance.map((stat, index) => (
                    <tr key={stat.personel} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.personel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(stat.prim)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#2855ac]">
                        %{stat.percentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;