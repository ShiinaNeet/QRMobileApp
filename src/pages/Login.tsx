import React, { useEffect, useRef, useState } from "react";
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
  IonModal,
  IonLabel,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonButtons,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import axios from "axios";

export default function Login(props: RouteComponentProps) {
  const { login, isAuthenticated } = useAuth();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [registerUser, setRegisterUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    type: "",
  });
  const [isLoading, setIslLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    isOpen: false,
    message: "",
  });

  const handleLogin = async () => {
    setIslLoading(true);
    console.log(user.username + " " + user.password);
    if (user.username === "" || user.password === "") {
      setAlertMessage({
        isOpen: true,
        message: "All fields are required",
      });
      setIslLoading(false);
      return;
    }
    const response = await login(user.username, user.password);

    if (response.status === "success" && response.error === false) {
      setAlertMessage({ isOpen: true, message: "Welcome Back!" });
      props.history.push("/home");
    } else if (response.status === "failed") {
      setAlertMessage({
        isOpen: true,
        message: "Login failed. Please try again!",
      });
    } else if (response.status === "unauthorized" && response.error === true) {
      setAlertMessage({
        isOpen: true,
        message: "User doesn't have any permission to access this application!",
      });
    } else if (response.status === "error") {
      setAlertMessage({
        isOpen: true,
        message: response.message,
      });
    }
    setIslLoading(false);
  };
  const handleRegister = async () => {
    setIslLoading(true);
    registerUser.type = "SECURITY";
    if (
      registerUser.username === "" ||
      registerUser.password === "" ||
      registerUser.firstname === "" ||
      registerUser.lastname === "" ||
      registerUser.email === "" ||
      registerUser.type === ""
    ) {
      setAlertMessage({
        isOpen: true,
        message: "All fields are required",
      });
      setIslLoading(false);
      return;
    }
    console.log(registerUser);
    axios
      .post(
        "/user/create/admin",
        {
          first_name: registerUser.firstname,
          last_name: registerUser.lastname,
          email: registerUser.email,
          type: registerUser.type,
          password: registerUser.password,
          username: registerUser.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            //Man this sucks
            Authorization:
              "Bearer YJteR0Q6kyzryhnqOpVxp0HqDvzUK0goA74Ar5bIZCT83tfDMKcCbAJm-HTG4xgNNRVDMJHE2EJMtAd5mTUMDA",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Saved");
          setAlertMessage({
            isOpen: true,
            message: "Security Guard Account Created Successfully",
          });
        } else {
          setAlertMessage({
            isOpen: true,
            message: "Error Occurred! Please try again later.",
          });
        }
        dismiss();
        setIslLoading(false);
      })
      .catch((e) => {
        setIslLoading(false);
        setAlertMessage({
          isOpen: true,
          message: "Error Occurred! Please try again later.",
        });
        dismiss();
      });
    dismiss();
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
        username: fullnameInput.value,
      }));
    }

    if (passwordInput && passwordInput.value) {
      setUser((prevUser) => ({
        ...prevUser,
        password: passwordInput.value,
      }));
    }
  }, []);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }
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
              name="Username"
              onInput={(event) =>
                setUser({
                  ...user,
                  username: (event.target as HTMLInputElement).value,
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
          <div
            className="ion-item"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <IonNote
              id="open-custom-dialog"
              style={{
                color: "#87ceeb",
                cursor: "pointer",
                fontsize: "25px",
                paddingx: "10px",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#00aaff")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#87ceeb")}
            >
              Register
            </IonNote>
          </div>
        </div>
      </IonContent>

      <IonModal id="example-modal" ref={modal} trigger="open-custom-dialog">
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              {" "}
              <h1>Register an account</h1>
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => dismiss()}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="container-center">
          <IonItem className="ion-item">
            <IonInput
              label="First Name:"
              labelPlacement="stacked"
              placeholder="Enter First Name..."
              type="text"
              onIonChange={(event) =>
                setRegisterUser({
                  ...registerUser,
                  firstname: (event.target as HTMLIonInputElement)
                    .value as string,
                })
              }
            ></IonInput>
          </IonItem>
          <IonItem className="ion-item">
            <IonInput
              label="Last name:"
              labelPlacement="stacked"
              placeholder="Enter Last Name..."
              type="text"
              onIonChange={(event) =>
                setRegisterUser({
                  ...registerUser,
                  lastname: (event.target as HTMLIonInputElement)
                    .value as string,
                })
              }
            ></IonInput>
          </IonItem>
          <IonItem className="ion-item">
            <IonInput
              label="Username:"
              labelPlacement="stacked"
              placeholder="Enter username..."
              type="text"
              onIonChange={(event) =>
                setRegisterUser({
                  ...registerUser,
                  username: (event.target as HTMLIonInputElement)
                    .value as string,
                })
              }
            ></IonInput>
          </IonItem>
          <IonItem className="ion-item">
            <IonInput
              label="Email Address:"
              labelPlacement="stacked"
              placeholder="Enter email..."
              type="text"
              onIonChange={(event) =>
                setRegisterUser({
                  ...registerUser,
                  email: (event.target as HTMLIonInputElement).value as string,
                })
              }
            ></IonInput>
          </IonItem>
          <IonItem className="ion-item">
            <IonInput
              type="password"
              label="Password:"
              name="password"
              onIonChange={(event) =>
                setRegisterUser({
                  ...registerUser,
                  password: (event.target as HTMLIonInputElement)
                    .value as string,
                })
              }
            >
              <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
            </IonInput>
          </IonItem>
          <IonButton expand="full" onClick={handleRegister}>
            {isLoading ? "Loading..." : "Create a Guard Account"}
          </IonButton>
        </div>
      </IonModal>
      <IonToast
        isOpen={alertMessage.isOpen}
        message={alertMessage.message}
        onDidDismiss={() => setAlertMessage({ ...alertMessage, isOpen: false })}
        duration={2000}
      ></IonToast>
    </>
  );
}
