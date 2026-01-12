import { useEffect, useRef, useState } from "react";
import "./QRCodeScanner.css";
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from "@capacitor-mlkit/barcode-scanning";

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
        const { camera } = await BarcodeScanner.checkPermissions();
        if (camera !== "granted") {
          const { camera: newStatus } =
            await BarcodeScanner.requestPermissions();
          if (newStatus !== "granted") {
            if (props.onError) {
              props.onError("Camera permission denied");
            }
            return;
          }
        }

        // Make background transparent for camera view
        document.body.classList.add("scanner-active");
        setScanning(true);
        scannerActive.current = true;

        // Add listener for barcode scans
        const listener = await BarcodeScanner.addListener(
          "barcodeScanned",
          (result) => {
            if (result.barcode?.rawValue) {
              if (props.onScanned) {
                props.onScanned(result.barcode.rawValue);
              }
            }
          }
        );

        // Start scanning
        await BarcodeScanner.startScan({
          formats: [BarcodeFormat.QrCode],
          lensFacing: LensFacing.Back,
        });

        return () => {
          listener.remove();
        };
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
        BarcodeScanner.removeAllListeners();
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
