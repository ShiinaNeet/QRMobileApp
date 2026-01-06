import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import "./Home.css";
import { RouteComponentProps } from "react-router";
import Account from "../components/Account";

const Home = (props: RouteComponentProps) => {
  const startScan = () => {
    props.history.push("scanner");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Code Scanner</IonTitle>
          <Account {...props} />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">QR Code Scanner</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <IonButton expand="full" onClick={startScan}>
            Start Scanning QR Code
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
