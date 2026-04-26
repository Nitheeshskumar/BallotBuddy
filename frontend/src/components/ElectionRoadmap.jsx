import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, AlertCircle } from 'lucide-react';

const ElectionRoadmap = ({ onProgressUpdate }) => {
  const [zip, setZip] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchElections = async (e) => {
    e.preventDefault();
    if (!zip) return;
    
    setLoading(true);
    setError(null);
    try {
      // In development, assume backend runs on 3000 or proxy is setup.
      // We will add proxy in vite.config.js
      const res = await axios.get(`/api/elections/${zip}`);
      setData(res.data);
      onProgressUpdate('roadmap_viewed'); // Update Civic Quest progress
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch election data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MapPin className="text-blue-500" />
        Your Election Roadmap
      </h2>
      
      <form onSubmit={fetchElections} className="relative mb-8">
        <input 
          type="text" 
          placeholder="Enter full US address (e.g., 1263 Pacific Ave, Kansas City, KS)" 
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 text-lg"
        />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {loading ? 'Searching...' : <><Search size={20} /> Find Elections</>}
        </button>
      </form>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {data && data.election && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-2">{data.election.name}</h3>
            <div className="flex items-center gap-2 text-blue-700">
              <Calendar size={18} />
              <span>Election Day: {data.election.electionDay}</span>
            </div>
          </div>

          {data.pollingLocations && data.pollingLocations.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-4 px-2">Polling Locations</h4>
              <div className="space-y-3">
                {data.pollingLocations.map((loc, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl flex gap-4 items-start border border-slate-100 hover:border-slate-300 transition-colors">
                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{loc.address.locationName}</p>
                      <p className="text-slate-500 text-sm">{loc.address.line1}, {loc.address.city}, {loc.address.state} {loc.address.zip}</p>
                      <p className="text-xs text-slate-400 mt-1">Hours: {loc.pollingHours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {data && !data.election && (
        <p className="text-slate-500 text-center py-8">No upcoming elections found for this address.</p>
      )}
    </div>
  );
};

export default ElectionRoadmap;
