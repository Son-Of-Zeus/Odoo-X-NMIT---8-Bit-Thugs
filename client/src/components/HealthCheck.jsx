import { useState, useEffect } from 'react'
import { healthAPI } from '../services/api'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Navbar from './Navbar'

export default function HealthCheck() {
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHealthData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await healthAPI.check()
      setHealthData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Health Check Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Button onClick={fetchHealthData} disabled={loading} size="lg">
                {loading ? 'Checking Health...' : 'Refresh Health Status'}
              </Button>
            </div>

            <div className="space-y-4">
              {loading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-lg">Loading health status...</p>
                  </CardContent>
                </Card>
              )}
              
              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <p className="text-red-600 text-lg">Error: {error}</p>
                      <Button onClick={fetchHealthData} variant="outline">
                        Retry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {healthData && !loading && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-700">Health Check Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-white p-4 rounded-md border overflow-auto text-sm">
                      {JSON.stringify(healthData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}