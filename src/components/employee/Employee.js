import { useCallback, useEffect, useState } from "react";
import { Nav, Container, Row, Col, Button } from "react-bootstrap";
import Loader from "../../util/Loader";
import EmployeeListSearchBox from "./employee-management/EmployeeListSearchBox";
import EmployeeListTable from "./employee-management/EmployeeListTable";
import AlertModal from "../modals/AlertModal";
import EmployeeSelectModal from "./EmployeeSelectModal";
import RegisterEmployeeModal from "./employee-management/RegisterEmployeeModal";
import AttendanceBulkModal from "./attendance-management/AttendanceBulkModal";
import {
    requestProfileList,
    requestClassList,
    requestEmploymentStatusList,
    requestDepartmentList,
    requestTeamList,
    requestAttendanceList,
    requestAttendanceStatusList,
} from "../../servers/employServer";
import { sortCode } from "../../util/sort";
import AttandanceListTable from "./attendance-management/AttendanceListTable";
import SalaryListTable from "./salary-management/SalaryListTable";
import AttendanceListSearchBox from "./attendance-management/AttendanceListSearchBox";

function Employee() {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;

    const [yearMonth, setYearMonth] = useState(currentYearMonth);
    const [loading, setLoading] = useState(true);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");
    const [view, setView] = useState("List");
    const [employeeListData, setEmployeeListData] = useState([]);
    const [filteredEmployeeList, setFilteredEmployeeList] =
        useState(employeeListData);
    const [existingEmployeeList, setExistingEmployeeList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [filteredAttendanceList, setFilteredAttendanceList] =
        useState(attendanceList);
    const [employmentStatusList, setEmploymentStatusList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [attendanceStatusList, setAttendanceStatusList] = useState([]);

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showEmployeeSelectModal, setShowEmployeeSelectModal] =
        useState(false);
    const [showAttendanceBulkModal, setShowAttendanceBulkModal] = useState(false);

    const [employeeSort, setEmployeeSort] = useState("employeeNumberAsc");
    const [attendanceSort, setAttendanceSort] = useState("idAsc");

    const handleCloseAlertModal = () => setShowAlertModal(false);

    const handleSelectView = (selectedView) => {
        setFilteredEmployeeList(employeeListData);
        setFilteredAttendanceList(attendanceList);
        setEmployeeSort("employeeNumberAsc");
        setAttendanceSort("idAsc");
        setView(selectedView);
    };

    const handleShowRegisterModal = () => setShowRegisterModal(true);

    const handleCloseRegisterModal = () => setShowRegisterModal(false);

    const handleShowEmployeeSelectModal = () =>
        setShowEmployeeSelectModal(true);

    const handleCloseEmployeeSelectModal = () =>
        setShowEmployeeSelectModal(false);

    const handleShowAttendanceBulkModal = () => setShowAttendanceBulkModal(true);

    const handleCloseAttendanceBulkModal = () => {
        setFilteredEmployeeList(existingEmployeeList);
        setShowAttendanceBulkModal(false);
    };

    const toggleRegisterButton = () => {
        const authorityCode = sessionStorage.getItem("authorityCode");
        if (authorityCode === "AUT01" || authorityCode === "AUT02") {
            if (view === "List") {
                handleShowRegisterModal();
            } else {
                handleShowEmployeeSelectModal();
            }
        } else {
            setAlertTitle("경고");
            setAlertText("접근 권한이 없습니다. 관리자에게 문의바랍니다.");
            setShowAlertModal(true);
        }
    };

    const fetchData = async (requestFunc, successCallback) => {
        setLoading(true); // 데이터 요청 시작 시 로딩 상태 설정
        try {
            const response = await requestFunc();

            if (response.result !== "SU") {
                setAlertTitle("경고");
                setAlertText("데이터 요청에 실패했습니다.");
                setShowAlertModal(true);
            } else {
                successCallback(response.responseData);
            }
        } catch (error) {
            console.error("데이터 요청 중 오류 발생:", error);
            setAlertTitle("오류");
            setAlertText("데이터 요청에 실패했습니다.");
            setShowAlertModal(true);
        } finally {
            setLoading(false); // 데이터 요청 완료 후 로딩 상태 해제
        }
    };

    const fetchEmployeeData = useCallback(async () => {
        await fetchData(
            async () => {
                const profileListResponse = await requestProfileList();
                const departmentResponse = await requestDepartmentList();
                const teamResponse = await requestTeamList();

                return {
                    result:
                        profileListResponse.result === "SU" &&
                        departmentResponse.result === "SU" &&
                        teamResponse.result === "SU"
                            ? "SU"
                            : "FA",
                    responseData: {
                        profileList: profileListResponse.responseData,
                        departmentList: sortCode(
                            departmentResponse.responseData,
                            "departmentNumber",
                            "asc"
                        ),
                        teamList: sortCode(
                            teamResponse.responseData,
                            "teamNumber",
                            "asc"
                        ),
                    },
                };
            },
            (data) => {
                setEmployeeListData(data.profileList);
                // existingEmployeeList에 employmentStatusCode가 "EST01"인 항목 추가
                const filteredExistingEmployees = data.profileList.filter(
                    (employee) => employee.employmentStatusCode === "EST01"
                );
                setExistingEmployeeList(filteredExistingEmployees);
                setDepartmentList(data.departmentList);
                setTeamList(data.teamList);
            }
        );
    }, []);

    const fetchClassData = useCallback(async () => {
        await fetchData(
            async () => {
                const classResponse = await requestClassList();
                return {
                    result: classResponse.result === "SU" ? "SU" : "FA",
                    responseData: {
                        classList: sortCode(
                            classResponse.responseData,
                            "classCode",
                            "asc"
                        ),
                    },
                };
            },
            (data) => {
                setClassList(data.classList);
            }
        );
    }, []);

    const fetchEmploymentStatusData = useCallback(async () => {
        await fetchData(
            async () => {
                const employmentStatusResponse =
                    await requestEmploymentStatusList();
                return {
                    result:
                        employmentStatusResponse.result === "SU" ? "SU" : "FA",
                    responseData: {
                        employmentStatusList: sortCode(
                            employmentStatusResponse.responseData,
                            "employmentStatusCode",
                            "asc"
                        ),
                    },
                };
            },
            (data) => {
                setEmploymentStatusList(data.employmentStatusList);
            }
        );
    }, []);

    const fetchAttendanceData = useCallback(async (date) => {
        await fetchData(async () => {
            const result = await requestAttendanceList({ commuteDate: date });
            if (result?.responseData) {
                // 각 객체에 id 추가
                result.responseData = result.responseData.map(
                    (item, index) => ({
                        ...item,
                        id: index + 1, // 1부터 시작하는 id 부여
                    })
                );
            }
            return result;
        }, setAttendanceList);
    }, []);

    const fetchAttendanceStatusData = useCallback(async () => {
        await fetchData(
            async () => {
                const attendanceStatusResponse =
                    await requestAttendanceStatusList();
                return {
                    result:
                        attendanceStatusResponse.result === "SU" ? "SU" : "FA",
                    responseData: {
                        attendanceStatusList: sortCode(
                            attendanceStatusResponse.responseData,
                            "attendanceStatusCode",
                            "asc"
                        ),
                    },
                };
            },
            (data) => {
                setAttendanceStatusList(data.attendanceStatusList);
            }
        );
    }, []);

    useEffect(() => {
        fetchEmployeeData();
    }, [fetchEmployeeData]);

    useEffect(() => {
        fetchClassData();
    }, [fetchClassData]);

    useEffect(() => {
        fetchEmploymentStatusData();
    }, [fetchEmploymentStatusData]);

    useEffect(() => {
        fetchAttendanceData(yearMonth);
    }, [yearMonth, fetchAttendanceData]);

    useEffect(() => {
        fetchAttendanceStatusData();
    }, [fetchAttendanceStatusData]);

    useEffect(() => {
        setFilteredEmployeeList(employeeListData);
    }, [employeeListData]);

    useEffect(() => {
        setFilteredAttendanceList(attendanceList);
    }, [attendanceList]);

    if (loading) {
        return <Loader />; // 로딩 중일 때 표시
    }

    return (
        <div className="d-flex flex-column min-vh-100 p-3">
            <Container className="my-5">
                <h1 className="text-center">{"인사관리"}</h1>
            </Container>
            {view === "List" && (
                <EmployeeListSearchBox
                    employeeListData={employeeListData}
                    classList={classList}
                    employmentStatusList={employmentStatusList}
                    setFilteredEmployeeList={setFilteredEmployeeList}
                    setEmployeeSort={setEmployeeSort}
                />
            )}
            {view === "Attendance" && (
                <AttendanceListSearchBox
                    yearMonth={yearMonth}
                    setYearMonth={setYearMonth}
                    attendanceList={attendanceList}
                    setFilteredAttendanceList={setFilteredAttendanceList}
                    attendanceStatusList={attendanceStatusList}
                    setAttendanceSort={setAttendanceSort}
                />
            )}
            <Container>
                <Row className="justify-content-between">
                    <Col xs={9} className="d-flex">
                        <Nav
                            className="w-100"
                            fill
                            variant="tabs"
                            activeKey={view}
                            onSelect={handleSelectView}
                            data-bs-theme="dark"
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="List">
                                    {"직원관리"}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Attendance">
                                    {"근태관리"}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Salary">
                                    {"급여관리"}
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col xs={2} className="text-end">
                        <Button
                            variant="primary"
                            type="button"
                            onClick={toggleRegisterButton}
                        >
                            {"추가"}
                        </Button>
                    </Col>
                </Row>
            </Container>
            {view === "List" && (
                <EmployeeListTable
                    filteredEmployeeList={filteredEmployeeList}
                    setFilteredEmployeeList={setFilteredEmployeeList}
                    employeeSort={employeeSort}
                    setEmployeeSort={setEmployeeSort}
                />
            )}
            {view === "Attendance" && (
                <AttandanceListTable
                    filteredAttendanceList={filteredAttendanceList}
                    setFilteredAttendanceList={setFilteredAttendanceList}
                    attendanceSort={attendanceSort}
                    setAttendanceSort={setAttendanceSort}
                />
            )}
            {view === "Salary" && <SalaryListTable />}

            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
            <EmployeeSelectModal
                view={view}
                showEmployeeSelectModal={showEmployeeSelectModal}
                handleCloseEmployeeSelectModal={handleCloseEmployeeSelectModal}
                handleShowAttendanceBulkModal={handleShowAttendanceBulkModal}
            />
            <RegisterEmployeeModal
                showRegisterModal={showRegisterModal}
                handleCloseRegisterModal={handleCloseRegisterModal}
                classList={classList}
                departmentList={departmentList}
                teamList={teamList}
                updateData={fetchEmployeeData}
            />
            <AttendanceBulkModal
                showAttendanceBulkModal={showAttendanceBulkModal}
                handleCloseAttendanceBulkModal={handleCloseAttendanceBulkModal}
                attendanceStatusList={attendanceStatusList}
                existingEmployeeList={existingEmployeeList}
                classList={classList}
                updateData={fetchAttendanceData}
                currentYearMonth={currentYearMonth}
            />
        </div>
    );
}

export default Employee;
