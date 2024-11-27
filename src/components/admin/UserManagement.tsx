import React from 'react';
import UserManagementComponent from '../../components/admin/users/UserManagement';

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
      <UserManagementComponent />
    </div>
  );
}