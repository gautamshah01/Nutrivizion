import React, { useState, useEffect } from 'react';

const VerificationSystem = () => {
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      // Mock data for development - replace with actual API call
      const mockData = [
        {
          _id: '1',
          nutritionist: {
            _id: 'n1',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@email.com'
          },
          documents: [
            {
              type: 'license',
              filename: 'medical_license.pdf',
              uploadDate: new Date(),
              status: 'pending'
            },
            {
              type: 'certificate',
              filename: 'nutrition_certificate.pdf',
              uploadDate: new Date(),
              status: 'pending'
            }
          ],
          submittedAt: new Date(),
          status: 'pending'
        },
        {
          _id: '2',
          nutritionist: {
            _id: 'n2',
            name: 'Dr. Michael Brown',
            email: 'michael.brown@email.com'
          },
          documents: [
            {
              type: 'license',
              filename: 'RD_license.pdf',
              uploadDate: new Date(),
              status: 'approved'
            }
          ],
          submittedAt: new Date(),
          status: 'approved'
        }
      ];
      setVerifications(mockData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentAction = async (nutritionistId, docIndex, action) => {
    try {
      // Mock action - replace with actual API call
      console.log(`${action} document for nutritionist ${nutritionistId}`);
      await fetchVerifications(); // Refresh data
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  const previewDocument = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const DocumentModal = () => {
    if (!showModal || !selectedDoc) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Document Preview</h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-medium text-gray-900">{selectedDoc.filename}</p>
            <p className="text-sm text-gray-600 mt-2">Document preview would appear here</p>
            <p className="text-xs text-gray-500 mt-4">
              In a real implementation, this would show the actual PDF/image content
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => handleDocumentAction(selectedDoc.nutritionistId, selectedDoc.index, 'approve')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleDocumentAction(selectedDoc.nutritionistId, selectedDoc.index, 'reject')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 rounded-lg h-32"></div>
        <div className="bg-gray-200 rounded-lg h-64"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Verification System</h2>
        <p className="text-gray-600 mt-1">Review and approve nutritionist certification documents</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {verifications.filter(v => v.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {verifications.filter(v => v.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {verifications.filter(v => v.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Verification Requests</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {verifications.map((verification) => (
            <div key={verification._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-700 font-medium">
                        {verification.nutritionist.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {verification.nutritionist.name}
                      </h4>
                      <p className="text-sm text-gray-600">{verification.nutritionist.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Submitted Documents:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {verification.documents.map((doc, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {doc.type}
                            </span>
                            {getStatusBadge(doc.status)}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{doc.filename}</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => previewDocument({...doc, nutritionistId: verification.nutritionist._id, index})}
                              className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                            >
                              Preview
                            </button>
                            {doc.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleDocumentAction(verification.nutritionist._id, index, 'approve')}
                                  className="text-green-600 hover:text-green-800 text-xs bg-green-50 px-2 py-1 rounded"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDocumentAction(verification.nutritionist._id, index, 'reject')}
                                  className="text-red-600 hover:text-red-800 text-xs bg-red-50 px-2 py-1 rounded"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  {getStatusBadge(verification.status)}
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DocumentModal />
    </div>
  );
};

export default VerificationSystem;