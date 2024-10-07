import { IonButton, IonButtons, IonPopover } from '@ionic/react'
import React from 'react'
import { RouteComponentProps } from 'react-router';

import { useAuth } from '../auth/AuthProvider'


const Account = (props: RouteComponentProps) => {
    const {logout} = useAuth();

    const handleLogout = async () => {
        try{
            await logout(() => {
                props.history.push("/Login");
            });
        }
        catch (error) {
            console.error("Failed to logout", error);
        }
    }

  return (
    <>
        <IonButtons slot="end">
            <IonButton id="click-trigger">Account</IonButton>
            <IonPopover trigger="click-trigger" triggerAction="click">
                <IonButton id="click-trigger" expand="full" onClick={handleLogout}>
                Logout
                </IonButton>
            </IonPopover>
        </IonButtons>
    </>  )
}
export default Account;