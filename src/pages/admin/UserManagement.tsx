import React, { useState } from 'react';
import { Search, Filter, MoreVertical, User, Mail, Phone, Shield, ShieldOff, RotateCcw } from 'lucide-react';
import { useProfiles } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';

export default function UserManagement() {
  const { profiles, loading, updateProfile } = useProfiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = profiles.filter(profile => {
    const fullName = `${profile.first_name} ${profile.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         profile.nip.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || profile.status === statusFilter;
    return matchesSearch && matchesStatus && profile.role === 'member';
  });

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      await updateProfile(userId, { status: newStatus });
      setSelectedUser(null);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const handlePasswordReset = async (userId: string) => {
    try {
      const profile = profiles.find(p => p.id === userId);
      if (!profile) return;

      // Récupérer l'email de l'utilisateur depuis auth.users
      const { data: authUser, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error || !authUser.user?.email) {
        alert('Impossible de récupérer l\'email de l\'utilisateur');
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        authUser.user.email,
        { redirectTo: `${window.location.origin}/change-password` }
      );

      if (resetError) {
        alert('Erreur lors de l\'envoi de l\'email de réinitialisation');
        return;
      }

      alert(`Email de réinitialisation envoyé à ${authUser.user.email}`);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      alert('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des adhérents</h1>
        <p className="text-gray-600 mt-2">Gérez les comptes et statuts des adhérents</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total adhérents</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Comptes actifs</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ShieldOff className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Comptes suspendus</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers.filter(u => u.status === 'suspended').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adhérent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {profile.first_name} {profile.last_name}
                          </div>
                          <div className="text-sm text-gray-500">NIP: {profile.nip}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-y-1 flex-col items-start">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          Email non disponible
                        </div>
                        {profile.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {profile.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profile.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setSelectedUser(selectedUser === profile.id ? null : profile.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                        
                        {selectedUser === profile.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleStatusChange(profile.id, profile.status === 'active' ? 'suspended' : 'active')}
                                className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                                  profile.status === 'active' 
                                    ? 'text-red-700 hover:bg-red-50' 
                                    : 'text-green-700 hover:bg-green-50'
                                }`}
                              >
                                {profile.status === 'active' ? (
                                  <>
                                    <ShieldOff className="h-4 w-4 mr-2" />
                                    Suspendre
                                  </>
                                ) : (
                                  <>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Activer
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handlePasswordReset(profile.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Réinitialiser mot de passe
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun adhérent</h3>
            <p className="mt-1 text-sm text-gray-500">Aucun adhérent ne correspond aux critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}