import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton,IonList,IonItem,IonLabel,IonCheckbox,IonListHeader,IonButtons,IonPopover, IonGrid, IonRow, IonInput, IonSelect, IonSelectOption, IonModal } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { DBR, TextResult } from 'capacitor-plugin-dynamsoft-barcode-reader';
import Account from '../components/Account';

const Home = (props:RouteComponentProps) => {
  const initLicenseTried = useRef(false);
  const [continuousScan, setContinuousScan] = useState(false);
  const [barcodeResults, setBarcodeResults] = useState([] as TextResult[]);
  const [licenseInitialized, setLicenseInitialized] = useState(false);

  const [studentViolation, setStudentViolation] = useState({
    id: '',
    fullname: '',
    violation: '',
  });

  const violationData = [
    { violation: 'Plagiarism' },
    { violation: 'Cheating' },
    { violation: 'Long Hair' },
  ];

  const handleOption = (e: any) => {
    let value = e.detail.value;
    let checked = e.detail.checked;
    setContinuousScan(checked)
  }
  useEffect(() => {
    if (initLicenseTried.current === false) {
      initLicenseTried.current = true;
      const initLicense = async () => {
        try {
          await DBR.initLicense({license:"DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAzMjc5NzQ1LVRYbFFjbTlxIiwibWFpblNlcnZlclVSTCI6Imh0dHBzOi8vbWRscy5keW5hbXNvZnRvbmxpbmUuY29tIiwib3JnYW5pemF0aW9uSUQiOiIxMDMyNzk3NDUiLCJzdGFuZGJ5U2VydmVyVVJMIjoiaHR0cHM6Ly9zZGxzLmR5bmFtc29mdG9ubGluZS5jb20iLCJjaGVja0NvZGUiOjU1MjE4ODQxN30="})  //one-day trial
          setLicenseInitialized(true);
        } catch (error) {
          alert(error);
        }
      }
      initLicense();
    }
    initLicenseTried.current = true;
  }, []);
  const startScan = () => {
    props.history.push("scanner",{continuousScan:continuousScan})
  }
  useEffect(() => {
    const state = props.location.state as { results?: TextResult[] };
    console.log(state);
    if (state) {
      if (state.results) {
        setBarcodeResults(state.results);
        props.history.replace({ state: {} });
      }
    }
  }, [props.location.state]);

 

  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>QR Code Scanner</IonTitle>
        {/* <Account {...props}/> */}
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding" >
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">QR Code Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
          {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <div style={{width: '100%'}}> */}
              <IonButton expand="full" onClick={startScan}>"Start Scanning"</IonButton>
              <IonList>
                <IonItem>
                  <IonLabel>Continuous Scan</IonLabel>
                  <IonCheckbox slot="end" value="Continuous Scan" checked={continuousScan} onIonChange={(e) => handleOption(e)}/>
                </IonItem>
                {(barcodeResults.length>0) &&
                  <IonListHeader>
                    <IonLabel>Results:</IonLabel>
                  </IonListHeader>
                }
                {barcodeResults.map((tr,idx) => (
                  <IonItem key={idx}>
                    <IonLabel>{(idx+1) + ". " + tr.barcodeFormat + ": " + tr.barcodeText}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
                {/* <IonItem>
                  <IonSelect label="Default label" placeholder="Favorite Fruit">
                    <IonSelectOption value="apple">Plagarism</IonSelectOption>
                    <IonSelectOption value="banana">Cheating</IonSelectOption>
                    <IonSelectOption value="orange">Long Hair</IonSelectOption>
                  </IonSelect>
                </IonItem> */}
                {/* <IonLabel>{studentViolation.violation ? studentViolation.violation : 'Choose Violation'}</IonLabel>
                <IonButton id="open-modal" expand="block">
                  Choose Violation
                </IonButton>
                <IonItem>
                  <IonInput label="Email Address:     " placeholder=" user123@email.com"></IonInput>
                </IonItem> */}
            {/* </div>
          </div> */}
          {/* <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Modal</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => dismiss()}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonList>
                {
                  violationData.map((data, index) => (
                    <IonItem key={index}>
                      <IonLabel onClick={(event)=> {
                      setStudentViolation({...studentViolation, violation: data.violation })
                        console.log(studentViolation)
                        dismiss()
                      }
                    }>{data.violation}</IonLabel>
                    </IonItem>
                  ))
                }
              </IonList>
            </IonContent>
          </IonModal> */}
    </IonContent>
  </IonPage>
  );
};

export default Home;
