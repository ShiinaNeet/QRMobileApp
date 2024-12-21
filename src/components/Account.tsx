import { IonButton, IonButtons, IonLoading, IonPopover } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

import { useAuth } from "../auth/AuthProvider";
import { Preferences } from "@capacitor/preferences";

const Account = (props: RouteComponentProps) => {
  const { logout, userType, setUserType } = useAuth();
  const [alertMessage, setAlertMessage] = useState({
    isOpen: false,
    message: "",
  });
  const handleLogout = async () => {
    try {
      // setAlertMessage({isOpen: true, message: 'Loading...'});

      logout(() => {
        props.history.push("/Login");
      });
    } catch (error: any) {
      console.error("Failed to logout", error);
      setAlertMessage({ isOpen: true, message: error.message as string });
    }
    setTimeout(() => {
      setAlertMessage({ isOpen: false, message: "" });
    }, 2000);
  };
  useEffect(() => {
    const checkAuth = async () => {
      const { value: loggedInUserType } = await Preferences.get({
        key: "userType",
      });
      setUserType(loggedInUserType || "");
    };
    checkAuth();
  }, []);
  return (
    <>
      <IonButtons slot="end">
        <IonButton id="click-trigger">
          {userType.length > 0 ? userType : "Account"}
        </IonButton>
        <IonPopover trigger="click-trigger" triggerAction="click">
          <IonButton id="click-trigger" expand="full" onClick={handleLogout}>
            Logout
          </IonButton>
        </IonPopover>
      </IonButtons>
      <IonLoading isOpen={alertMessage.isOpen} message={alertMessage.message} />
    </>
  );
};
export default Account;
