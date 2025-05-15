// pages/scan-close.tsx
import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanClosePage() {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("✅ QR Code Detected:", decodedText);
        // You can extract ticket number and call Firestore here
        scanner.clear();
      },
      (errorMessage) => {
        console.warn("❌ QR Error:", errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(err => console.error(err));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Scan Ticket QR</h2>
      <div id="qr-reader" ref={scannerRef} className="mx-auto max-w-sm" />
    </div>
  );
}
