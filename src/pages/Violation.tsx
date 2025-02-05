import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
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
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import {
  idCard,
  navigate,
  videocamOff,
  videocamOffOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
type ViolationResponse = {
  id: string;
  category: string;
  section: string;
  offense_codes: string[];
  sanctions: string[];
  set: string;
  violations: Violation[];
};
type Violation = {
  code: string;
  description: string;
  reported_by?: string;
  date_committed?: string;
};
type Program = {
  id: string;
  name: string;
  department_id: string;
};

export default function Violation(props: RouteComponentProps) {
  const propsdata = props.location.state as { data: string };
  const [alertMessage, setAlertMessage] = useState("");
  type Department = {
    _id: string;
    name: string;
  };
  const [departmentRows, setDepartmentRows] = useState<Department[]>([]);
  const [studentViolation, setStudentViolation] = useState({
    id: "",
    userid: "",
    srcode: "",
    fullname: "",
    email: "",
    type: "STUDENT",
    violations: [] as Violation[],
    year_and_department: "",
    assigned_department: "",
    course: "",
    term: "",
  });
  const [isExistingStudent, setIsExistingStudent] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    id: "",
    srcode: "",
    userid: "",
    email: "",
    fullname: "",
    course: "",
    term: "",
    year: "",
    department: "",
    assigned_department: "",
  });
  const [violations, setViolations] = useState<ViolationResponse[]>([]);
  const coursesList = [
    "BS Information Technology",
    "BS Computer Science",
    "Doctor of Business Administration (DBA)",
    "Master of Public Administration (MPA) (Thesis/Non-Thesis program)",
    "Master of Business Administration (MBA) (Thesis/Non-Thesis program)",
    "BS Accountancy",
    "BS Accounting Management",
    "BS Applied Economics",
    "BS Business Administration Major in: Business Economics",
    "BS Business Administration Major in: Financial Management",
    "BS Business Administration Major in: Human Resource Development Management",
    "BS Business Administration Major in: Marketing Management",
    "BS Business Administration Major in: Operations Management",
    "Associate in Accounting",
    "Associate in Management",
    "BS Hotel and Restaurant Management",
    "BS Tourism Management",
    "Associate in Hotel and Restaurant Management",
    "Associate in Tourism Management",
    "BA Public Administration",
    "BS Customs Administration",
    "BS Entrepreneurship",
    "Doctor of Technology",
    "Master of Technology",
    "Bachelor of Industrial Technology (BIT 4 – years)",
    "BS Nursing",
    "BS Nutrition & Dietetics",
  ];
  const yearList = ["1st year", "2nd year", "3rd year", "4th year", "5th year"];
  const [programList, setProgramList] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const schoolTermList = [
    "First Semester",
    "Second Semester",
    "Third Semester",
    "Fourth Semester",
    "Fifth Semester",
    "Summer Term",
  ];
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
  const transformedViolations = studentViolation.violations.map((violation) => {
    return {
      code: violation.code,
      date_committed: violation.date_committed
        ? violation.date_committed
        : new Date().toISOString(),
      reported_by: violation.reported_by || undefined,
    };
  });
  const handleSave = async () => {
    console.log("Student To Save:", studentViolation);
    console.log("Info To Save:", studentInfo);
    console.log("Violation To Save:", studentViolation.violations);

    if (
      studentViolation.srcode == "" ||
      studentViolation.userid == "" ||
      studentViolation.violations.length == 0 ||
      studentInfo.assigned_department == "" ||
      studentInfo.assigned_department == undefined ||
      studentInfo.year == undefined ||
      studentInfo.year == "" ||
      studentInfo.course == "" ||
      studentInfo.course == undefined ||
      studentInfo.term == "" ||
      studentInfo.term == undefined
    ) {
      console.log("All fields are required");
      setIsOpen(true);
      setAlertMessage("All fields are required");
      return;
    }
    const yearDepartment = `${studentInfo.year} - ${studentInfo.assigned_department}`;
    const courseID = filteredPrograms.find(
      (program) => program.name === studentInfo.course
    );
    if (courseID === undefined || courseID === null) {
      setIsOpen(true);
      setAlertMessage("Course not found. Please try again!");
      return;
    }
    axios
      .post(
        `student`,
        {
          srcode: studentViolation.srcode,
          userid: studentViolation.userid,
          email: studentViolation.email,
          fullname: studentViolation.fullname,
          course: courseID?.id,
          term: studentInfo.term,
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
    console.log("HANDLE_UPDATE_FUNCTION: ", studentViolation);
    console.log("HANDLE_UPDATE_FUNCTION_student_info: ", studentInfo);
    if (
      studentViolation.srcode == "" ||
      studentViolation.userid == "" ||
      studentViolation.violations.length == 0 ||
      studentInfo.assigned_department == "" ||
      studentInfo.assigned_department == undefined ||
      studentInfo.year == undefined ||
      studentInfo.year == "" ||
      studentInfo.course == "" ||
      studentInfo.course == undefined ||
      studentInfo.term == "" ||
      studentInfo.term == undefined ||
      studentViolation.email == "" ||
      studentViolation.email == undefined ||
      studentViolation.id == "" ||
      studentViolation.id == undefined
    ) {
      console.log("All fields are required");
      setIsLoading(false);
      setIsOpen(true);
      setAlertMessage("All fields are required");
      return;
    }
    const yearDepartment = `${studentInfo.year} - ${studentInfo.assigned_department}`;
    console.warn("HANDLE_UPDATE_FUNCTION_student_info: ", yearDepartment);

    const updatedStudentViolation = {
      ...studentViolation,
      year_and_department: yearDepartment,
    };

    setStudentViolation(updatedStudentViolation);
    const courseID = filteredPrograms.find(
      (program) => program.name === studentInfo.course
    );
    if (courseID === undefined || courseID === null) {
      setIsOpen(true);
      setIsLoading(false);
      setAlertMessage("Course not found. Please try again!");
      return;
    }
    console.log("HANDLE_UPDATE_FUNCTION: ", studentViolation);
    console.log(studentViolation);
    axios
      .put(
        `student`,
        {
          id: studentViolation.id,
          srcode: studentViolation.srcode,
          userid: studentViolation.userid,
          email: studentViolation.email,
          fullname: studentViolation.fullname,
          year_and_department: yearDepartment,
          term: studentInfo.term,
          course: courseID?.id,
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
      .get(`student`, {
        params: {
          id: undefined,
          userid: userid,
          skip: 0,
          limit: 100,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const apiData = response?.data;
        if (
          apiData?.status === "success" &&
          Array.isArray(apiData?.data) &&
          apiData.data.length === 0
        ) {
          setIsExistingStudent(false);
          console.log("No user found");
        } else if (
          apiData?.status === "success" &&
          Array.isArray(apiData?.data) &&
          apiData.data.length > 0
        ) {
          setIsExistingStudent(true);
          const studentData = response.data.data[0]; // Extract the first student object

          const [year, department] = studentData.year_and_department
            ?.split(" - ")
            ?.map((item: string) => item.trim()) || ["Unknown", "Unknown"];

          const completedViolationList: Violation[] = studentData.violations
            .map((violation: Violation) => {
              console.log("Iterating Violation: ", violation);
              // Find the group that contains the violation
              const groupWithViolation = violations.find((group) =>
                group.violations.some((v) => v.code === violation.code)
              );
              console.log("Group with Violation: ", groupWithViolation);
              // Find the actual violation object within the group
              const violationDetails = groupWithViolation?.violations.find(
                (v) => v.code === violation.code
              );

              return violationDetails
                ? { ...violation, description: violationDetails.description }
                : null;
            })
            .filter(
              (violation: Violation): violation is Violation =>
                violation !== null
            );
          console.log("Completed Violation List: ", studentData.violations);
          setStudentViolation({
            ...studentViolation,
            id: studentData.id,
            userid: studentData.userid,
            srcode: studentData.srcode,
            fullname: studentData.fullname,
            type: studentData.type,
            violations: studentData.violations,
            email: studentData.email,
            year_and_department: studentData.year_and_department,
            course: studentData.course,
            term: studentData.term,
          });

          setStudentInfo({
            ...studentInfo,
            term: studentData.term,
            course: studentData.course,
            department,
            year,
          });

          console.info("FETCH_USER: ", {
            term: studentData.term,
            course: studentData.course,
            department,
            year,
          });
        } else {
          console.error("Unexpected response status or structure.");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };
  const fetchData = async () => {
    setIsLoading(true);
    axios
      .get("/violation", {
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
          console.log("Violation Data: ", response.data.data);
          const allViolations: Violation[] = response.data.data.flatMap(
            (category: any) =>
              category.violations.map((v: any) => ({
                code: v.code,
                description: v.description,
              }))
          );
          console.log("All Violations: ", allViolations);
          setViolations(response.data.data);
        } else {
          console.log("Failed to fetch data");
          setRefresh((prev) => !prev);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setRefresh((prev) => !prev);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    decodeQRCode();
    fetchData();
    fetchDepartments();
    fetchPrograms();
  }, [propsdata, refresh]);
  // useEffect(() => {
  //   fetchPrograms();
  // }, []);

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
  const fetchPrograms = async () => {
    axios
      .get("/progams", {
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
          // console.log("Data fetched successfully");
          setProgramList(response.data.data);
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
    console.log("Selected Violation: ", selectedvio);
    if (selectedvio === null) return;

    const selectedCode = selectedvio.code;
    const viola = violations
      .map((group) => group.violations.find((v) => v.code === selectedCode))
      .filter(Boolean)[0];

    console.log("Selected Violation fetched: ", viola);
    if (viola) {
      setSelectedViolation(viola);

      if (!studentViolation.violations.some((v) => v.code === viola.code)) {
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
  const handleDepartmentChange = (event: any) => {
    const selectedDepartmentName = (event.target as HTMLInputElement).value;
    const selectedDepartment = departmentRows.find(
      (department) => department.name === selectedDepartmentName
    );
    console.log("Selected Department: ", selectedDepartment);
    if (selectedDepartment) {
      setStudentInfo({
        ...studentInfo,
        course: "",
        assigned_department: selectedDepartment.name,
      });

      const programs = programList.filter(
        (program) => program.department_id === selectedDepartment._id
      );
      setFilteredPrograms(programs);
    }
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
                <IonTitle>Create Student Violation</IonTitle>
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
            <IonContent fullscreen className=" ParentContainer">
              <div className="GridLayout">
                <div className="container-center">
                  {propsdata.data.length > 0 && (
                    <>
                      <div className="ion-violation-input">
                        {/* <label htmlFor="">{studentViolation._id}</label> */}
                        <IonInput
                          labelPlacement="stacked"
                          label="Student ID"
                          value={studentViolation.userid}
                        ></IonInput>
                        <IonInput
                          labelPlacement="stacked"
                          label="Full Name"
                          value={studentViolation.fullname}
                        ></IonInput>
                        <IonInput
                          readonly
                          labelPlacement="stacked"
                          label="User Type"
                          value={studentViolation.type}
                        ></IonInput>
                        {/* <label>
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
                          </label> */}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div className="container">
                    <IonLabel>Choose Violation</IonLabel>
                    <IonButton id="open-modal" expand="block">
                      SECTION 10
                    </IonButton>
                  </div>
                  <IonItem className="ion-item">
                    <IonInput
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
                      value={studentInfo.assigned_department}
                      onIonChange={handleDepartmentChange}
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
                    <IonSelect
                      label="Course"
                      labelPlacement="stacked"
                      value={studentInfo.course}
                      onIonChange={(event: any) =>
                        setStudentInfo({
                          ...studentInfo,
                          course: (event.target as HTMLInputElement).value,
                        })
                      }
                    >
                      {filteredPrograms.map((program) => (
                        <IonSelectOption
                          key={program.name}
                          value={program.name}
                        >
                          {program.name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem className="ion-item">
                    <IonSelect
                      label="Term"
                      labelPlacement="stacked"
                      value={studentInfo.term}
                      onIonChange={(event: any) =>
                        setStudentInfo({
                          ...studentInfo,
                          term: (event.target as HTMLInputElement).value,
                        })
                      }
                    >
                      {schoolTermList.map((term) => (
                        <IonSelectOption key={term} value={term}>
                          {term}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem className="ion-item">
                    <IonSelect
                      label="Year Level"
                      labelPlacement="stacked"
                      value={studentInfo.year}
                      onIonChange={(event: any) =>
                        setStudentInfo({
                          ...studentInfo,
                          year: (event.target as HTMLInputElement).value,
                        })
                      }
                    >
                      {yearList.map((year) => (
                        <IonSelectOption key={year} value={year}>
                          {year}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </div>
              </div>
              <IonButton
                expand="full"
                onClick={isExistingStudent ? handleUpdate : handleSave}
              >
                {isExistingStudent
                  ? "Update Student Violation"
                  : "Create Student Violation"}
              </IonButton>
              {isloading ? (
                "Loading..."
              ) : (
                <IonModal
                  ref={modal}
                  trigger="open-modal"
                  presentingElement={presentingElement!}
                >
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle>Choose Violation to Attach</IonTitle>
                      <IonButtons slot="end">
                        <IonButton color="primary" onClick={() => dismiss()}>
                          Close
                        </IonButton>
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
                        Violation attached
                      </label>
                      {studentViolation.violations.map(
                        (data: any, index: any) => (
                          <IonItem key={index}>
                            <IonLabel
                              onClick={() => {
                                handleDeleteViolation(index);
                              }}
                            >
                              {data.code}
                            </IonLabel>
                          </IonItem>
                        )
                      )}
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <label style={{ paddingTop: "20px" }}>
                        Violation Available
                      </label>
                      {/* {violations.map((vio, index) => (
                        <IonButton
                          style={
                            studentViolation.violations.some(
                              (v) => v.code === vio.code
                            )
                              ? { display: "none" }
                              : { display: "block" }
                          }
                          onClick={() => handleAddViolation(vio)}
                        >
                          {vio.code}
                        </IonButton>
                      ))} */}
                      {violations.flatMap((group, groupIdx) => [
                        <IonItem key={`category-${groupIdx}`}>
                          <IonText color="primary">
                            <h6>{group.category.toUpperCase()}</h6>
                          </IonText>
                        </IonItem>,
                        ...group.violations.map((violation, violationIdx) => {
                          const isHidden = studentViolation?.violations.some(
                            (v) => v.code === violation.code
                          );

                          return (
                            <IonItem
                              key={`violation-${groupIdx}-${violationIdx}`}
                              style={{
                                textTransform: "capitalize",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                marginBottom: "8px",
                                display: isHidden ? "none" : "block",
                              }}
                              onClick={() => handleAddViolation(violation)}
                            >
                              {group.set && (
                                <IonButton
                                  size="small"
                                  style={{
                                    width: "fit-content",
                                    marginRight: "8px",
                                  }}
                                >
                                  {group.set.toUpperCase()}
                                </IonButton>
                              )}
                              {violation.code} - {violation.description}
                            </IonItem>
                          );
                        }),
                      ])}
                      {/* {
                        violations.flatMap((category)=>
                        category. )
                      } */}
                    </div>
                  </IonContent>
                  <IonFooter>
                    {/* <IonToolbar> */}
                    <IonButton expand="full" onClick={() => dismiss()}>
                      Add Violation
                    </IonButton>
                    {/* </IonToolbar> */}
                  </IonFooter>
                </IonModal>
              )}

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
