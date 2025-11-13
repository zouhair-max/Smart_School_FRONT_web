import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  School, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Clock, 
  BookOpen, 
  Calendar, 
  AlertTriangle, 
  Bell, 
  Sparkles, 
  Zap, 
  Activity, 
  Eye, 
  Target, 
  Award, 
  RefreshCw, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SchoolsStatus from './SchoolsStatus';

// ============================================================================
// CONSTANTS
// ============================================================================

const SEVERITY_CONFIG = {
  high: { color: '#DC2626', label: 'Critical' },
  medium: { color: '#D97706', label: 'Warning' },
  low: { color: '#059669', label: 'Normal' },
  info: { color: '#6B7280', label: 'Info' },
};

const TREND_CONFIG = {
  up: { color: '#059669', icon: TrendingUp },
  down: { color: '#DC2626', icon: TrendingDown },
  neutral: { color: '#6B7280', icon: null },
};

const CARD_COLORS = {
  schools: '#7C3AED',
  users: '#8B5CF6',
  students: '#10B981',
  teachers: '#F59E0B',
  classes: '#6366F1',
  subjects: '#06B6D4',
};

const CHART_COLORS = ['#7C3AED', '#8B5CF6', '#10B981', '#F59E0B', '#6366F1', '#06B6D4', '#EF4444', '#84CC16'];

const DATE_RANGES = {
  '7days': { label: '7 derniers jours', days: 7 },
  '30days': { label: '30 derniers jours', days: 30 },
  '90days': { label: '3 derniers mois', days: 90 },
  '1year': { label: '1 an', days: 365 },
  'all': { label: 'Toute la période', days: null },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getTrendType = (value) => {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return 0;
  return typeof num === 'number' ? num : parseInt(num, 10) || 0;
};

const calculateProgressValue = (percentage, min = 0, max = 100) => {
  return Math.min(Math.max(percentage + 50, min), max);
};

const filterDataByDateRange = (data, dateRange) => {
  if (!data || !Array.isArray(data)) return [];
  if (dateRange === 'all') return data;

  const days = DATE_RANGES[dateRange].days;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate;
  });
};

const generateDateRangeData = (dateRange, existingData = []) => {
  if (existingData.length > 0) {
    return filterDataByDateRange(existingData, dateRange);
  }

  // Fallback data generation if no data provided
  const days = dateRange === 'all' ? 365 : DATE_RANGES[dateRange].days;
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 10,
      users: Math.floor(Math.random() * 30) + 5,
      absences: Math.floor(Math.random() * 20) + 2
    });
  }

  return data;
};

// ============================================================================
// MOBILE RESPONSIVE COMPONENTS
// ============================================================================

const MobileMenu = React.memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4">
          <div className="space-y-2">
            <div className="px-3 py-2 text-sm font-medium text-gray-900 bg-purple-50 rounded-lg">
              Tableau de Bord
            </div>
            <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Écoles
            </div>
            <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Utilisateurs
            </div>
            <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Rapports
            </div>
            <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Paramètres
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
});

// ============================================================================
// DATE RANGE SELECTOR COMPONENT
// ============================================================================

const DateRangeSelector = React.memo(({ value, onChange, loading = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (range) => {
    onChange(range);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
        <span className="text-gray-700 truncate flex-1 text-left">{DATE_RANGES[value]?.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {Object.entries(DATE_RANGES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                  value === key 
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600' 
                    : 'text-gray-700'
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

const StatCard = React.memo(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  trend, 
  trendValue,
  loading = false,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const trendType = useMemo(() => getTrendType(trendValue), [trendValue]);
  const trendConfig = TREND_CONFIG[trendType];
  const TrendIcon = trendConfig.icon;
  
  const displayValue = loading ? '--' : formatNumber(value).toLocaleString();
  const displayTrendValue = Math.abs(formatNumber(trendValue));

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 border border-gray-200 bg-white animate-pulse">
        <div className="space-y-3">
          <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-16 sm:w-20" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32" />
          <div className="h-2 sm:h-3 bg-gray-200 rounded w-20 sm:w-24" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:shadow-md hover:border-purple-200 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 truncate">
              {displayValue}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-1 truncate">{title}</div>
            <div className="text-xs text-gray-500 truncate">{subtitle}</div>
          </div>
          
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ml-3"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`,
            }}
          >
            <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>

        {trend && trendValue !== 0 && TrendIcon && (
          <div
            className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border"
            style={{
              background: trendValue > 0 ? `${TREND_CONFIG.up.color}10` : `${TREND_CONFIG.down.color}10`,
              borderColor: trendValue > 0 ? `${TREND_CONFIG.up.color}30` : `${TREND_CONFIG.down.color}30`,
            }}
          >
            <TrendIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: trendConfig.color }} />
            <span className="text-xs font-medium" style={{ color: trendConfig.color }}>
              {displayTrendValue}%
            </span>
            <span className="text-xs text-gray-500 ml-auto hidden sm:inline">vs last month</span>
            <span className="text-xs text-gray-500 ml-auto sm:hidden">vs prev</span>
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================================
// ALERT CARD COMPONENT
// ============================================================================

const AlertCard = React.memo(({ 
  title, 
  count, 
  severity = 'info', 
  icon: Icon, 
  description, 
  loading = false 
}) => {
  const severityConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
  const displayCount = loading ? '--' : formatNumber(count);

  return (
    <div
      className="relative overflow-hidden rounded-xl p-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${severityConfig.color} 0%, ${severityConfig.color}DD 100%)`,
          }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{displayCount}</div>
            <div
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white flex-shrink-0"
              style={{ background: severityConfig.color }}
            >
              {severityConfig.label}
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-700 truncate">{title}</div>
          <div className="text-xs text-gray-500 truncate">{description}</div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// CHART COMPONENTS
// ============================================================================

const UsersActivityChart = React.memo(({ data, loading }) => {
  const [dateRange, setDateRange] = useState('30days');

  const chartData = useMemo(() => {
    if (!data?.charts?.users_per_day) {
      return generateDateRangeData(dateRange);
    }
    
    const filteredData = filterDataByDateRange(data.charts.users_per_day, dateRange);
    
    return filteredData.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      users: item.count
    }));
  }, [data, dateRange]);

  if (loading) {
    return (
      <div className="h-64 sm:h-80 flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
        <div className="text-gray-500">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">Activité des Utilisateurs</h3>
          </div>
          <p className="text-gray-500 text-sm">Nouvelles inscriptions par jour</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <DateRangeSelector 
            value={dateRange} 
            onChange={setDateRange}
            loading={loading}
          />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={40}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#666" fontSize={12} width={30} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} utilisateurs`, 'Inscriptions']}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke={CHART_COLORS[0]} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorUsers)"
              name="Utilisateurs"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
        <span className="truncate">Période: {DATE_RANGES[dateRange].label}</span>
        <span>{chartData.length} points de données</span>
      </div>
    </div>
  );
});

const AbsencesTrendChart = React.memo(({ data, loading }) => {
  const [dateRange, setDateRange] = useState('30days');

  const chartData = useMemo(() => {
    if (!data?.charts?.absences_per_day) {
      return generateDateRangeData(dateRange);
    }
    
    const filteredData = filterDataByDateRange(data.charts.absences_per_day, dateRange);
    
    return filteredData.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      absences: item.count
    }));
  }, [data, dateRange]);

  if (loading) {
    return (
      <div className="h-64 sm:h-80 flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
        <div className="text-gray-500">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">Absences par Jour</h3>
          </div>
          <p className="text-gray-500 text-sm">Tendance des absences quotidiennes</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <DateRangeSelector 
            value={dateRange} 
            onChange={setDateRange}
            loading={loading}
          />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="colorAbsences" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={40}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#666" fontSize={12} width={30} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} absences`, 'Absences']}
            />
            <Bar 
              dataKey="absences" 
              fill="url(#colorAbsences)"
              radius={[4, 4, 0, 0]}
              name="Absences"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
        <span className="truncate">Période: {DATE_RANGES[dateRange].label}</span>
        <span>{chartData.length} points de données</span>
      </div>
    </div>
  );
});

const RoleDistributionChart = React.memo(({ data, loading }) => {
  const chartData = useMemo(() => {
    if (!data?.charts?.role_distribution) return [];
    const roleNames = {
      parent: 'Parents',
      teacher: 'Enseignants',
      school_admin: 'Admins',
      super_admin: 'Super Admin'
    };
    return data.charts.role_distribution.map((item, index) => ({
      name: roleNames[item.role] || item.role,
      value: item.total,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="h-64 sm:h-80 flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
        <div className="text-gray-500">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">Distribution des Rôles</h3>
          </div>
          <p className="text-gray-500 text-sm">Répartition par type d'utilisateur</p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
      
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
              formatter={(value, name) => [`${value} utilisateurs`, name]}
            />
            <Legend 
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '20px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const ComparisonChart = React.memo(({ data, loading }) => {
  const chartData = useMemo(() => {
    const mainStats = [
      { name: 'Écoles', value: data?.total_schools || 0, fill: CARD_COLORS.schools },
      { name: 'Utilisateurs', value: data?.total_users || 0, fill: CARD_COLORS.users },
      { name: 'Étudiants', value: data?.total_students || 0, fill: CARD_COLORS.students },
      { name: 'Enseignants', value: data?.total_teachers || 0, fill: CARD_COLORS.teachers },
      { name: 'Classes', value: data?.total_classes || 0, fill: CARD_COLORS.classes },
      { name: 'Matières', value: data?.total_subjects || 0, fill: CARD_COLORS.subjects },
    ];
    return mainStats.filter(item => item.value > 0);
  }, [data]);

  if (loading) {
    return (
      <div className="h-64 sm:h-80 flex items-center justify-center border border-gray-200 rounded-2xl bg-white">
        <div className="text-gray-500">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">Vue d'Ensemble</h3>
          </div>
          <p className="text-gray-500 text-sm">Comparaison des statistiques principales</p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
      
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#666" fontSize={12} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#666" 
              fontSize={12}
              width={60}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// ============================================================================
// GROWTH METRICS COMPONENT
// ============================================================================

const GrowthMetrics = React.memo(({ data, loading }) => {
  const newUsers = formatNumber(data?.new_users_this_week);
  const growthPercentage = formatNumber(data?.trend_user_growth_percentage);
  const trendType = getTrendType(growthPercentage);
  const trendConfig = TREND_CONFIG[trendType];
  const TrendIcon = trendConfig.icon || TrendingUp;
  const progressValue = calculateProgressValue(growthPercentage);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(progressValue), 300);
    return () => clearTimeout(timer);
  }, [progressValue]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Croissance Hebdomadaire</h3>
          <p className="text-gray-600 text-sm truncate">Nouvelles inscriptions cette semaine</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="p-3 sm:p-4 rounded-xl bg-purple-50 border border-purple-100 w-full sm:w-auto">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 text-center sm:text-left">
            {loading ? '--' : newUsers.toLocaleString()}
          </div>
          <div className="text-gray-700 font-medium text-sm sm:text-base text-center sm:text-left">Nouveaux Utilisateurs</div>
        </div>
        
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {TrendIcon && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-md border flex-shrink-0"
                style={{ 
                  background: `${trendConfig.color}10`,
                  borderColor: `${trendConfig.color}30`
                }}
              >
                <TrendIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: trendConfig.color }} />
                <span className="text-xs sm:text-sm font-medium" style={{ color: trendConfig.color }}>
                  {Math.abs(growthPercentage)}%
                </span>
              </div>
            )}
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">vs semaine dernière</span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${trendConfig.color}, ${trendConfig.color}DD)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const OverviewStats = ({ data = {}, onRefresh, loading = false }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshing) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  const isLoading = loading || refreshing;
  
  const overviewData = data.overview || data;
  const schoolsData = data.schools || {}; 

  const statCards = useMemo(() => [
    {
      title: 'Écoles Total',
      value: overviewData.total_schools,
      subtitle: `${formatNumber(overviewData.active_schools)} actives`,
      icon: School,
      color: CARD_COLORS.schools,
    },
    {
      title: 'Utilisateurs Total',
      value: overviewData.total_users,
      subtitle: `${formatNumber(overviewData.active_users)} vérifiés`,
      icon: Users,
      color: CARD_COLORS.users,
      trend: true,
      trendValue: overviewData.trend_user_growth_percentage,
    },
    {
      title: 'Étudiants Actifs',
      value: overviewData.active_students,
      subtitle: `${formatNumber(overviewData.total_students)} total`,
      icon: GraduationCap,
      color: CARD_COLORS.students,
    },
    {
      title: 'Enseignants',
      value: overviewData.total_teachers,
      subtitle: "Personnel d'enseignement",
      icon: Award,
      color: CARD_COLORS.teachers,
    },
    {
      title: 'Classes',
      value: overviewData.total_classes,
      subtitle: 'Classes actives',
      icon: BookOpen,
      color: CARD_COLORS.classes,
    },
    {
      title: 'Matières',
      value: overviewData.total_subjects,
      subtitle: 'Matières enseignées',
      icon: Target,
      color: CARD_COLORS.subjects,
    },
  ], [overviewData]);

  const alertCards = useMemo(() => [
    {
      title: 'Absences en Attente',
      count: overviewData.pending_absences,
      severity: 'medium',
      icon: Clock,
      description: "Absences en attente de validation aujourd'hui",
    },
    {
      title: 'Absences Critiques',
      count: overviewData.critical_absences_today,
      severity: 'high',
      icon: AlertTriangle,
      description: "Absences non justifiées aujourd'hui",
    },
    {
      title: 'Notifications Non Lus',
      count: overviewData.unread_notifications,
      severity: 'low',
      icon: Bell,
      description: 'Notifications système en attente de revue',
    },
  ], [overviewData]);

  return (
    <div className="min-h-screen bg-gray-50 mt-16 sm:mt-9">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900 truncate">Tableau de Bord</h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        {/* Desktop Header */}
        <div className="mb-6 sm:mb-8 hidden lg:block">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Vue d'ensemble des statistiques de votre plateforme éducative</p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-4 sm:mb-6">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>

        {/* Main Statistics Grid - Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {statCards.map((card, index) => (
            <StatCard key={`stat-${index}`} {...card} loading={isLoading} delay={index * 100} />
          ))}
        </div>

        {/* Alert Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            Alertes Rapides & Notifications
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {alertCards.map((alert, index) => (
              <AlertCard key={`alert-${index}`} {...alert} loading={isLoading} />
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="mb-6 sm:mb-8">
          <GrowthMetrics data={overviewData} loading={isLoading} />
        </div>

        {/* Charts Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            Analyses et Graphiques
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <UsersActivityChart data={overviewData} loading={isLoading} />
            <AbsencesTrendChart data={overviewData} loading={isLoading} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <RoleDistributionChart data={overviewData} loading={isLoading} />
            <ComparisonChart data={overviewData} loading={isLoading} />
          </div>
        </div>

        {/* Schools Status Section */}
        <div className="pb-6 sm:pb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <School className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            Statut des Écoles
          </h2>
          
          <SchoolsStatus 
            data={schoolsData} 
            onRefresh={onRefresh} 
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;