import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Container, Row, Col, Button } from "react-bootstrap";
import EmployeeListSearchBox from "./employee-management/EmployeeListSearchBox";
import EmployeeListTable from "./employee-management/EmployeeListTable";
import AlertModal from "../modals/AlertModal";
import RegisterEmployeeModal from "./employee-management/RegisterEmployeeModal";
import {
    requestProfileList,
    requestClassList,
    requestEmploymentStatusList,
    requestDepartmentList,
    requestTeamList,
    requestAttendanceList,
} from "../../servers/employServer";
import { sortCode } from "../../util/sort";
import AttandanceListTable from "./attendance-management/AttendanceListTable";
import SalaryListTable from "./salary-management/SalaryListTable";

function Employee() {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;

    const navigate = useNavigate();
    const [yearMonth, setYearMonth] = useState(currentYearMonth);
    const [loading, setLoading] = useState(true);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");
    const [view, setView] = useState("List");
    const [employeeListData, setEmployeeListData] = useState([]);
    const [filteredEmployeeList, setFilteredEmployeeList] =
        useState(employeeListData);
    const [classList, setClassList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [filteredAttendanceList, setFilteredAttendanceList] =
        useState(attendanceList);
    const [employmentStatusList, setEmploymentStatusList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const [employeeSort, setEmployeeSort] = useState("employeeNumberAsc");

    const handleCloseAlertModal = () => setShowAlertModal(false);

    const handleSelectView = (selectedView) => {
        setView(selectedView);
    };

    const handleShowRegisterModal = () => {
        const authorityCode = sessionStorage.getItem("authorityCode");
        if (authorityCode === "AUT01" || authorityCode === "AUT02") {
            setShowRegisterModal(true);
        } else {
            setAlertTitle("경고");
            setAlertText("접근 권한이 없습니다. 관리자에게 문의바랍니다.");
            setShowAlertModal(true);
        }
    };
    const handleCloseRegisterModal = () => setShowRegisterModal(false);

    const toggleRegisterButton = () => {
        if (view === "List") {
            handleShowRegisterModal();
        }
    };

    const fetchData = async () => {
        setLoading(true); // 데이터 요청 시작 시 로딩 상태 설정
        try {
            const profileListResponse = await requestProfileList();
            const classResponse = await requestClassList();
            const employmentStatusResponse =
                await requestEmploymentStatusList();
            const departmentResponse = await requestDepartmentList();
            const teamResponse = await requestTeamList();
            const attendanceListResponse = await requestAttendanceList({
                commuteDate: yearMonth,
            });

            // 결과 검사
            if (
                profileListResponse.result !== "SU" ||
                classResponse.result !== "SU" ||
                employmentStatusResponse.result !== "SU" ||
                departmentResponse.result !== "SU" ||
                teamResponse.result !== "SU" ||
                attendanceListResponse.result !== "SU"
            ) {
                setAlertTitle("경고");
                setAlertText("일부 데이터에 오류가 있습니다.");
                setShowAlertModal(true);
            } else {
                // classCode로 오름차순 정렬
                const sortedClassList = sortCode(
                    classResponse.responseData,
                    "classCode",
                    "asc"
                );

                // employmentStatusCode로 오름차순 정렬
                const sortedEmploymentStatusList = sortCode(
                    employmentStatusResponse.responseData,
                    "employmentStatusCode",
                    "asc"
                );

                // departmentNumber로 오름차순 정렬
                const sortedDepartmentList = sortCode(
                    departmentResponse.responseData,
                    "departmentNumber",
                    "asc"
                );

                // teamNumber로 오름차순 정렬
                const sortedTeamList = sortCode(
                    teamResponse.responseData,
                    "teamNumber",
                    "asc"
                );

                setEmployeeListData(profileListResponse.responseData);
                setClassList(sortedClassList);
                setEmploymentStatusList(sortedEmploymentStatusList);
                setDepartmentList(sortedDepartmentList);
                setTeamList(sortedTeamList);
                setAttendanceList(attendanceListResponse.responseData);
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

    useEffect(() => {
        fetchData();
    }, [navigate]);

    useEffect(() => {
        setFilteredEmployeeList(employeeListData);
    }, [employeeListData]);

    useEffect(() => {
        setFilteredAttendanceList(attendanceList);
    }, [attendanceList]);

    if (loading) {
        return <div>로딩중...</div>; // 로딩 중일 때 표시
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
                    setFilteredEmployeeList={setFilteredEmployeeList}
                />
            )}
            {view === "Salary" && <SalaryListTable />}

            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
            <RegisterEmployeeModal
                showRegisterModal={showRegisterModal}
                handleCloseRegisterModal={handleCloseRegisterModal}
                classList={classList}
                departmentList={departmentList}
                teamList={teamList}
                updateData={fetchData}
            />
        </div>
    );
}

export default Employee;
