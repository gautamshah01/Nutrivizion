import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentQRModal = ({ isVisible, onClose, patientName, amount = 1000 }) => {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Payment session expired');
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onClose]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentDone = () => {
    setIsPaymentConfirmed(true);
    toast.success('Payment confirmed! Thank you.');
    setTimeout(() => {
      onClose();
      setIsPaymentConfirmed(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Payment Required</h3>
              <p className="text-green-100 text-sm mt-1">Appointment with {patientName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {!isPaymentConfirmed ? (
            <>
              {/* Timer */}
              <div className="mb-6">
                <div className="text-2xl font-bold text-red-500 bg-red-50 rounded-lg py-2 px-4 inline-block">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-gray-500 text-sm mt-1">Time remaining</p>
              </div>

              {/* Patient Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <span className="text-green-600 font-bold text-lg">D</span>
                </div>
                <h4 className="font-semibold text-gray-900">{patientName}</h4>
                <p className="text-sm text-gray-600">UPI ID: dilipshah7771@oksbi</p>
              </div>

              {/* QR Code */}
              <div className="mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
                  <div className="w-48 h-48 mx-auto bg-white flex items-center justify-center border border-gray-300 rounded">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=upi://pay?pa=dilipshah7771@oksbi&pn=Dilip&am=${amount}&cu=INR`}
                      alt="UPI QR Code" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback if QR service is unavailable
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full flex-col items-center justify-center text-gray-500 text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <div className="text-sm">QR Code</div>
                      <div className="text-xs mt-1">Pay to: dilipshah7771@oksbi</div>
                      <div className="text-xs">Amount: ₹{amount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">₹{amount.toLocaleString()}</div>
                <p className="text-gray-600 text-sm">Consultation Fee</p>
              </div>

              {/* Instructions */}
              <div className="mb-6 text-left bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Scan QR code with any UPI app</li>
                  <li>• Or pay to UPI ID: dilipshah7771@oksbi</li>
                  <li>• Enter amount: ₹{amount}</li>
                  <li>• Complete the payment</li>
                  <li>• Click "Done" below after payment</li>
                </ul>
              </div>

              {/* Done Button */}
              <button
                onClick={handlePaymentDone}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Check className="h-5 w-5" />
                <span>Payment Done</span>
              </button>
            </>
          ) : (
            /* Payment Confirmed */
            <div className="py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Payment Confirmed!</h4>
              <p className="text-gray-600">Thank you for the payment. The consultation is now confirmed.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentQRModal;