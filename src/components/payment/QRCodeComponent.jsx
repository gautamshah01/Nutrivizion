// QR Code component for UPI payment
import React from 'react';

const QRCodeComponent = ({ upiId, amount, recipientName }) => {
  // In a real implementation, you would generate QR code using a library like qrcode
  // For now, we'll use a placeholder that represents the UPI QR code
  const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR`;
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-lg">
      {/* QR Code placeholder - in production, use a QR code library */}
      <div className="w-48 h-48 bg-gray-100 border border-gray-300 rounded flex items-center justify-center mb-2">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">UPI QR Code</div>
          {/* Simple QR-like pattern for visual representation */}
          <div className="grid grid-cols-8 gap-px">
            {Array.from({ length: 64 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 ${
                  Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 text-center">
        <div>Scan with any UPI app</div>
        <div className="font-mono text-xs mt-1">{upiId}</div>
      </div>
    </div>
  );
};

export default QRCodeComponent;