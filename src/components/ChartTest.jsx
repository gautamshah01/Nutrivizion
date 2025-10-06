// Test Chart.js configuration
import React from 'react'
import { Line } from 'react-chartjs-2'
import '../utils/chartConfig.js'

const ChartTest = () => {
  const testData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Test Data',
        data: [12, 19, 3, 5, 2, 3, 7],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chart.js Test</h2>
      <div className="h-64 bg-white p-4 rounded shadow">
        <Line data={testData} options={options} />
      </div>
    </div>
  )
}

export default ChartTest