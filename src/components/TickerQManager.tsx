//import React, { useState, useEffect } from 'react';
//import { apiService } from '../services/api';
//import { Clock, Play, Pause, RotateCcw, AlertCircle, Activity } from 'lucide-react';

//export function TickerQManager() {
//  const [timeTickers, setTimeTickers] = useState<any[]>([]);
//  const [cronTickers, setCronTickers] = useState<any[]>([]);
//  const [hostStatus, setHostStatus] = useState<any>(null);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState('');

//  useEffect(() => {
//    loadTickerData();
//  }, []);

//  const loadTickerData = async () => {
//    setLoading(true);
//    try {
//      const [timeTickersResponse, cronTickersResponse, statusResponse] = await Promise.allSettled([
//        apiService.getTimeTickers(),
//        apiService.getCronTickers(),
//        apiService.getTickerHostStatus()
//      ]);

//      if (timeTickersResponse.status === 'fulfilled') {
//        setTimeTickers(Array.isArray(timeTickersResponse.value) ? timeTickersResponse.value : []);
//      }

//      if (cronTickersResponse.status === 'fulfilled') {
//        setCronTickers(Array.isArray(cronTickersResponse.value) ? cronTickersResponse.value : []);
//      }

//      if (statusResponse.status === 'fulfilled') {
//        setHostStatus(statusResponse.value);
//      }
//    } catch (err) {
//      setError('Failed to load ticker data');
//    } finally {
//      setLoading(false);
//    }
//  };

//  const handleStartHost = async () => {
//    try {
//      await apiService.startTickerHost();
//      loadTickerData();
//    } catch (err) {
//      setError('Failed to start ticker host');
//    }
//  };

//  const handleStopHost = async () => {
//    try {
//      await apiService.stopTickerHost();
//      loadTickerData();
//    } catch (err) {
//      setError('Failed to stop ticker host');
//    }
//  };

//  if (loading) {
//    return (
//      <div className="animate-pulse">
//        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//          <div className="h-64 bg-gray-200 rounded-lg"></div>
//          <div className="h-64 bg-gray-200 rounded-lg"></div>
//        </div>
//      </div>
//    );
//  }

//  return (
//    <div className="space-y-6">
//      {error && (
//        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
//          <AlertCircle className="h-5 w-5 text-red-500" />
//          <span className="text-red-700">{error}</span>
//        </div>
//      )}

//      {/* Header */}
//      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//        <h1 className="text-2xl font-bold text-gray-900">TickerQ Management</h1>
//        <div className="flex items-center gap-3">
//          <button
//            onClick={handleStartHost}
//            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//          >
//            <Play className="h-4 w-4 mr-2" />
//            Start
//          </button>
//          <button
//            onClick={handleStopHost}
//            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//          >
//            <Pause className="h-4 w-4 mr-2" />
//            Stop
//          </button>
//          <button
//            onClick={loadTickerData}
//            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//          >
//            <RotateCcw className="h-4 w-4 mr-2" />
//            Refresh
//          </button>
//        </div>
//      </div>

//      {/* Status Card */}
//      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//        <div className="flex items-center gap-3 mb-4">
//          <Activity className="h-5 w-5 text-gray-600" />
//          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
//        </div>
//        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//          <div className="text-center p-4 bg-gray-50 rounded-lg">
//            <div className="text-2xl font-bold text-blue-600">{timeTickers.length}</div>
//            <div className="text-sm text-gray-600">Time Tickers</div>
//          </div>
//          <div className="text-center p-4 bg-gray-50 rounded-lg">
//            <div className="text-2xl font-bold text-purple-600">{cronTickers.length}</div>
//            <div className="text-sm text-gray-600">Cron Tickers</div>
//          </div>
//          <div className="text-center p-4 bg-gray-50 rounded-lg">
//            <div className={`text-2xl font-bold ${hostStatus ? 'text-green-600' : 'text-red-600'}`}>
//              {hostStatus ? 'Running' : 'Stopped'}
//            </div>
//            <div className="text-sm text-gray-600">Host Status</div>
//          </div>
//        </div>
//      </div>

//      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//        {/* Time Tickers */}
//        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//          <div className="px-6 py-4 border-b border-gray-200">
//            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//              <Clock className="h-5 w-5 mr-2" />
//              Time Tickers
//            </h3>
//          </div>
//          <div className="p-6">
//            {timeTickers.length > 0 ? (
//              <div className="space-y-3">
//                {timeTickers.slice(0, 5).map((ticker, index) => (
//                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                    <div>
//                      <div className="font-medium text-gray-900">Ticker #{ticker.id || index + 1}</div>
//                      <div className="text-sm text-gray-500">
//                        {ticker.nextRun ? new Date(ticker.nextRun).toLocaleString() : 'No schedule'}
//                      </div>
//                    </div>
//                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                      ticker.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                    }`}>
//                      {ticker.status || 'Unknown'}
//                    </span>
//                  </div>
//                ))}
//                {timeTickers.length > 5 && (
//                  <div className="text-center text-sm text-gray-500 pt-2">
//                    And {timeTickers.length - 5} more...
//                  </div>
//                )}
//              </div>
//            ) : (
//              <div className="text-center py-8 text-gray-500">
//                No time tickers configured
//              </div>
//            )}
//          </div>
//        </div>

//        {/* Cron Tickers */}
//        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//          <div className="px-6 py-4 border-b border-gray-200">
//            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//              <Clock className="h-5 w-5 mr-2" />
//              Cron Tickers
//            </h3>
//          </div>
//          <div className="p-6">
//            {cronTickers.length > 0 ? (
//              <div className="space-y-3">
//                {cronTickers.slice(0, 5).map((ticker, index) => (
//                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                    <div>
//                      <div className="font-medium text-gray-900">Cron #{ticker.id || index + 1}</div>
//                      <div className="text-sm text-gray-500 font-mono">
//                        {ticker.cronExpression || 'No expression'}
//                      </div>
//                    </div>
//                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                      ticker.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                    }`}>
//                      {ticker.status || 'Unknown'}
//                    </span>
//                  </div>
//                ))}
//                {cronTickers.length > 5 && (
//                  <div className="text-center text-sm text-gray-500 pt-2">
//                    And {cronTickers.length - 5} more...
//                  </div>
//                )}
//              </div>
//            ) : (
//              <div className="text-center py-8 text-gray-500">
//                No cron tickers configured
//              </div>
//            )}
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//}
