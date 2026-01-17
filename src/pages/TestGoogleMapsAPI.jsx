import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, TestTube } from 'lucide-react';

export default function TestGoogleMapsAPI() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const response = await base44.functions.invoke('testGoogleMapsAPI');
      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to run test',
        details: error.message
      });
    }
    
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Maps API Diagnostic Tool</h1>
          <p className="text-gray-600">Test your Google Maps API key configuration and troubleshoot routing issues</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Run API Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTest} 
              disabled={testing}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {testing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Testing API...
                </>
              ) : (
                <>
                  <TestTube className="w-5 h-5 mr-2" />
                  Test Google Maps API Key
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {result.success ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-600">API Test Passed</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <span className="text-red-600">API Test Failed</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">API Status</p>
                  <Badge className={result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {result.api_status || result.error}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">API Key</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {result.api_key_preview || 'Not configured'}
                  </code>
                </div>
              </div>

              {/* Error Message */}
              {result.error_message && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-900 mb-2">Error from Google Maps:</p>
                  <p className="text-red-700">{result.error_message}</p>
                </div>
              )}

              {/* Diagnostics */}
              {result.diagnostics && (
                <div className={`border-2 rounded-lg p-4 ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <p className={`font-semibold mb-3 ${
                    result.success ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    {result.diagnostics.message}
                  </p>
                  
                  {result.diagnostics.next_steps && result.diagnostics.next_steps.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Next Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                        {result.diagnostics.next_steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Response Details */}
              {result.response_summary && (
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Response Summary:</p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-mono">{result.response_summary.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Routes Found:</span>
                      <span className="font-mono">{result.response_summary.routes_found}</span>
                    </div>
                    {result.response_summary.available_travel_modes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel Modes:</span>
                        <span className="font-mono">{JSON.stringify(result.response_summary.available_travel_modes)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Response (Collapsible) */}
              <details className="bg-gray-900 text-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold mb-2">View Full API Response (JSON)</summary>
                <pre className="text-xs overflow-auto max-h-96 mt-2">
                  {JSON.stringify(result.full_response || result, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}