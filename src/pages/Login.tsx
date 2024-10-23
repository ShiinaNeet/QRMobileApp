import React, { useEffect, useState } from "react";
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
    IonInputPasswordToggle,
    IonButton,
    IonLoading,
    IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../auth/AuthProvider";

export default function Login(props: RouteComponentProps) {
    const { login, isAuthenticated } = useAuth();
    const [user, setUser] = useState({
        fullname: "",
        password: "",
    });
    const [isLoading, setIslLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        isOpen: false,
        message: "",
    });

    const handleLogin = async () => {
        setIslLoading(true);
        console.log(user.fullname + " " + user.password);
        if (user.fullname === "" || user.password === "") {
            setAlertMessage({
                isOpen: true,
                message: "All fields are required",
            });
            setIslLoading(false);
            return;
        }
        const response = await login(user.fullname, user.password);

        if (response === "success") {
            setAlertMessage({ isOpen: true, message: "Welcome Back!" });
            props.history.push("/home");
        } else if (response === "Failed") {
            setAlertMessage({
                isOpen: true,
                message: "Login failed. Please try again!",
            });
        } else if (response === "Error") {
            setAlertMessage({
                isOpen: true,
                message: "Error. Please try again!",
            });
        }
        setIslLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            props.history.push("/home");
        }
    }, [isAuthenticated, props.history]);

    useEffect(() => {
        // Check for autofill values
        const fullnameInput = document.querySelector(
            'input[placeholder="Enter Username"]'
        ) as HTMLInputElement;
        const passwordInput = document.querySelector(
            'input[type="password"]'
        ) as HTMLInputElement;

        if (fullnameInput && fullnameInput.value) {
            setUser((prevUser) => ({
                ...prevUser,
                fullname: fullnameInput.value,
            }));
        }

        if (passwordInput && passwordInput.value) {
            setUser((prevUser) => ({
                ...prevUser,
                password: passwordInput.value,
            }));
        }
    }, []);

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>STUDENT VIOLATION</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="container-center">
                    <IonItem className="ion-item">
                        <label htmlFor="fullname">Username: </label>
                        <input
                            className="input"
                            placeholder="Enter Username"
                            name="fullname"
                            onInput={(event) =>
                                setUser({
                                    ...user,
                                    fullname: (event.target as HTMLInputElement)
                                        .value,
                                })
                            }
                        ></input>
                    </IonItem>
                    <IonItem className="ion-item">
                        <IonInput
                            type="password"
                            label="Password:"
                            name="password"
                            onIonChange={(event) =>
                                setUser({
                                    ...user,
                                    password: event.target.value as string,
                                })
                            }
                        >
                            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                    </IonItem>
                    <IonButton expand="full" onClick={handleLogin}>
                        {isLoading ? "Loading..." : "Login"}
                    </IonButton>
                </div>
            </IonContent>
            <IonToast
                isOpen={alertMessage.isOpen}
                message={alertMessage.message}
                onDidDismiss={() =>
                    setAlertMessage({ ...alertMessage, isOpen: false })
                }
                duration={3000}
            ></IonToast>
        </>
    );
}
