import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// A simple JWT decoder
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    phone_number: '',
    address: '',
    organization_name: '',
    food_types: '',
    availability: '',
    vehicle_access: false,
    people_served: '',
    delivery_notes: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/get-involved');
      return;
    }
    const decoded = parseJwt(token);
    if (decoded && decoded.role) {
      setUserRole(decoded.role);
    } else {
      setError('Could not determine user role. Please try logging in again.');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/profiles/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (userRole) {
      case 'Donor':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="food_types" className="block text-sm font-medium text-zinc-700">Typical Food Types</label>
              <input type="text" name="food_types" id="food_types" placeholder="e.g., produce, baked goods, canned items" value={formData.food_types} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </>
        );
      case 'Volunteer':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="availability" className="block text-sm font-medium text-zinc-700">Availability</label>
              <input type="text" name="availability" id="availability" placeholder="e.g., Weekends, Weekday evenings" value={formData.availability} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="vehicle_access" id="vehicle_access" checked={formData.vehicle_access} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 border-zinc-300 rounded focus:ring-emerald-500" />
              <label htmlFor="vehicle_access" className="ml-2 block text-sm text-zinc-900">I have access to a vehicle</label>
            </div>
          </>
        );
      case 'Beneficiary':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="people_served" className="block text-sm font-medium text-zinc-700">Number of People Served Weekly</label>
              <input type="number" name="people_served" id="people_served" placeholder="e.g., 150" value={formData.people_served} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="delivery_notes" className="block text-sm font-medium text-zinc-700">Delivery Notes or Instructions</label>
              <textarea name="delivery_notes" id="delivery_notes" value={formData.delivery_notes} onChange={handleInputChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"></textarea>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-emerald-900">Complete your profile</h1>
          <p className="mt-2 text-sm text-zinc-600">A few quick details so we can match you with the right rescues.</p>
        </div>

        <div className="mt-8 bg-white p-8 shadow-lg rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div className="mb-4">
              <label htmlFor="organization_name" className="block text-sm font-medium text-zinc-700">Organization (optional)</label>
              <input type="text" name="organization_name" id="organization_name" value={formData.organization_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="phone_number" className="block text-sm font-medium text-zinc-700">Phone</label>
                <input type="tel" name="phone_number" id="phone_number" value={formData.phone_number} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-zinc-700">Address</label>
              <textarea name="address" id="address" placeholder="Street, City, State, Zip Code" value={formData.address} onChange={handleInputChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"></textarea>
            </div>

            <hr className="my-6 border-zinc-200" />

            {renderRoleSpecificFields()}

            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                {isLoading ? 'Saving...' : 'Save and continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;