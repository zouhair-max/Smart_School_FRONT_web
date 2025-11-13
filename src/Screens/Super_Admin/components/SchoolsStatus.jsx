import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, 
  School, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Bell,
  BarChart3,
  Activity,
  Target,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  MoreVertical,
  Zap,
  Award,
  Target as TargetIcon,
  Menu,
  X
} from 'lucide-react';
import SchoolModal from './Modal/SchoolModal';

// ============================================================================
// CONSTANTS
// ============================================================================

const SEVERITY_CONFIG = {
  high: { color: '#DC2626', label: 'Critical' },
  medium: { color: '#D97706', label: 'Warning' },
  low: { color: '#059669', label: 'Normal' },
  info: { color: '#6B7280', label: 'Info' },
};

const CARD_COLORS = {
  total: '#7C3AED',
  active: '#10B981',
  inactive: '#EF4444',
  average: '#8B5CF6',
  performance: '#F59E0B',
  capacity: '#06B6D4'
};

const STATUS_CONFIG = {
  active: { color: '#10B981', label: 'Active', bgColor: '#10B98110', borderColor: '#10B98130' },
  inactive: { color: '#EF4444', label: 'Inactive', bgColor: '#EF444410', borderColor: '#EF444430' },
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
              Gestion des Écoles
            </div>
            <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Tableau de Bord
            </div>
            <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Liste des Écoles
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
// UTILITY FUNCTIONS
// ============================================================================

const formatNumber = (num) => {
  if (num === null || num === undefined) return 0;
  return typeof num === 'number' ? num : parseInt(num, 10) || 0;
};

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

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const displayValue = loading ? '--' : formatNumber(value).toLocaleString();

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

        {trend && trendValue !== undefined && (
          <div
            className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border"
            style={{
              background: trendValue > 0 ? '#10B98110' : '#EF444410',
              borderColor: trendValue > 0 ? '#10B98130' : '#EF444430',
            }}
          >
            <TrendingUp className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${trendValue > 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-xs font-medium ${trendValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trendValue)}%
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
// SCHOOL CARD COMPONENT
// ============================================================================

const SchoolCard = React.memo(({ 
  school, 
  index, 
  maxStudents,
  loading = false 
}) => {
  const percentage = maxStudents > 0 ? (school.total_students / maxStudents) * 100 : 0;
  const statusConfig = STATUS_CONFIG[school.is_active ? 'active' : 'inactive'];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0 animate-pulse">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 sm:w-1/2" />
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-full sm:w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  const rankColors = [
    { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
    { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' },
    { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
  ];

  const progressColors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-gray-400 to-gray-500'
  ];

  const currentRankColor = rankColors[index] || { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' };
  const currentProgressColor = progressColors[index] || progressColors[3];

  return (
    <div className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 group">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Rank Badge */}
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg border-2 ${currentRankColor.bg} ${currentRankColor.border} ${currentRankColor.text} transition-transform duration-300 group-hover:scale-110`}>
          {index + 1}
        </div>

        {/* School Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {school.name}
            </h3>
            <span 
              className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 flex-shrink-0 w-fit"
              style={{
                background: statusConfig.bgColor,
                borderColor: statusConfig.borderColor,
                color: statusConfig.color
              }}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
              <span className="font-medium text-gray-900">{formatNumber(school.total_students).toLocaleString()}</span>
              <span className="hidden sm:inline">students</span>
              <span className="sm:hidden">std</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
              <span className="font-medium text-gray-900">{formatNumber(school.total_users).toLocaleString()}</span>
              <span className="hidden sm:inline">users</span>
              <span className="sm:hidden">usr</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span className="font-medium text-gray-900">{formatNumber(school.total_classes).toLocaleString()}</span>
              <span className="hidden sm:inline">classes</span>
              <span className="sm:hidden">cls</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${currentProgressColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 min-w-[35px] sm:min-w-[45px] text-right">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// GROWTH METRICS COMPONENT
// ============================================================================

const GrowthMetrics = React.memo(({ data, loading }) => {
  const newSchools = formatNumber(data?.new_schools_this_month);
  const growthPercentage = formatNumber(data?.growth_rate) || 12;
  const progressValue = Math.min(Math.max(growthPercentage + 50, 0), 100);

  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
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
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Croissance Mensuelle</h3>
          <p className="text-gray-600 text-sm truncate">Nouvelles écoles ce mois-ci</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="p-3 sm:p-4 rounded-xl bg-purple-50 border border-purple-100 w-full sm:w-auto">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 text-center sm:text-left">
            {loading ? '--' : newSchools.toLocaleString()}
          </div>
          <div className="text-gray-700 font-medium text-sm sm:text-base text-center sm:text-left">Nouvelles Écoles</div>
        </div>
        
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md border flex-shrink-0"
              style={{ 
                background: '#10B98110',
                borderColor: '#10B98130'
              }}
            >
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-600">
                {growthPercentage}%
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">vs mois dernier</span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #10B981, #10B981DD)',
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

const SchoolsStatus = ({ data = {}, onRefresh, loading = false, compact = false }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const isLoading = loading || refreshing;
  const { list = [], summary = {} } = data;

  // Calculate derived data
  const maxStudents = React.useMemo(() => {
    if (!summary.schools_with_most_students?.length) return 0;
    return Math.max(...summary.schools_with_most_students.map(s => formatNumber(s.total_students)));
  }, [summary]);

  const avgStudents = React.useMemo(() => {
    if (!list.length) return 0;
    const total = list.reduce((acc, school) => acc + formatNumber(school.total_students), 0);
    return Math.round(total / list.length);
  }, [list]);

  const statCards = React.useMemo(() => [
    {
      title: 'Écoles Total',
      value: list.length,
      subtitle: 'Toutes les institutions',
      icon: School,
      color: CARD_COLORS.total,
      trend: true,
      trendValue: 5,
    },
    {
      title: 'Écoles Actives',
      value: summary.active_schools || list.filter(s => s.is_active).length,
      subtitle: 'En fonctionnement',
      icon: CheckCircle,
      color: CARD_COLORS.active,
      trend: true,
      trendValue: 8,
    },
    {
      title: 'Écoles Inactives',
      value: summary.inactive_schools || list.filter(s => !s.is_active).length,
      subtitle: 'Non opérationnelles',
      icon: XCircle,
      color: CARD_COLORS.inactive,
    },
    {
      title: 'Moyenne Étudiante',
      value: avgStudents,
      subtitle: 'Par établissement',
      icon: Users,
      color: CARD_COLORS.average,
    },
    {
      title: 'Performance Moyenne',
      value: '87%',
      subtitle: 'Score global',
      icon: Award,
      color: CARD_COLORS.performance,
    },
    {
      title: 'Capacité Totale',
      value: list.reduce((acc, school) => acc + formatNumber(school.total_students), 0),
      subtitle: 'Étudiants total',
      icon: TargetIcon,
      color: CARD_COLORS.capacity,
    },
  ], [list, summary, avgStudents]);

  const alertCards = React.useMemo(() => [
    {
      title: 'Approbations en attente',
      count: summary.pending_approvals || 5,
      severity: 'medium',
      icon: Clock,
      description: "En attente de validation",
    },
    {
      title: 'Écoles peu actives',
      count: summary.low_activity_schools || 2,
      severity: 'high',
      icon: AlertTriangle,
      description: "Nécessitent une attention",
    },
    {
      title: 'Nouvelles écoles',
      count: summary.recently_added || 3,
      severity: 'low',
      icon: Bell,
      description: "Ajoutées ce mois-ci",
    },
  ], [summary]);

  const topSchools = React.useMemo(() => {
    return summary.schools_with_most_students || [
      {
        id: 1,
        name: "Greenwood High School",
        total_students: 15,
        total_users: 17,
        total_classes: 15,
        is_active: true
      },
      {
        id: 2,
        name: "Riverside Academy",
        total_students: 12,
        total_users: 14,
        total_classes: 12,
        is_active: true
      },
      {
        id: 3,
        name: "Sunshine Elementary",
        total_students: 10,
        total_users: 12,
        total_classes: 10,
        is_active: true
      },
      {
        id: 4,
        name: "Mountain View School",
        total_students: 8,
        total_users: 10,
        total_classes: 8,
        is_active: true
      },
      {
        id: 5,
        name: "City Central College",
        total_students: 6,
        total_users: 8,
        total_classes: 6,
        is_active: false
      }
    ];
  }, [summary]);

  return (
    <div className="min-h-screen bg-gray-50 mt-16 sm:mt-10">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900 truncate">Gestion des Écoles</h1>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Écoles</h1>
          <p className="text-gray-600">Vue d'ensemble complète de toutes les institutions éducatives</p>
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

        {/* Main Statistics Grid */}
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
          <GrowthMetrics data={summary} loading={isLoading} />
        </div>

        {/* Top Schools Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            Classement des Écoles
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    Écoles avec le Plus d'Étudiants
                  </h3>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {isLoading ? 'Chargement...' : `${topSchools.length} écoles classées`}
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <SchoolCard 
                    key={`skeleton-${index}`}
                    school={{}} 
                    index={index} 
                    maxStudents={0}
                    loading={true}
                  />
                ))
              ) : topSchools.length > 0 ? (
                topSchools.map((school, index) => (
                  <SchoolCard 
                    key={school.id} 
                    school={school} 
                    index={index} 
                    maxStudents={maxStudents}
                    loading={false}
                  />
                ))
              ) : (
                <div className="p-6 sm:p-8 text-center text-gray-500">
                  <School className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm sm:text-base">Aucune donnée d'école disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Résumé des Performances</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm sm:text-base text-gray-600">Taux d'activité</span>
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {isLoading ? '--' : list.length > 0 ? Math.round((summary.active_schools / list.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm sm:text-base text-gray-600">Écoles récentes (30j)</span>
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {isLoading ? '--' : formatNumber(summary.recently_added || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base text-gray-600">Capacité moyenne</span>
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {isLoading ? '--' : `${avgStudents} étudiants`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Actions Rapides</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <button className="w-full text-left p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center gap-3 group">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">Ajouter une école</div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">Créer une nouvelle institution</div>
                </div>
              </button>
              <button className="w-full text-left p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center gap-3 group">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">Voir tous les rapports</div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">Analyses détaillées</div>
                </div>
              </button>
              <button className="w-full text-left p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center gap-3 group">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">Statistiques avancées</div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">Métriques détaillées</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <SchoolModal />
    </div>
  );
};

export default SchoolsStatus;