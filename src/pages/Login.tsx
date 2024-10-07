import React, { useState } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonInputPasswordToggle, IonButton } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { useAuth } from '../auth/AuthProvider';

export default function Login(props: RouteComponentProps) {
    const { login } = useAuth();
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async () => {
        try {
            await login(user.email, user.password, () => {
                props.history.push("/home");
            });
        } catch (error) {
            console.error("Failed to login", error);
        }
    };

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput label="Email Address" labelPlacement="floating" placeholder="Enter Email Address" onIonChange={(event) => setUser({ ...user, email: event.target.value as string })}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput type="password" label="Password" onIonChange={(event) => setUser({ ...user, password: event.target.value as string })}>
                        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                    </IonInput>
                </IonItem>
                <IonButton expand="full" onClick={handleLogin}>Login</IonButton>
            </IonContent>
        </>
    );
}