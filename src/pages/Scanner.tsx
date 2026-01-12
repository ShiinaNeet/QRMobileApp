import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonPage,
  IonToast,
} from "@ionic/react";

import QRCodeScanner from "../components/QRCodeScanner";
import "./Scanner.css";
import { RouteComponentProps } from "react-router";
import { useRef, useState } from "react";
import {
  ellipsisHorizontalOutline,
  flashlightOutline,
  closeOutline,
} from "ionicons/icons";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

const Scanner = (props: RouteComponentProps) => {
  const ionBackground = useRef("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const toggleTorch = async () => {
    const newTorchState = !torchOn;
    setTorchOn(newTorchState);
    try {
      await BarcodeScanner.toggleTorch();
    } catch (e) {
      console.warn("Torch toggle failed", e);
    }
  };

  const goBack = async () => {
    await BarcodeScanner.stopScan();
    await BarcodeScanner.removeAllListeners();
    document.body.classList.remove("scanner-active");
    props.history.goBack();
  };

  const onScanned = (result: string) => {
    // Navigate to violation page with scanned data
    props.history.push("violation", { data: result });
  };

  const onCameraError = (error: any) => {
    console.error("Camera error:", error);
    setToastMessage(
      "Camera Error: " + (error.message || JSON.stringify(error))
    );
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <QRCodeScanner onScanned={onScanned} onError={onCameraError} />
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon
              icon={ellipsisHorizontalOutline}
              style={{ color: "white" }}
            />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton onClick={toggleTorch}>
              <IonIcon icon={flashlightOutline} />
            </IonFabButton>
            <IonFabButton onClick={goBack}>
              <IonIcon icon={closeOutline} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
