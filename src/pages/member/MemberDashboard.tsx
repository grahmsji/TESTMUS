import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Users, Bell } from 'lucide-react';

interface DashboardStats {
  submittedRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  familyMembers: number;
}

interface RecentRequest {
  id: string;
  service: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  amount: string;
}

interface Notification {
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

export default function MemberDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    submittedRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    familyMembers: 0
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const [statsRes, requestsRes, notificationsRes] = await Promise.all([
      //   fetch('/api/member/stats'),
      //   fetch('/api/member/requests/recent'),
      //   fetch('/api/member/notifications')
      // ]);
      
      // const statsData = await statsRes.json();
      // const requestsData = await requestsRes.json();
      // const notificationsData = await notificationsRes.json();
      
      // setStats(statsData);
      // setRecentRequests(requestsData);
      // setNotifications(notificationsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsDisplay = [
    { name: 'Demandes soumises', value: stats.submittedRequests.toString(), icon: FileText, color: 'blue' },
    { name: 'En attente', value: stats.pendingRequests.toString(), icon: Clock, color: 'orange' },
    { name: 'Approuvées', value: stats.approvedRequests.toString(), icon: CheckCircle, color: 'green' },
    { name: 'Membres famille', value: stats.familyMembers.toString(), icon: Users, color: 'purple' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenue sur votre espace personnel MuSAIB</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Demandes récentes</h3>
          </div>
          <div className="p-6">
            {recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.service}</p>
                        <p className="text-xs text-gray-500">{new Date(request.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{request.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune demande récente
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="p-6">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'success' ? 'bg-green-100' :
                      notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {notification.type === 'info' && <Bell className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune notification
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 text-center bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-blue-900">Nouvelle demande</p>
          </button>
          <button className="p-6 text-center bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-green-900">Gérer la famille</p>
          </button>
          <button className="p-6 text-center bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-purple-900">Voir l'historique</p>
          </button>
        </div>
      </div>
    </div>
  );
}