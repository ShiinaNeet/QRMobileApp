import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';

type Violation = { _id: string, name: string, date: string, description: string };

export default function Violation(props: RouteComponentProps) {
    const propsdata = props.location.state as { data: string };
    const [alertMessage, setAlertMessage] = useState('');
    const [studentViolation, setStudentViolation] = useState({
        userid: '1111111111',
        srcode: '1111111111',
        fullname: 'paolo',
        violation: [] as Violation[],
        year_department: '2nd Year - BSHM',
    });
    const [violations, setViolations] = useState<Violation[]>([]);

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
    const transformedViolations = studentViolation.violation.map(violation => ({
        ...violation,
        $oid: violation._id,
        _id: undefined // Remove the _id field
    }));
    const handleSave = () => {
       
        console.log(studentViolation);

        if(studentViolation.srcode == '' || studentViolation.userid == ''){
            console.log("All fields are required");
            setAlertMessage("All fields are required");
            return;
        }
        axios.post(`/user/create`, 
            {   
                srcode: studentViolation.srcode,
                userid: studentViolation.userid,
                fullname: studentViolation.fullname,
                type: 'STUDENT',
                year_and_department: studentViolation.year_department,
                // department: studentViolation.department,
                violations: transformedViolations,
            },
            {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (response.data.status ===  'success') {
                console.log("Saved");
                fetchData();
                setAlertMessage("Saved Successfully");
            } else {
                console.log("Failed to Update");
                setAlertMessage("Failed to save. Please try again!");
            }
        })
        .catch((e) => {
            console.log("Error Occurred: ", e);
            setAlertMessage("Network Error. Please try again!");
        });



        setAlertMessage('Student Violation Created');
        setIsOpen(true);
    }
    const userid = '6702563ae353e3cb0aae8378';

    const decodeQRCode = async () => {
        const response = await fetch(`/user/${userid}`);
        const data = await response.json();

        if (data.success === 'success') {
            console.log("User Decoded");
            console.log(data.data);
        } else {
            console.log("Something occurred! Please try again");
            console.log(data.message);
            setAlertMessage(data.message);
        }
    }

    const fetchUser = async (id: any) => {
        const response = await fetch(`/user/${id}`);
        const data = await response.json();

        if (data.success === 'success') {
            console.log("User Fetched");
            console.log(data.data);
            setAlertMessage("User Found");
            // setStudentViolation({
            //     userid: data.id,
            //     fullname: data.name,
            //     violation: data.violation,
            // });
        } else {
            console.log("User Not Found");
            setAlertMessage("User not Found. Please try again!");
            props.history.goBack();
        }
    };

    const fetchData = async () => {
        axios.get('/violation/paginated', {
            params: {
                skip: 0,
                limit: 100,
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (response.data.success === true) {
                console.log("Data fetched successfully");
                setViolations(response.data.total);
            } else {
                console.log("Failed to fetch data");
            }
        })
        .catch((error) => {
            console.error('There was an error fetching the data!', error);
        });
    };

    useEffect(() => {
        decodeQRCode();
        fetchData();
    }, [propsdata]);

    const handleDeleteViolation = (index: number) => {
        const updatedViolations = [...studentViolation.violation];
        updatedViolations.splice(index, 1);
        setStudentViolation({ ...studentViolation, violation: updatedViolations });
    };

    const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

    const handleAddViolation = (selectedvio:any) => {
        const selectedName = selectedvio.name;
        const viola = violations.find(v => v.name === selectedName);
        if (viola) {
            setSelectedViolation(viola);

            if (!studentViolation.violation.some(v => v.name === viola.name)) {
                const updatedViolations = [...studentViolation.violation, viola];
                console.log(updatedViolations)
                setStudentViolation({ ...studentViolation, violation: updatedViolations });
                setSelectedViolation(null);
            }
            
        }
        console.log(studentViolation.violation);
    };

    return (
        <>
        <IonPage ref={page}>
            <IonHeader>
            <IonToolbar>
                <IonTitle>Create Student Violation</IonTitle>
                <IonButtons slot="end">
                    <IonButton onClick={() => props.history.goBack()}>Back</IonButton>
                </IonButtons>
            </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonList>
                    {propsdata.data.length > 0 && 
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
                <IonLabel>Choose Violation</IonLabel>
                <IonButton id="open-modal" expand="block">
                    Choose Violation
                </IonButton>
                <IonItem className='ion-item'>
                    <label htmlFor="">Full Name:</label>
                    <input className='input' value={studentViolation.fullname} placeholder="Full name here..." onInput={(event: any) => setStudentViolation({...studentViolation, fullname: (event.target as HTMLInputElement).value })}></input>
                </IonItem> 
                <IonButton expand="full" onClick={handleSave}>Create Student Violation</IonButton>
                <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Choose Violation to Attach</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => dismiss()}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <div className='box'>
                            <label className='textheader'>Violation picked: </label>
                            { studentViolation.violation.map((data:any, index:any) => (
                                <IonItem key={index}>
                                    <IonLabel onClick={() => {handleDeleteViolation(index)} }>{data.name}</IonLabel>
                                </IonItem>
                            ))}
                        </div>
                        
                        <IonList>
                            {violations.map((vio, index) => (
                                <IonItem key={index}>
                                    <IonButton onClick={()=>handleAddViolation(vio)}>{vio.name}</IonButton>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                </IonModal> 
                <IonToast
                    isOpen={isOpen}
                    message={alertMessage}
                    onDidDismiss={() => setIsOpen(false)}
                    duration={5000}
                ></IonToast>
            </IonContent>
        </IonPage>
        </>
    );
}