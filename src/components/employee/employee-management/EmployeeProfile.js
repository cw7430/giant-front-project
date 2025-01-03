import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { EMPLOYEE_PATH } from "../../../constant/url";
import {
    requestProfile,
    requestClassList,
    requestEmploymentStatusList,
    requestDepartmentList,
    requestTeamList,
} from "../../../servers/employServer";
import { sortCode } from "../../../util/sort";
import AlertModal from "../../modals/AlertModal";
import UpdateEmployeeModal from "./UpdateEmployeeModal";

function EmployeeProfile() {
    const { employeeNumber } = useParams();
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState(null);
    const [classList, setClassList] = useState([]);
    const [employmentStatusList, setEmploymentStatusList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleNavigateListPage = () => {
        navigate(EMPLOYEE_PATH());
    };

    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
    };

    const handleShowUpdateModal = () => {
        const authorityCode = sessionStorage.getItem("authorityCode");
        if (authorityCode === "AUT01" || authorityCode === "AUT02") {
            setShowUpdateModal(true);
        } else {
            setAlertTitle("경고");
            setAlertText("접근 권한이 없습니다. 관리자에게 문의바랍니다.");
            setShowAlertModal(true);
        }
    };
    const handleCloseUpdateModal = () => setShowUpdateModal(false);

    const fetchData = useCallback(async () => {
        const profileResponse = await requestProfile({
            employeeNumber: employeeNumber,
        });
        const classResponse = await requestClassList();
        const employmentStatusResponse = await requestEmploymentStatusList();
        const departmentResponse = await requestDepartmentList();
        const teamResponse = await requestTeamList();

        if (
            profileResponse.result !== "SU" ||
            classResponse.result !== "SU" ||
            employmentStatusResponse.result !== "SU" ||
            departmentResponse.result !== "SU" ||
            teamResponse.result !== "SU"
        ) {
            setAlertTitle("서버 에러입니다.");
            setAlertText("다시 시도해 주세요.");
            setShowAlertModal(true);
            navigate(EMPLOYEE_PATH());
        } else {
            const sortedClassList = sortCode(
                classResponse.responseData,
                "classCode",
                "desc"
            );

            const sortedEmploymentStatusList = sortCode(
                employmentStatusResponse.responseData,
                "employmentStatusCode",
                "asc"
            );

            const sortedDepartmentList = sortCode(
                departmentResponse.responseData,
                "departmentNumber",
                "asc"
            );

            const sortedTeamList = sortCode(
                teamResponse.responseData,
                "teamNumber",
                "asc"
            );

            setUserProfile(profileResponse.responseData);
            setClassList(sortedClassList);
            setEmploymentStatusList(sortedEmploymentStatusList);
            setDepartmentList(sortedDepartmentList);
            setTeamList(sortedTeamList);
        }
    }, [employeeNumber, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!userProfile) {
        return <div>로딩중...</div>;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Container className="my-5">
                <h1 className="text-center mb-4">{"사원상세정보"}</h1>
                <Row className="justify-content-center mb-3">
                    <Col xs={12} md={8} lg={6}>
                        <div className="border p-3 rounded">
                            <p>
                                <strong>{"사번: "}</strong>
                                {userProfile.employeeNumber}
                            </p>
                            <p>
                                <strong>{"이름: "}</strong>
                                {userProfile.employeeName}
                            </p>
                            <p>
                                <strong>{"직급: "}</strong>
                                {userProfile.className}
                            </p>
                            <p>
                                <strong>{"부서: "}</strong>
                                {userProfile.departmentName}
                            </p>
                            <p>
                                <strong>{"팀: "}</strong>
                                {userProfile.teamName}
                            </p>
                            <p>
                                <strong>{"전화번호: "}</strong>
                                {userProfile.telNumber}
                            </p>
                            <p>
                                <strong>{"재직상태: "}</strong>
                                {userProfile.employmentStatusName}
                            </p>
                            <p>
                                <strong>{"등록일: "}</strong>
                                {userProfile.employeeRegisterDate}
                            </p>
                            <p>
                                <strong>{"수정일: "}</strong>
                                {userProfile.employeeUpdateDate}
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Button
                            variant="primary"
                            className="me-2"
                            onClick={handleShowUpdateModal}
                        >
                            {"정보 변경"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleNavigateListPage}
                        >
                            {"목록으로"}
                        </Button>
                    </Col>
                </Row>
            </Container>
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
            <UpdateEmployeeModal
                userProfile={userProfile}
                showUpdateModal={showUpdateModal}
                handleCloseUpdateModal={handleCloseUpdateModal}
                classList={classList}
                departmentList={departmentList}
                teamList={teamList}
                employmentStatusList={employmentStatusList}
                updateData={fetchData}
            />
        </div>
    );
}

export default EmployeeProfile;
