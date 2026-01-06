import { useEffect, useRef, useState } from "react";
import "./QRCodeScanner.css";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

export interface QRCodeScannerProps {
  onScanned?: (result: string) => void;
  onError?: (error: any) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = (
  props: QRCodeScannerProps
) => {
  const [scanning, setScanning] = useState(false);
  const scannerActive = useRef(false);

  useEffect(() => {
    const startScan = async () => {
      try {
        // Check/request camera permission
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (!status.granted) {
          if (props.onError) {
            props.onError("Camera permission denied");
          }
          return;
        }

        // Make background transparent for camera view
        BarcodeScanner.hideBackground();
        document.body.classList.add("scanner-active");
        setScanning(true);
        scannerActive.current = true;

        // Start scanning
        const result = await BarcodeScanner.startScan();

        // Scan complete - result received
        if (result.hasContent && result.content) {
          if (props.onScanned) {
            props.onScanned(result.content);
          }
        }
      } catch (error) {
        console.error("Scanner error:", error);
        if (props.onError) {
          props.onError(error);
        }
      }
    };

    startScan();

    return () => {
      // Cleanup on unmount
      if (scannerActive.current) {
        BarcodeScanner.stopScan();
        BarcodeScanner.showBackground();
        document.body.classList.remove("scanner-active");
        scannerActive.current = false;
      }
    };
  }, []);

  return (
    <>
      {!scanning && <div>Initializing scanner...</div>}
      {/* The camera view is rendered by the native plugin, 
          we just need a transparent container */}
      <div className="scanner-container"></div>
    </>
  );
};

export default QRCodeScanner;
