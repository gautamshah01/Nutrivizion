import { useState, useEffect } from 'react'

const SimpleNutritionistDirectory = ({ currentUser }) => {
  const [nutritionists, setNutritionists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNutritionists()
  }, [])

  const fetchNutritionists = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      console.log('Fetching nutritionists...', { token, currentUser })
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nutri-vision-backend-production.up.railway.app/api'
      const response = await fetch(`${API_BASE_URL}/nutritionists/directory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error('Failed to fetch nutritionists')
      }

      const data = await response.json()
      console.log('Nutritionists data:', data)
      setNutritionists(data.nutritionists || [])
    } catch (err) {
      console.error('Error fetching nutritionists:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading nutritionists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={fetchNutritionists}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Find a Nutritionist</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current User: {currentUser?.name || 'Unknown'} (ID: {currentUser?._id || 'No ID'})
        </p>
        <p className="text-sm text-gray-600">
          Found {nutritionists.length} nutritionists
        </p>
      </div>

      {nutritionists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No nutritionists found.</p>
          <button 
            onClick={fetchNutritionists}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {nutritionists.map(nutritionist => (
            <div key={nutritionist._id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Dr. {nutritionist.firstName} {nutritionist.lastName}
              </h3>
              <p className="text-gray-600">{nutritionist.professional?.qualification || 'No qualification listed'}</p>
              <p className="text-sm text-gray-500">
                Rate: ₹{nutritionist.consultationRate || 1000}/session
              </p>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                  Test Button
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SimpleNutritionistDirectory