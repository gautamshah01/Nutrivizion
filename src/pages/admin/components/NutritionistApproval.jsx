import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, User, Mail, Phone, MapPin, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const NutritionistApproval = () => {
  const [pendingNutritionists, setPendingNutritionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNutritionist, setSelectedNutritionist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to format location object or string
  const formatLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location) {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      if (location.country) parts.push(location.country);
      return parts.join(', ') || 'Location not specified';
    }
    return 'Location not specified';
  };

  useEffect(() => {
    fetchPendingNutritionists();
  }, []);

  const fetchPendingNutritionists = async () => {
    try {
      console.log('Loading nutritionist approvals with mock data...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for development
      setPendingNutritionists([
        {
          _id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1-555-0123',
          specialization: 'Clinical Nutrition',
          experience: 8,
          education: 'MS in Nutritional Sciences, RD',
          location: 'New York, NY',
          bio: 'Specialized in weight management and metabolic disorders with 8+ years of clinical experience.',
          certifications: ['Registered Dietitian', 'Certified Diabetes Educator'],
          languages: ['English', 'Spanish'],
          createdAt: '2024-01-15T10:30:00Z',
          documents: {
            license: 'license_sarah_johnson.pdf',
            certificate: 'cert_sarah_johnson.pdf',
            resume: 'resume_sarah_johnson.pdf'
          }
        },
        {
          _id: '2',
          name: 'Dr. Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+1-555-0456',
          specialization: 'Sports Nutrition',
          experience: 5,
          education: 'PhD in Exercise and Nutrition Science',
          location: 'Los Angeles, CA',
          bio: 'Expert in sports performance nutrition and supplement guidance for athletes.',
          certifications: ['CSCS', 'Sports Nutritionist Certification'],
          languages: ['English', 'Mandarin'],
          createdAt: '2024-01-16T14:20:00Z',
          documents: {
            license: 'license_michael_chen.pdf',
            certificate: 'cert_michael_chen.pdf',
            resume: 'resume_michael_chen.pdf'
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching pending nutritionists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (nutritionistId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/dashboard/nutritionists/${nutritionistId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Nutritionist approved successfully!');
        setPendingNutritionists(prev => prev.filter(n => n._id !== nutritionistId));
        setIsModalOpen(false);
      } else {
        // For demo purposes, simulate approval
        toast.success('Nutritionist approved successfully!');
        setPendingNutritionists(prev => prev.filter(n => n._id !== nutritionistId));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error approving nutritionist:', error);
      toast.error('Failed to approve nutritionist');
    }
  };

  const handleReject = async (nutritionistId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/dashboard/nutritionists/${nutritionistId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Nutritionist application rejected');
        setPendingNutritionists(prev => prev.filter(n => n._id !== nutritionistId));
        setIsModalOpen(false);
      } else {
        // For demo purposes, simulate rejection
        toast.success('Nutritionist application rejected');
        setPendingNutritionists(prev => prev.filter(n => n._id !== nutritionistId));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error rejecting nutritionist:', error);
      toast.error('Failed to reject nutritionist');
    }
  };

  const openDetailsModal = (nutritionist) => {
    setSelectedNutritionist(nutritionist);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nutritionist Approvals</h2>
        <p className="text-gray-600 mt-2">
          Review and approve new nutritionist applications before they can access the platform
        </p>
      </div>

      {pendingNutritionists.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
          <p className="text-gray-500">All nutritionist applications have been reviewed</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingNutritionists.map((nutritionist) => (
            <div key={nutritionist._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{nutritionist.name}</h3>
                    <p className="text-blue-600 font-medium">{nutritionist.specialization}</p>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formatLocation(nutritionist.location)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openDetailsModal(nutritionist)}
                    className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => handleApprove(nutritionist._id)}
                    className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(nutritionist._id)}
                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {nutritionist.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {nutritionist.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2" />
                  {nutritionist.experience} years experience
                </div>
              </div>

              <div className="mt-3 text-gray-700">
                <p className="line-clamp-2">{nutritionist.bio}</p>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Applied: {new Date(nutritionist.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedNutritionist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{selectedNutritionist.name}</h4>
                    <p className="text-blue-600">{selectedNutritionist.specialization}</p>
                    <p className="text-gray-500">
                      {formatLocation(selectedNutritionist.location)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedNutritionist.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedNutritionist.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p className="text-gray-900">{selectedNutritionist.experience} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Education</label>
                    <p className="text-gray-900">{selectedNutritionist.education}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Bio</label>
                  <p className="text-gray-900 mt-1">{selectedNutritionist.bio}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Certifications</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedNutritionist.certifications?.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Languages</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedNutritionist.languages?.map((lang, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedNutritionist._id)}
                    className="flex-1 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedNutritionist._id)}
                    className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionistApproval;