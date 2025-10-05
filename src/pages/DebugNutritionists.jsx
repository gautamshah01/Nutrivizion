import { useState, useEffect } from 'react'

const DebugNutritionists = () => {
  const [status, setStatus] = useState('Loading...')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    testAPI()
  }, [])

  const testAPI = async () => {
    try {
      setStatus('Testing API...')
      
      // Check if token exists
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        setStatus('Error: Not logged in')
        return
      }

      setStatus('Making API request...')
      
      const response = await fetch('/api/nutritionists/directory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setStatus(`API Response: ${response.status}`)

      if (response.ok) {
        const result = await response.json()
        setData(result)
        setStatus('✅ API Success')
      } else {
        const errorText = await response.text()
        setError(errorText)
        setStatus(`❌ API Error: ${response.status}`)
      }
    } catch (err) {
      setError(err.message)
      setStatus(`❌ Network Error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Nutritionist API Debug</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg">{status}</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800">Error Details:</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </div>

        {data && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API Response</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={testAPI}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default DebugNutritionists