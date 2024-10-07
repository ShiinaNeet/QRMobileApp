import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'


import { RouteComponentProps } from 'react-router';

export default function Violation(props: RouteComponentProps) {
    const propsdata = props.location.state as { data: string };
    const [studentViolation, setStudentViolation] = useState({
        id: '',
        fullname: '' as string,
        violation: '' as string,
        email: '' as string,
    });
    const [isOpen, setIsOpen] = useState(false);
    const modal = useRef<HTMLIonModalElement>(null);
    const page = useRef(null);
  
    const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
    useEffect(() => {
      setPresentingElement(page.current);
    }, []);
    function dismiss() {
        modal.current?.dismiss();
    }
    const violationData = [
    { violation: 'Plagiarism' },
    { violation: 'Cheating' },
    { violation: 'Long Hair' },
    ];
    
    const handleSave = () => {
        console.log(studentViolation)
        setIsOpen(true);
    }

    return (
        <>
        <IonPage>
            <IonHeader>
            <IonToolbar>
                <IonTitle>Create Student Violation</IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding" >
                <IonList>
                    { (propsdata.data.length>0) && 
                        <>
                            <IonListHeader>
                                <IonLabel>Results:</IonLabel>
                            </IonListHeader>
                            <IonItem>
                                <IonLabel>{propsdata.data}</IonLabel>
                            </IonItem>
                        </>
                    }
                </IonList>
                <IonItem>
                    <IonSelect label="Default label" placeholder="Favorite Fruit">
                        <IonSelectOption value="apple">Plagarism</IonSelectOption>
                        <IonSelectOption value="banana">Cheating</IonSelectOption>
                        <IonSelectOption value="orange">Long Hair</IonSelectOption>
                    </IonSelect>
                </IonItem> 
                <IonLabel>{studentViolation.violation ? studentViolation.violation : 'Choose Violation'}</IonLabel>
                <IonButton id="open-modal" expand="block">
                    Choose Violation
                </IonButton>
                <IonItem>
                    <IonInput value={studentViolation.email} placeholder="user123@email.com" onIonChange={(event) => setStudentViolation({...studentViolation, email: event.detail.value! })}></IonInput>
                </IonItem> 
                <IonButton expand="full" onClick={handleSave}>Create Student Violation</IonButton>
                <>
                    <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
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
                    </IonModal> 
                </>
                <IonToast
                isOpen={isOpen}
                message={`${studentViolation.email}, ${studentViolation.violation}, ${studentViolation.id}`}
                onDidDismiss={() => setIsOpen(false)}
                duration={5000}
                ></IonToast>
            </IonContent>
        </IonPage>
        </>
    )
}