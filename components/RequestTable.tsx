
import React, { useState } from 'react';

type Ticket = {
  ticket_number: number;
  plate_number: string;
  car_model?: string;
  etaMinutes?: number;
  status: string;
  assignedWorker?: string;
};

interface Props {
  tickets: Ticket[];
}

const statusStyle = (status: string) => {
  switch (status) {
    case 'requested':
      return 'bg-yellow-100 text-yellow-800';
    case 'assigned':
      return 'bg-blue-100 text-blue-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    case 'closed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RequestTable({ tickets }: Props) {
  const [filter, setFilter] = useState('all');

  const filteredTickets = tickets.filter(ticket =>
    filter === 'all' ? true : ticket.status === filter
  );

  return (
    <div className="bg-white p-4 border rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">📝 Active Requests</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="all">All</option>
          <option value="requested">Requested</option>
          <option value="assigned">Assigned</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Ticket #</th>
              <th className="px-3 py-2">Plate</th>
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2">ETA</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Worker</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition-colors duration-150">
                <td className="px-3 py-2 font-medium text-gray-800">
                  #{ticket.ticket_number.toString().padStart(4, '0')}
                </td>
                <td className="px-3 py-2 text-gray-700">{ticket.plate_number}</td>
                <td className="px-3 py-2 text-gray-700">{ticket.car_model ?? '—'}</td>
                <td className="px-3 py-2">{ticket.etaMinutes ?? '—'} min</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 text-xs rounded ${statusStyle(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {ticket.assignedWorker || <span className="text-gray-400">—</span>}
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-gray-400">
                  No matching requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
