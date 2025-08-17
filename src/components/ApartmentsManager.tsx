import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Apartment } from '../types/api';
import { Plus, Search, Edit, Trash2, MapPin, Star, AlertCircle } from 'lucide-react';

export function ApartmentsManager() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    setLoading(true);
    try {
      const response = await apiService.getApartments();
      setApartments(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Failed to load apartments');
      setApartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApartment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this apartment?')) return;

    try {
      await apiService.deleteApartment(id);
      setApartments(apartments.filter(apartment => apartment.id !== id));
    } catch (err) {
      setError('Failed to delete apartment');
    }
  };

  const filteredApartments = apartments.filter(apartment =>
    apartment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apartment.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Apartments</h1>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add Apartment
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search apartments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Apartments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApartments.map((apartment) => (
          <div key={apartment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              {apartment.photos && apartment.photos.length > 0 ? (
                <img 
                  src={apartment.photos[0]} 
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">🏠</div>
                  <div className="text-sm">No photo</div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{apartment.title}</h3>
                <div className="flex items-center gap-2 ml-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteApartment(apartment.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{apartment.city}, {apartment.state}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{apartment.rating || 'No rating'}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  apartment.availabilityStatus === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {apartment.availabilityStatus}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  ${apartment.pricePerNight}/night
                </div>
                <div className="text-sm text-gray-500">
                  {apartment.bedrooms} bed • {apartment.maxGuests} guests
                </div>
              </div>

              {apartment.apartment_tags && apartment.apartment_tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {apartment.apartment_tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {apartment.apartment_tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                      +{apartment.apartment_tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredApartments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No apartments found</p>
        </div>
      )}
    </div>
  );
}