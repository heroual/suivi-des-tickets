import React, { useState } from 'react';
import { Calculator, X, Target } from 'lucide-react';
import { ServiceType } from '../types';

interface PKICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServicePKI {
  serviceType: ServiceType;
  pki: number;
  totalTickets: number;
  ticketsOnTime: number;
  ticketsLate: number;
}

export default function PKICalculator({ isOpen, onClose }: PKICalculatorProps) {
  const [formData, setFormData] = useState({
    totalTickets: '',
    ticketsOnTime: '',
    ticketsLate: '',
    fibreTickets: '',
    fibreOnTime: '',
    fibreLate: '',
    adslTickets: '',
    adslOnTime: '',
    adslLate: '',
    degroupageTickets: '',
    degroupageOnTime: '',
    degroupageLate: '',
  });

  const [results, setResults] = useState<{
    globalPKI: number;
    servicesPKI: ServicePKI[];
  } | null>(null);

  const calculateServicePKI = (total: number, onTime: number, late: number, type: ServiceType): ServicePKI => {
    if (total === 0) return { serviceType: type, pki: 0, totalTickets: 0, ticketsOnTime: 0, ticketsLate: 0 };
    
    const resolutionRate = (onTime + late) / total;
    const timelinessRate = onTime / (onTime + late);
    const pki = (resolutionRate * 0.6 + timelinessRate * 0.4) * 100;
    
    return {
      serviceType: type,
      pki,
      totalTickets: total,
      ticketsOnTime: onTime,
      ticketsLate: late,
    };
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, parseInt(value) || 0])
    ) as Record<string, number>;

    const fibrePKI = calculateServicePKI(
      data.fibreTickets,
      data.fibreOnTime,
      data.fibreLate,
      'FIBRE'
    );

    const adslPKI = calculateServicePKI(
      data.adslTickets,
      data.adslOnTime,
      data.adslLate,
      'ADSL'
    );

    const degroupagePKI = calculateServicePKI(
      data.degroupageTickets,
      data.degroupageOnTime,
      data.degroupageLate,
      'DEGROUPAGE'
    );

    const totalTickets = data.totalTickets || 
      (data.fibreTickets + data.adslTickets + data.degroupageTickets);
    const totalOnTime = data.ticketsOnTime || 
      (data.fibreOnTime + data.adslOnTime + data.degroupageOnTime);
    const totalLate = data.ticketsLate || 
      (data.fibreLate + data.adslLate + data.degroupageLate);

    const globalResolutionRate = (totalOnTime + totalLate) / totalTickets;
    const globalTimelinessRate = totalOnTime / (totalOnTime + totalLate);
    const globalPKI = (globalResolutionRate * 0.6 + globalTimelinessRate * 0.4) * 100;

    setResults({
      globalPKI,
      servicesPKI: [fibrePKI, adslPKI, degroupagePKI],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calculator className="w-8 h-8 text-blue-600 mr-2" />
              Calculateur PKI
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Global Stats */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Statistiques Globales</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Tickets</label>
                  <input
                    type="number"
                    name="totalTickets"
                    value={formData.totalTickets}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tickets Dans les Délais</label>
                  <input
                    type="number"
                    name="ticketsOnTime"
                    value={formData.ticketsOnTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tickets Hors Délais</label>
                  <input
                    type="number"
                    name="ticketsLate"
                    value={formData.ticketsLate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              {/* FIBRE */}
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">FIBRE</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Tickets</label>
                  <input
                    type="number"
                    name="fibreTickets"
                    value={formData.fibreTickets}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dans les Délais</label>
                  <input
                    type="number"
                    name="fibreOnTime"
                    value={formData.fibreOnTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hors Délais</label>
                  <input
                    type="number"
                    name="fibreLate"
                    value={formData.fibreLate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
              </div>

              {/* ADSL */}
              <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-900">ADSL</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Tickets</label>
                  <input
                    type="number"
                    name="adslTickets"
                    value={formData.adslTickets}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dans les Délais</label>
                  <input
                    type="number"
                    name="adslOnTime"
                    value={formData.adslOnTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hors Délais</label>
                  <input
                    type="number"
                    name="adslLate"
                    value={formData.adslLate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    min="0"
                  />
                </div>
              </div>

              {/* DEGROUPAGE */}
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900">DEGROUPAGE</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Tickets</label>
                  <input
                    type="number"
                    name="degroupageTickets"
                    value={formData.degroupageTickets}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dans les Délais</label>
                  <input
                    type="number"
                    name="degroupageOnTime"
                    value={formData.degroupageOnTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hors Délais</label>
                  <input
                    type="number"
                    name="degroupageLate"
                    value={formData.degroupageLate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Target className="w-5 h-5 mr-2" />
              Calculer le PKI
            </button>
          </form>

          {results && (
            <div className="mt-8 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Résultats PKI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-xl font-bold text-blue-600">PKI Global</div>
                    <div className="text-3xl font-bold mt-2">{results.globalPKI.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-4">
                    {results.servicesPKI.map(service => (
                      <div key={service.serviceType} className="bg-white p-4 rounded-lg shadow">
                        <div className="font-semibold text-gray-900">{service.serviceType}</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">
                          {service.pki.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Total: {service.totalTickets} | Dans les délais: {service.ticketsOnTime} | 
                          Hors délais: {service.ticketsLate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}