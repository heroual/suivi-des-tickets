import React, { useState, useEffect } from 'react';
import { Router, Wifi, PlusCircle, Download, Edit2, Trash2, X, Save, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import type { Device, DeviceType, Technician } from '../types';
import { addDevice, updateDevice, deleteDevice, getDevices, auth } from '../services/firebase';

export default function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    ndLogin: '',
    reclamationNumber: '',
    type: 'FIBRE' as DeviceType,
    serialNumber: '',
    address: '',
    technician: 'BRAHIM' as Technician
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const loadedDevices = await getDevices();
      setDevices(loadedDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        await updateDevice(editingDevice.id, {
          ...editingDevice,
          ...formData,
          dateInstalled: editingDevice.dateInstalled
        });
      } else {
        await addDevice({
          ...formData,
          dateInstalled: new Date()
        });
      }
      await loadDevices();
      resetForm();
    } catch (error) {
      console.error('Error saving device:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      ndLogin: device.ndLogin,
      reclamationNumber: device.reclamationNumber,
      type: device.type,
      serialNumber: device.serialNumber,
      address: device.address,
      technician: device.technician
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        await deleteDevice(id);
        await loadDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ndLogin: '',
      reclamationNumber: '',
      type: 'FIBRE',
      serialNumber: '',
      address: '',
      technician: 'BRAHIM'
    });
    setEditingDevice(null);
    setShowForm(false);
  };

  const exportToExcel = () => {
    const data = devices.map(device => ({
      'ND/Login': device.ndLogin,
      'N° Réclamation': device.reclamationNumber,
      'Type': device.type,
      'N° Série': device.serialNumber,
      'Adresse': device.address,
      'Technicien': device.technician,
      'Date d\'installation': format(device.dateInstalled, 'dd/MM/yyyy HH:mm', { locale: fr })
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Équipements');

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // ND/Login
      { wch: 15 }, // N° Réclamation
      { wch: 10 }, // Type
      { wch: 20 }, // N° Série
      { wch: 40 }, // Adresse
      { wch: 15 }, // Technicien
      { wch: 20 }  // Date d'installation
    ];

    XLSX.writeFile(wb, `equipements-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const filteredDevices = devices.filter(device => {
    const searchStr = searchTerm.toLowerCase();
    return (
      device.ndLogin.toLowerCase().includes(searchStr) ||
      device.reclamationNumber.toLowerCase().includes(searchStr) ||
      device.serialNumber.toLowerCase().includes(searchStr) ||
      device.address.toLowerCase().includes(searchStr)
    );
  });

  const DeviceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              {editingDevice ? (
                <>
                  <Edit2 className="w-6 h-6 text-blue-600 mr-2" />
                  Modifier l'équipement
                </>
              ) : (
                <>
                  <PlusCircle className="w-6 h-6 text-blue-600 mr-2" />
                  Nouvel équipement
                </>
              )}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ND/Login</label>
                <input
                  type="text"
                  required
                  value={formData.ndLogin}
                  onChange={(e) => setFormData(prev => ({ ...prev, ndLogin: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">N° Réclamation</label>
                <input
                  type="text"
                  required
                  value={formData.reclamationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, reclamationNumber: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DeviceType }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="FIBRE">Fibre</option>
                  <option value="ADSL">ADSL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">N° Série</label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Technicien</label>
              <select
                value={formData.technician}
                onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value as Technician }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="BRAHIM">BRAHIM</option>
                <option value="ABDERAHMAN">ABDERAHMAN</option>
                <option value="AXE">AXE</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 inline-block mr-2" />
                {editingDevice ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Router className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestion des Équipements
                </h1>
                <p className="text-sm text-gray-600">
                  Routeurs et points d'accès installés
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {auth.currentUser && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Nouvel équipement
                </button>
              )}
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Download className="w-5 h-5 mr-2" />
                Exporter Excel
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Chargement des équipements...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ND/Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Réclamation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Série
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technicien
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'installation
                  </th>
                  {auth.currentUser && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.ndLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.reclamationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        device.type === 'FIBRE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {device.type === 'FIBRE' ? <Wifi className="w-3 h-3 mr-1" /> : <Router className="w-3 h-3 mr-1" />}
                        {device.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.serialNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {device.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.technician}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(device.dateInstalled, 'dd/MM/yyyy HH:mm')}
                    </td>
                    {auth.currentUser && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(device)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(device.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan={auth.currentUser ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucun équipement trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && <DeviceForm />}
    </div>
  );
}