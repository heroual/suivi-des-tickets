import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Ticket } from '../../types';

interface AnalyticsChartsProps {
  tickets: Ticket[];
}

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

export default function AnalyticsCharts({ tickets }: AnalyticsChartsProps) {
  const causeTypeData = [
    { name: 'Technique', value: tickets.filter(t => t.causeType === 'Technique').length },
    { name: 'Client', value: tickets.filter(t => t.causeType === 'Client').length },
    { name: 'Casse', value: tickets.filter(t => t.causeType === 'Casse').length }
  ].filter(item => item.value > 0);

  const serviceTypeData = [
    { name: 'FIBRE', value: tickets.filter(t => t.serviceType === 'FIBRE').length },
    { name: 'ADSL', value: tickets.filter(t => t.serviceType === 'ADSL').length },
    { name: 'DEGROUPAGE', value: tickets.filter(t => t.serviceType === 'DEGROUPAGE').length },
    { name: 'FIXE', value: tickets.filter(t => t.serviceType === 'FIXE').length }
  ].filter(item => item.value > 0);

  const technicianData = [
    { name: 'BRAHIM', value: tickets.filter(t => t.technician === 'BRAHIM').length },
    { name: 'ABDERAHMAN', value: tickets.filter(t => t.technician === 'ABDERAHMAN').length },
    { name: 'AXE', value: tickets.filter(t => t.technician === 'AXE').length }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution par Type de Cause */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Distribution par Type de Cause</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={causeTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {causeTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution par Service */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Distribution par Service</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tickets" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution par Technicien */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Distribution par Technicien</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={technicianData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tickets" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}