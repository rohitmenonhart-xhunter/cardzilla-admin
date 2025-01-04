import React, { useState } from 'react';
import { CardRequest } from './types';
import { CardRequestCard } from './components/CardRequestCard';
import { CreditCard, Search, Loader2, LogOut } from 'lucide-react';
import { useCardRequests } from './hooks/useCardRequests';
import { useAuth } from './lib/auth';
import { LoginForm } from './components/LoginForm';
import { markCardAsDone } from './lib/database';

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { requests, loading, error } = useCardRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'HYBRID' | 'AR_QR'>('ALL');

  const handleMarkDone = async (cardId: string) => {
    if (window.confirm('Are you sure you want to mark this card as done? This will remove it from the list.')) {
      try {
        await markCardAsDone(cardId);
      } catch (error) {
        console.error('Error marking card as done:', error);
        alert('Failed to mark card as done. Please try again.');
      }
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const filteredRequests = Object.entries(requests).filter(([_, request]) => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.cardSerial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'ALL' || request.cardCategory === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Cardzilla Dashboard</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or card serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              {(['ALL', 'HYBRID', 'AR_QR'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading card requests...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map(([id, request]) => (
              <CardRequestCard 
                key={id} 
                id={id}
                request={request} 
                onMarkDone={handleMarkDone}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No card requests found</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;