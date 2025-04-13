'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getRegionalHealthTrends } from '@/api/healthApi';

// Define types for regional health trends data
interface Symptom {
  name: string;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface RegionalTrend {
  region: string;
  symptoms: Symptom[];
  alert_level: 'high' | 'moderate' | 'low';
  prediction: string;
}

export default function DiseasePrediction() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  // Fetch regional health trends
  const { 
    data: regionalTrends,
    isLoading,
    error
  } = useQuery({
    queryKey: ['regionalHealthTrends'],
    queryFn: getRegionalHealthTrends
  });
  
  // Get alert level color
  const getAlertLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'moderate':
        return 'bg-yellow-500 text-yellow-900';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'decreasing':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      case 'stable':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center text-red-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium">Error Loading Health Trends</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {(error as Error)?.message || 'Failed to load regional health trends'}
          </p>
        </div>
      </div>
    );
  }
  
  // No data state
  if (!regionalTrends || regionalTrends.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Health Trends Available</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for regional health trends.
          </p>
        </div>
      </div>
    );
  }
  
  // Get selected region data or default to first region
  const selectedRegionData = selectedRegion 
    ? regionalTrends.find((r: RegionalTrend) => r.region === selectedRegion) 
    : regionalTrends[0];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Disease Prediction Feed</h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {regionalTrends.map((region: RegionalTrend) => (
            <button
              key={region.region}
              onClick={() => setSelectedRegion(region.region)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                (!selectedRegion && region === regionalTrends[0]) || selectedRegion === region.region
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {region.region}
            </button>
          ))}
        </div>
        
        {selectedRegionData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedRegionData.region} Region
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAlertLevelColor(selectedRegionData.alert_level)}`}>
                {selectedRegionData.alert_level.toUpperCase()} ALERT
              </span>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Prediction</h4>
              <p className="text-blue-700 dark:text-blue-400">
                {selectedRegionData.prediction}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Common Symptoms</h4>
              <div className="space-y-2">
                {selectedRegionData.symptoms.map((symptom: Symptom, index: number) => (
                  <motion.div
                    key={symptom.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-200 dark:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{symptom.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400 mr-2">{symptom.count} reports</span>
                      {getTrendIcon(symptom.trend)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This prediction is based on anonymized health data from users in your region.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
