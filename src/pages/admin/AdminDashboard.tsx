import React from 'react';
import { Users, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardStats, useServiceRequests } from '../../hooks/useSupabase';

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { requests, loading: requestsLoading } = useServiceRequests();

  if (statsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsDisplay = [
    { name: 'Total adhérents', value: stats?.totalMembers?.toString() || '0', icon: Users, color: 'blue', change: '+0%' },
    { name: 'Demandes en attente', value: stats?.pendingRequests?.toString() || '0', icon: Clock, color: 'orange', change: '+0%' },
    { name: 'Demandes traitées', value: stats?.processedRequests?.toString() || '0', icon: CheckCircle, color: 'green', change: '+0%' },
    { name: 'Demandes ce mois', value: stats?.monthlyRequests?.toString() || '0', icon: FileText, color: 'purple', change: '+0%' },
  ];

  // Préparer les données pour les graphiques
  const requestsByMonth = [
    { month: 'Jan', demandes: 0 },
    { month: 'Fév', demandes: 0 },
    { month: 'Mar', demandes: 0 },
    { month: 'Avr', demandes: 0 },
    { month: 'Mai', demandes: 0 },
    { month: 'Jun', demandes: 0 },
  ];

  const serviceDistribution = [
    { name: 'Scolaire', value: 0, color: '#3b82f6' },
    { name: 'Santé', value: 0, color: '#10b981' },
    { name: 'Décès', value: 0, color: '#f59e0b' },
    { name: 'Autres', value: 0, color: '#ef4444' },
  ];

  // Calculer la distribution des services à partir des vraies données
  if (requests.length > 0) {
    const serviceCount: { [key: string]: number } = {};
    requests.forEach(request => {
      const serviceName = request.service?.name || 'Autres';
      serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
    });

    serviceDistribution.forEach(item => {
      item.value = serviceCount[item.name] || 0;
    });
  }

  const recentActivity = requests.slice(0, 4).map(request => ({
    user: `${request.user?.first_name} ${request.user?.last_name}`,
    action: `a soumis une demande de ${request.service?.name}`,
    time: new Date(request.submitted_at).toLocaleDateString('fr-FR'),
    status: request.status === 'pending' ? 'new' as const : 
            request.status === 'approved' ? 'success' as const : 'info' as const
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de la plateforme MuSAIB</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des demandes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="demandes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par service</h3>
          {serviceDistribution.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceDistribution.filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === 'new' ? 'bg-blue-500' :
                    activity.status === 'success' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.status === 'new' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Nouveau
                      </span>
                    )}
                    {activity.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune activité récente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}