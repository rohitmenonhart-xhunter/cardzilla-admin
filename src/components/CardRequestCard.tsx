import React from 'react';
import { format } from 'date-fns';
import { CardRequest } from '../types';
import { CreditCard, QrCode, Smartphone, Mail, User, Calendar, Check, FileText } from 'lucide-react';
import { downloadInvoice } from '../lib/invoice';

interface CardRequestCardProps {
  request: CardRequest;
  id: string;
  onMarkDone: (id: string) => Promise<void>;
}

export const CardRequestCard: React.FC<CardRequestCardProps> = ({ request, id, onMarkDone }) => {
  const formattedDate = format(new Date(request.timestamp), 'PPP');
  
  const handleGenerateInvoice = () => {
    downloadInvoice(request);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {request.cardCategory === 'HYBRID' ? (
            <CreditCard className="w-6 h-6 text-purple-600" />
          ) : (
            <QrCode className="w-6 h-6 text-blue-600" />
          )}
          <span className="font-semibold text-lg">
            {request.cardSerial}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            request.cardCategory === 'HYBRID' 
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {request.cardCategory}
          </span>
          <button
            onClick={handleGenerateInvoice}
            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
            title="Generate Invoice"
          >
            <FileText className="w-5 h-5" />
          </button>
          <button
            onClick={() => onMarkDone(id)}
            className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
            title="Mark as done"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{request.name}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
            {request.email}
          </a>
        </div>
        
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-gray-500" />
          <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
            {request.phone}
          </a>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};