import React from 'react'

const TestNutritionistTab = ({ currentUser }) => {
  console.log('TestNutritionistTab rendered with currentUser:', currentUser)
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Nutritionist Tab</h2>
      <div className="space-y-4">
        <p>Current User: {currentUser?.name || 'No user'}</p>
        <p>User ID: {currentUser?._id || 'No ID'}</p>
        <p>This component is rendering successfully!</p>
        
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">✅ Basic Tab Working</h3>
          <p className="text-green-700">If you can see this, the tab switching is working properly.</p>
        </div>
        
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">🔍 Next Steps</h3>
          <p className="text-blue-700">Now we need to debug why the full NutritionistDirectory component isn't loading.</p>
        </div>
      </div>
    </div>
  )
}

export default TestNutritionistTab