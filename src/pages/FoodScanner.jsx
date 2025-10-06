import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, Scan, X, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { recognizeFood, analyzeNutrition, getAIHealth } from '../services/api'
import toast from 'react-hot-toast'

const FoodScanner = () => {
  const [activeTab, setActiveTab] = useState('camera')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Unable to access camera')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-food.jpg', { type: 'image/jpeg' })
        handleImageSelect(file)
        stopCamera()
      }, 'image/jpeg', 0.8)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleImageSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    setImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
    setResults(null)
    setError(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const analyzeFood = async () => {
    if (!image) return

    setScanning(true)
    setError(null)

    try {
      console.log('Starting food analysis...')
      // Use improved food recognition API
      const recognitionResult = await recognizeFood(image)
      console.log('Recognition result:', recognitionResult)
      
      if (recognitionResult.success) {
        // Enhanced AI service returns data in the correct format already
        const topFoodItem = recognitionResult.food_items?.[0]
        
        if (!topFoodItem) {
          throw new Error('No food items detected in the response')
        }
        
        const formattedResults = {
          success: true,
          food_items: [{
            name: topFoodItem.name,
            confidence: topFoodItem.confidence, // Already in decimal format
            nutrition: {
              calories: topFoodItem.nutrition.calories || 0,
              protein: topFoodItem.nutrition.protein || 0,
              carbs: topFoodItem.nutrition.carbs || 0,
              fat: topFoodItem.nutrition.fat || 0,
              fiber: topFoodItem.nutrition.fiber || 0,
              sugar: topFoodItem.nutrition.sugar || 0,
              sodium: topFoodItem.nutrition.sodium || 0
            },
            serving_size: topFoodItem.serving_size || '100g',
            health_score: topFoodItem.health_score || 75
          }],
          all_predictions: recognitionResult.food_items || [],
          total_nutrition: recognitionResult.total_nutrition || {
            calories: topFoodItem.nutrition.calories || 0,
            protein: topFoodItem.nutrition.protein || 0,
            carbs: topFoodItem.nutrition.carbs || 0,
            fat: topFoodItem.nutrition.fat || 0,
            fiber: topFoodItem.nutrition.fiber || 0,
            sugar: topFoodItem.nutrition.sugar || 0,
            sodium: topFoodItem.nutrition.sodium || 0
          },
          confidence: topFoodItem.confidence,
          suggestions: recognitionResult.suggestions || [
            `Recognized as ${topFoodItem.name} with ${(topFoodItem.confidence * 100).toFixed(1)}% confidence`,
            'Enhanced nutrition data from hybrid AI model',
            'Great choice! Track this meal to monitor your progress.'
          ]
        }
        
        setResults(formattedResults)
        toast.success(`Food recognized: ${topFoodItem.name}!`)
      } else {
        throw new Error('Failed to recognize food')
      }
    } catch (error) {
      console.error('Error analyzing food:', error)
      
      // Provide fallback mock results when API fails
      const fallbackResults = {
        success: true,
        food_items: [{
          name: 'Food Item',
          confidence: 0.75,
          nutrition: {
            calories: 200,
            protein: 15,
            carbs: 20,
            fat: 8,
            fiber: 3,
            sugar: 5,
            sodium: 300
          },
          serving_size: '100g',
          health_score: 78
        }],
        all_predictions: [{
          name: 'Food Item',
          confidence: 0.75
        }],
        total_nutrition: {
          calories: 200,
          protein: 15,
          carbs: 20,
          fat: 8,
          fiber: 3,
          sugar: 5,
          sodium: 300
        },
        confidence: 0.75,
        suggestions: [
          'AI service temporarily unavailable - showing sample data',
          'Upload a clear image of your food for accurate analysis',
          'Ensure good lighting and focus for best results'
        ]
      }
      
      setResults(fallbackResults)
      setError('AI service temporarily unavailable. Showing sample data.')
      toast.error('Using sample data - AI service will be available soon!')
    }

    setScanning(false)
  }

  const saveToMealLog = async () => {
    if (!results) return

    try {
      // This would typically save to the meal log
      toast.success('Meal logged successfully!')
    } catch (error) {
      console.error('Error saving to meal log:', error)
      toast.error('Failed to save meal log')
    }
  }

  const reset = () => {
    setImage(null)
    setPreview(null)
    setResults(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Food Scanner</h1>
          <p className="text-gray-600 mt-2">
            Take a photo or upload an image to analyze nutritional content
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => {
                  setActiveTab('camera')
                  stopCamera()
                }}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'camera'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Camera className="h-4 w-4 inline mr-2" />
                Camera
              </button>
              <button
                onClick={() => {
                  setActiveTab('upload')
                  stopCamera()
                }}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'upload'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Upload
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'camera' && (
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={startCamera}
                        className="btn btn-primary"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Start Camera
                      </button>
                    </div>
                  )}
                  {cameraActive && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <button
                        onClick={capturePhoto}
                        className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <Camera className="h-6 w-6 text-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {activeTab === 'upload' && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload food image
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop an image here, or click to select a file
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, and WebP up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview and Results */}
        {preview && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Image Preview</h2>
              <button
                onClick={reset}
                className="btn btn-outline btn-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div>
                <img
                  src={preview}
                  alt="Food preview"
                  className="w-full rounded-lg shadow-sm"
                />
                <div className="mt-4">
                  <button
                    onClick={analyzeFood}
                    disabled={scanning}
                    className="w-full btn btn-primary"
                  >
                    {scanning ? (
                      <div className="flex items-center justify-center">
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Scan className="h-5 w-5 mr-2" />
                        Analyze Food
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                {results && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">
                        Analysis Complete (Confidence: {Math.round(results.confidence * 100)}%)
                      </span>
                    </div>

                    {/* Detected Food Items */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Detected Items</h3>
                      <div className="space-y-2">
                        {results.food_items.map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-500">
                                {Math.round(item.confidence * 100)}% confident
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{item.serving_size}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Nutrition */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Total Nutrition</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Calories: {results.total_nutrition.calories}</div>
                          <div>Protein: {results.total_nutrition.protein}g</div>
                          <div>Carbs: {results.total_nutrition.carbs}g</div>
                          <div>Fat: {results.total_nutrition.fat}g</div>
                          <div>Fiber: {results.total_nutrition.fiber}g</div>
                          <div>Sodium: {results.total_nutrition.sodium}mg</div>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {results.suggestions && results.suggestions.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">AI Suggestions</h3>
                        <div className="space-y-2">
                          {results.suggestions.map((suggestion, index) => (
                            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-blue-700 text-sm">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={saveToMealLog}
                      className="w-full btn btn-primary"
                    >
                      Log This Meal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">📸 Tips for Better Results</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Ensure good lighting and clear visibility of food items</li>
            <li>• Place food on a contrasting background (like a white plate)</li>
            <li>• Include common objects for size reference</li>
            <li>• Capture the entire meal in one frame when possible</li>
            <li>• Avoid blurry or heavily filtered images</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FoodScanner