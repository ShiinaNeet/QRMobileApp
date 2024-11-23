import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { navigate } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";

type Violation = {
  _id: string;
  name: string;
  date: string;
  description: string;
};

export default function Violation(props: RouteComponentProps) {
  const propsdata = props.location.state as { data: string };
  const [alertMessage, setAlertMessage] = useState("");
  type Department = {
    name: string;
  };
  const [departmentRows, setDepartmentRows] = useState<Department[]>([]);
  const [studentViolation, setStudentViolation] = useState({
    _id: "",
    userid: "",
    srcode: "",
    fullname: "",
    email: "",
    type: "STUDENT",
    violations: [] as Violation[],
    year_and_department: "",
    assigned_department: "",
  });
  const [isExistingStudent, setIsExistingStudent] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    year: "",
    department: "",
    assigned_department: "",
  });
  const [violations, setViolations] = useState<Violation[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  const [isloading, setIsLoading] = useState(false);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  useEffect(() => {
    setPresentingElement(page.current);
  }, []);
  function dismiss() {
    modal.current?.dismiss();
  }
  const transformedViolations = studentViolation.violations.map(
    (violation) => ({
      ...violation,
      $oid: violation._id,
      _id: undefined, // Remove the _id field
    })
  );
  const handleSave = () => {
    console.log(studentViolation);

    if (
      studentViolation.srcode == "" ||
      studentViolation.userid == "" ||
      studentViolation.violations.length == 0 ||
      studentInfo.assigned_department == "" ||
      studentInfo.year == ""
    ) {
      console.log("All fields are required");
      setAlertMessage("All fields are required");
      return;
    }
    const yearDepartment = `${studentInfo.assigned_department} - ${studentInfo.year}`;

    axios
      .post(
        `/user/create/student`,
        {
          srcode: studentViolation.srcode,
          userid: studentViolation.userid,
          fullname: studentViolation.fullname,
          email: studentViolation.email,
          type: "STUDENT",
          year_and_department: yearDepartment,
          assigned_department: studentInfo.assigned_department,
          violations: transformedViolations,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Saved");
          // fetchData();
          setIsOpen(true);
          setAlertMessage("Student Violation Created");
          setTimeout(() => {
            props.history.replace("/home");
          }, 1000);
        } else {
          console.log("Failed to Update");
          setIsOpen(true);
          setAlertMessage("Failed to save. Please try again!");
        }
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setIsOpen(true);
        setAlertMessage("Network Error. Please try again!");
        props.history.replace("/home");
      });
  };

  const handleUpdate = () => {
    setIsLoading(true);
    if (
      studentViolation.srcode == "" ||
      studentViolation.userid == "" ||
      studentViolation.violations.length == 0 ||
      studentInfo.department == "" ||
      studentInfo.department == undefined ||
      studentInfo.year == ""
    ) {
      console.log("All fields are required");
      setIsLoading(false);
      setIsOpen(true);
      setAlertMessage("All fields are required");
      return;
    }
    const yearDepartment = `${studentInfo.department} - ${studentInfo.year}`;
    console.warn("HANDLE_UPDATE_FUNCTION_student_info: ", yearDepartment);

    const updatedStudentViolation = {
      ...studentViolation,
      year_and_department: yearDepartment,
    };

    setStudentViolation(updatedStudentViolation);

    console.log("HANDLE_UPDATE_FUNCTION: ", studentViolation);
    axios
      .put(
        `/user/update/student/${studentViolation.userid}`,
        {
          year_and_department: yearDepartment,
          violations: transformedViolations,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Student Violation Updated");
          setIsOpen(true);
          setAlertMessage("Student Violation Updated");
          setTimeout(() => {
            props.history.replace("/home");
          }, 1000);
        } else {
          console.log("Failed to Update");
          setIsOpen(true);
          setAlertMessage("Failed to save. Please try again!");
        }
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setIsOpen(true);
        setAlertMessage("Network Error. Please try again!");
        props.history.replace("/home");
      });
  };

  const decodeQRCode = async () => {
    axios
      .get(`/decode_qr`, {
        params: {
          token: propsdata.data,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (
          response.data.data.userid &&
          response.data.data.srcode &&
          response.data.data.userid.length > 0 &&
          response.data.data.srcode.length > 0
        ) {
          console.log("Fetched QR Code Successfully");
          setAlertMessage("Fetched QR Code Successfully");
          setIsLoading(false);
          fetchUser(response.data.data.userid);
          setStudentViolation({
            ...studentViolation,
            userid: response.data.data.userid,
            srcode: response.data.data.srcode,
            fullname: response.data.data.fullname,
            type: response.data.data.type,
          });
        } else {
          console.log("QR Code is invalid");

          setIsOpen(true);
          setAlertMessage("QR Code is invalid. Please try again!");
          setTimeout(() => {
            props.history.push("/home", { replace: true });
            setIsLoading(false);
          }, 1000);
        }
      })
      .catch((e) => {
        console.log("Error Occurred: ", e);
        setAlertMessage("Network Error. Please try again!");
      });
  };
  const fetchUser = (userid: number) => {
    axios
      .get(`/user/${userid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "failed") {
          setIsExistingStudent(false);
        } else {
          setIsExistingStudent(true);
          console.log("THIS USER ID" + response.data._id);
          setStudentViolation({
            ...studentViolation,
            _id: response.data._id,
            userid: response.data.userid,
            srcode: response.data.srcode,
            fullname: response.data.fullname,
            type: response.data.type,
            violations: response.data.violations,
            email: response.data.email,
            year_and_department: response.data.year_and_department,
            assigned_department: response.data.year_and_department,
          });

          setStudentInfo({
            department: response.data.year_and_department.split(" - ")[0],
            year: response.data.year_and_department.split(" - ")[1],
            assigned_department: response.data.assigned_department,
          });
          console.info("FETCH_USER: ", studentInfo);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };
  const fetchData = async () => {
    axios
      .get("/violation/paginated", {
        params: {
          skip: 0,
          limit: 100,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          console.log("Data fetched successfully");
          setViolations(response.data.total);
        } else {
          console.log("Failed to fetch data");
          setRefresh((prev) => !prev);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setRefresh((prev) => !prev);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    decodeQRCode();
    fetchData();
    fetchDepartments();
  }, [propsdata, refresh]);

  const fetchDepartments = async () => {
    axios
      .get("/department", {
        params: {
          skip: 0,
          limit: 100,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          console.log("Data fetched successfully");
          setDepartmentRows(response.data.data);
        } else {
          console.log("Failed to fetch data");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };
  const handleDeleteViolation = (index: number) => {
    const updatedViolations = [...studentViolation.violations];
    updatedViolations.splice(index, 1);
    setStudentViolation({
      ...studentViolation,
      violations: updatedViolations,
    });
  };

  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  );

  const handleAddViolation = (selectedvio: any) => {
    const selectedName = selectedvio.name;
    const viola = violations.find((v) => v.name === selectedName);
    if (viola) {
      setSelectedViolation(viola);

      if (!studentViolation.violations.some((v) => v.name === viola.name)) {
        const updatedViolations = [...studentViolation.violations, viola];
        console.log(updatedViolations);
        setStudentViolation({
          ...studentViolation,
          violations: updatedViolations,
        });
        setSelectedViolation(null);
      }
    }
    console.log(studentViolation.violations);
  };

  return (
    <>
      <IonPage ref={page}>
        {isloading ? (
          <>
            <IonContent fullscreen className="ion-padding">
              <IonLabel>Loading...</IonLabel>
              <IonToast
                isOpen={isOpen}
                message={alertMessage}
                onDidDismiss={() => setIsOpen(false)}
                duration={5000}
              ></IonToast>
            </IonContent>
          </>
        ) : (
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle>
                  {isExistingStudent ? "Update" : "Create"} Student Violation
                </IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() => props.history.goBack()}
                    color="primary"
                  >
                    Back
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
              <div className="container-center">
                <IonList style={{ width: "100%" }}>
                  {propsdata.data.length > 0 && (
                    <>
                      <IonItem className="">
                        <div className="container">
                          <label htmlFor="">{studentViolation._id}</label>
                          <label>
                            {studentViolation.userid
                              ? studentViolation.userid
                              : "Loading"}
                          </label>
                          <label className="">
                            {studentViolation.fullname
                              ? studentViolation.fullname
                              : "Loading"}
                          </label>
                          <label>
                            {studentViolation.type
                              ? studentViolation.type
                              : "Loading"}
                          </label>
                        </div>
                      </IonItem>
                    </>
                  )}
                </IonList>
                <div className="container">
                  <IonLabel>Choose Violation</IonLabel>
                  <IonButton id="open-modal" expand="block">
                    Choose Violation
                  </IonButton>
                </div>
                <IonItem className="ion-item">
                  <IonInput
                    disabled={isExistingStudent}
                    labelPlacement="stacked"
                    label="Email Address"
                    onInput={(event: any) =>
                      setStudentViolation({
                        ...studentViolation,
                        email: (event.target as HTMLInputElement).value,
                      })
                    }
                    value={studentViolation.email}
                    placeholder="Email Address here..."
                  ></IonInput>
                </IonItem>
                <IonItem className="ion-item">
                  <IonSelect
                    label="Departments"
                    labelPlacement="stacked"
                    onIonChange={(event: any) =>
                      setStudentInfo({
                        ...studentInfo,
                        assigned_department: (event.target as HTMLInputElement)
                          .value,
                      })
                    }
                  >
                    {departmentRows.map((department) => (
                      <IonSelectOption
                        key={department.name}
                        value={department.name}
                      >
                        {department.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem className="ion-item">
                  <IonInput
                    labelPlacement="stacked"
                    label="Year"
                    value={studentInfo.year}
                    onIonChange={(event: any) =>
                      setStudentInfo({
                        ...studentInfo,
                        year: (event.target as HTMLInputElement).value,
                      })
                    }
                    placeholder="Year level here..."
                  ></IonInput>
                </IonItem>
                <IonButton
                  expand="full"
                  onClick={isExistingStudent ? handleUpdate : handleSave}
                >
                  {isExistingStudent
                    ? "Update Student Violation"
                    : "Create Student Violation"}
                </IonButton>
              </div>

              <IonModal
                ref={modal}
                trigger="open-modal"
                presentingElement={presentingElement!}
              >
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>Choose Violation to Attach</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => dismiss()}>Close</IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "5px",
                    }}
                  >
                    <label style={{ paddingTop: "20px" }}>
                      Violation attached{" "}
                    </label>
                    {studentViolation.violations.map(
                      (data: any, index: any) => (
                        <IonItem key={index}>
                          <IonLabel
                            onClick={() => {
                              handleDeleteViolation(index);
                            }}
                          >
                            {data.name}
                          </IonLabel>
                        </IonItem>
                      )
                    )}
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <label style={{ paddingTop: "20px" }}>
                      Violation Available
                    </label>
                    {violations.map((vio, index) => (
                      <IonButton
                        style={
                          studentViolation.violations.some(
                            (v) => v.name === vio.name
                          )
                            ? { display: "none" }
                            : { display: "block" }
                        }
                        onClick={() => handleAddViolation(vio)}
                      >
                        {vio.name}
                      </IonButton>
                    ))}
                  </div>
                </IonContent>
                <IonFooter>
                  <IonToolbar>
                    <IonButton expand="full" onClick={() => dismiss()}>
                      Add Violation
                    </IonButton>
                  </IonToolbar>
                </IonFooter>
              </IonModal>
              <IonToast
                isOpen={isOpen}
                message={alertMessage}
                onDidDismiss={() => setIsOpen(false)}
                duration={5000}
              ></IonToast>
            </IonContent>
          </>
        )}
      </IonPage>
    </>
  );
}
