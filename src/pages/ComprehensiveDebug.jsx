import { useState } from 'react'

const ComprehensiveDebug = () => {
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)

  const addResult = (test, result) => {
    setTestResults(prev => ({
      ...prev,
      [test]: result
    }))
  }

  const testNutritionistDirectory = async () => {
    try {
      addResult('directory', { status: 'Testing...', data: null })
      
      const token = localStorage.getItem('token')
      if (!token) {
        addResult('directory', { 
          status: 'Failed', 
          error: 'No authentication token found',
          solution: 'Please login as a patient first'
        })
        return
      }

      const response = await fetch('/api/nutritionists/directory', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        addResult('directory', { 
          status: 'Success', 
          data: data,
          count: data.nutritionists?.length || 0
        })
      } else {
        const errorText = await response.text()
        addResult('directory', { 
          status: 'Failed', 
          error: `HTTP ${response.status}: ${errorText}`,
          solution: 'Check backend logs and authentication'
        })
      }
    } catch (error) {
      addResult('directory', { 
        status: 'Failed', 
        error: error.message,
        solution: 'Check if backend is running on port 5001'
      })
    }
  }

  const testNutritionistRegistration = async () => {
    try {
      addResult('registration', { status: 'Testing...', data: null })
      
      const testData = {
        name: "Dr. Test User",
        firstName: "Test",
        lastName: "User",
        username: "testuser" + Date.now(),
        email: "test" + Date.now() + "@example.com",
        password: "Password123!",
        phone: "1234567890",
        location: {
          city: "Test City",
          country: "Test Country"
        },
        professional: {
          qualification: "MS Nutrition",
          experience: 5,
          specializations: ["Weight Management"]
        },
        agreements: {
          terms: true,
          privacy: true
        }
      }

      console.log('Sending registration data:', testData)

      const response = await fetch('/api/nutritionist/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      console.log('Registration response status:', response.status)
      const result = await response.json()
      console.log('Registration response:', result)

      if (response.ok) {
        addResult('registration', { 
          status: 'Success', 
          data: result,
          message: 'Registration completed successfully!'
        })
      } else {
        addResult('registration', { 
          status: 'Failed', 
          error: result.message || 'Unknown error',
          details: result.errors || [],
          solution: 'Check validation errors and backend logs'
        })
      }
    } catch (error) {
      addResult('registration', { 
        status: 'Failed', 
        error: error.message,
        solution: 'Check if backend is running and accessible'
      })
    }
  }

  const testBackendHealth = async () => {
    try {
      addResult('health', { status: 'Testing...', data: null })
      
      const response = await fetch('/health')
      
      if (response.ok) {
        const data = await response.json()
        addResult('health', { 
          status: 'Success', 
          data: data,
          message: 'Backend is healthy and running'
        })
      } else {
        addResult('health', { 
          status: 'Failed', 
          error: `HTTP ${response.status}`,
          solution: 'Backend may be having issues'
        })
      }
    } catch (error) {
      addResult('health', { 
        status: 'Failed', 
        error: error.message,
        solution: 'Backend is likely not running or not accessible'
      })
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    setTestResults({})
    
    await testBackendHealth()
    await testNutritionistDirectory()
    await testNutritionistRegistration()
    
    setLoading(false)
  }

  const renderTestResult = (testName, result) => {
    if (!result) return null

    const getStatusColor = (status) => {
      switch (status) {
        case 'Success': return 'text-green-600 bg-green-50 border-green-200'
        case 'Failed': return 'text-red-600 bg-red-50 border-red-200'
        case 'Testing...': return 'text-blue-600 bg-blue-50 border-blue-200'
        default: return 'text-gray-600 bg-gray-50 border-gray-200'
      }
    }

    return (
      <div key={testName} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
        <h3 className="font-semibold text-lg mb-2">
          {testName.charAt(0).toUpperCase() + testName.slice(1)} Test
        </h3>
        
        <div className="mb-2">
          <span className="font-medium">Status: </span>
          <span className={`font-bold ${result.status === 'Success' ? 'text-green-600' : result.status === 'Failed' ? 'text-red-600' : 'text-blue-600'}`}>
            {result.status}
          </span>
        </div>

        {result.message && (
          <div className="mb-2">
            <span className="font-medium">Message: </span>
            <span>{result.message}</span>
          </div>
        )}

        {result.error && (
          <div className="mb-2">
            <span className="font-medium">Error: </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{result.error}</code>
          </div>
        )}

        {result.solution && (
          <div className="mb-2">
            <span className="font-medium">Solution: </span>
            <span className="text-sm italic">{result.solution}</span>
          </div>
        )}

        {result.count !== undefined && (
          <div className="mb-2">
            <span className="font-medium">Count: </span>
            <span>{result.count}</span>
          </div>
        )}

        {result.details && result.details.length > 0 && (
          <div className="mb-2">
            <span className="font-medium">Details: </span>
            <ul className="list-disc list-inside text-sm">
              {result.details.map((detail, index) => (
                <li key={index}>{detail.msg || detail.message || JSON.stringify(detail)}</li>
              ))}
            </ul>
          </div>
        )}

        {result.data && (
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">Raw Data</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Nutri-Vision Debug Dashboard</h1>
        
        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium ${
              loading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {renderTestResult('health', testResults.health)}
          {renderTestResult('directory', testResults.directory)}
          {renderTestResult('registration', testResults.registration)}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium">For Nutritionist Directory Issues:</h3>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Make sure you're logged in as a patient</li>
                <li>Check if backend is running on port 5001</li>
                <li>Verify database has nutritionist data</li>
                <li>Check browser console for errors</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium">For Registration Issues:</h3>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Check all required fields are filled</li>
                <li>Verify password meets requirements (6+ chars)</li>
                <li>Check phone number format</li>
                <li>Ensure specializations are selected</li>
                <li>Verify terms and privacy are accepted</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComprehensiveDebug