// src/components/SuperAdminDashboard/components/UsersStatus.jsx
import React, { useState } from 'react';
import UsersModal from './Modal/UsersModal';

const UsersStatus = ({ data, onRefresh }) => {
  const { by_role, verification_status, recent_users, users_without_school } = data;
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const roleData = Object.entries(by_role).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count,
    percentage: (count / Object.values(by_role).reduce((a, b) => a + b, 0)) * 100
  }));

  const totalUsers = Object.values(by_role).reduce((a, b) => a + b, 0);
  const verifiedUsers = verification_status?.verified || 0;
  const pendingUsers = verification_status?.pending || 0;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'blue',
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Verified Users',
      value: verifiedUsers,
      icon: <VerifiedIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'green',
      trend: { value: 8.3, isPositive: true }
    },
    {
      title: 'Pending Verification',
      value: pendingUsers,
      icon: <ShieldIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'orange',
      trend: { value: 3.2, isPositive: false }
    },
    {
      title: 'Users Without School',
      value: users_without_school || 0,
      icon: <SchoolIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'red',
      trend: { value: 5.7, isPositive: false }
    }
  ];

  const filters = [
    { id: 'all', label: 'All Roles' },
    { id: 'verified', label: 'Verified Only' },
    { id: 'pending', label: 'Pending' },
    { id: 'no_school', label: 'No School' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 p-4 sm:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 mt-16 sm:mt-8 backdrop-blur-sm bg-white/95">
        {/* Header with Title and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl sm:rounded-2xl">
              <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Users Overview
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Manage and monitor all user activities
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm font-medium text-gray-700"
              >
                <RefreshIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setIsUsersModalOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <ChartPieIcon className="w-4 h-4" />
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {stats.map((stat, index) => (
            <div 
              key={stat.title}
              className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 hover:shadow-lg group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`text-${stat.color}-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 truncate`}>
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className={`flex items-center gap-1 text-xs sm:text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon isPositive={stat.trend.isPositive} className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-semibold">
                      {stat.trend.isPositive ? '+' : ''}{stat.trend.value}%
                    </span>
                    <span className="text-gray-500 ml-1 hidden sm:inline">from last week</span>
                    <span className="text-gray-500 ml-1 sm:hidden">last week</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-3`}>
                  {React.cloneElement(stat.icon, { 
                    className: `w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600` 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Role Distribution */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/95">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl sm:rounded-2xl">
                <ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Role Distribution</h2>
                <p className="text-gray-600 text-sm">Breakdown of users by role</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {roleData.map((role, index) => (
              <RoleProgress 
                key={role.name} 
                role={role} 
                total={totalUsers}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Recent Users */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/95">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl sm:rounded-2xl">
                  <ActivityIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-gray-600 text-sm">Latest user registrations</p>
                </div>
              </div>
              <TrendUpIcon className="w-5 h-5 text-green-600" />
            </div>

            <div className="space-y-3">
              {recent_users?.slice(0, 4).map((user, index) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-white rounded-xl transition-all duration-200 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {user.name || 'Unknown User'}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">
                      {user.email || 'No email'}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize flex-shrink-0">
                    {user.role || 'user'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Alerts */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-white/95">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl sm:rounded-2xl">
                  <AlertIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quick Alerts</h2>
                  <p className="text-gray-600 text-sm">Requires attention</p>
                </div>
              </div>
              <ClockIcon className="w-5 h-5 text-orange-600" />
            </div>

            <div className="space-y-3">
              {pendingUsers > 0 && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                  <AlertIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-800 text-sm">
                      {pendingUsers} users pending verification
                    </p>
                    <p className="text-orange-600 text-xs">
                      Requires immediate attention
                    </p>
                  </div>
                </div>
              )}
              
              {(users_without_school || 0) > 0 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <SchoolIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800 text-sm">
                      {users_without_school} users without school assignment
                    </p>
                    <p className="text-red-600 text-xs">
                      Assign to schools for full access
                    </p>
                  </div>
                </div>
              )}

              {verifiedUsers < totalUsers * 0.8 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <ShieldIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 text-sm">
                      Low verification rate
                    </p>
                    <p className="text-blue-600 text-xs">
                      Only {((verifiedUsers / totalUsers) * 100).toFixed(1)}% users verified
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Modal */}
      <UsersModal 
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
        usersData={data}
      />
    </div>
  );
};

// Enhanced Role Progress Component
const RoleProgress = ({ role, total, index }) => {
  const percentage = (role.value / total) * 100;
  const colorClass = getColorClass(index);
  
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50/50 hover:bg-white rounded-xl sm:rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-md group cursor-pointer">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${colorClass} shadow-md group-hover:scale-125 transition-transform duration-200 flex-shrink-0`}></div>
        <span className="font-semibold text-gray-700 text-sm sm:text-base capitalize min-w-[80px] sm:min-w-[120px] lg:min-w-[140px] flex-shrink-0 truncate">
          {role.name.replace('_', ' ')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
            <div 
              className={`h-2 sm:h-3 rounded-full ${colorClass} transition-all duration-1000 ease-out group-hover:shadow-md`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] justify-end flex-shrink-0">
        <span className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">{role.value.toLocaleString()}</span>
        <span className="text-gray-500 text-xs sm:text-sm font-semibold w-8 sm:w-10 lg:w-14 text-right">
          ({percentage.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};

// Enhanced Helper function for colors with gradients
const getColorClass = (index) => {
  const colors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600', 
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-red-500 to-red-600',
    'bg-gradient-to-r from-indigo-500 to-indigo-600',
    'bg-gradient-to-r from-pink-500 to-pink-600',
    'bg-gradient-to-r from-teal-500 to-teal-600'
  ];
  return colors[index % colors.length];
};

// Icons (keep the same as your original with responsive classes)
const UsersIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const UserGroupIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const RefreshIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ChartPieIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const TrendIcon = ({ isPositive, ...props }) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isPositive ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
  </svg>
);

const ShieldIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const VerifiedIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SchoolIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-4m0 4h4m-4 0h4" />
  </svg>
);

const ActivityIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendUpIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ClockIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default UsersStatus;