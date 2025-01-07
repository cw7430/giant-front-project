import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../../constant/url";
import { requestProfile } from "../../../servers/employServer";
import Loader from "../../../util/Loader";
import ChangeUserIdModal from "./ChangeUserIdModal";
import ChangePasswordModal from "./ChangePasswordModal";
import AlertModal from "../../modals/AlertModal";

function MyProfile() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [showChangeUserIdModal, setShowChangeUserIdModal] = useState(false);
    const [changeUserIdpasswordType, setChangeUserIdPasswordType] =
        useState("password");
    const [showChangePasswordModal, setShowChangePasswordModal] =
        useState(false);
    const [originalPasswordType, setOriginalPasswordType] =
        useState("password");
    const [changePasswordType, setChangePasswordType] = useState("password");
    const [checkPasswordType, setCheckPasswordType] = useState("password");

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            const employeeNumber = sessionStorage.getItem("employeeNumber");
            const request = { employeeNumber: employeeNumber };
            if (!employeeNumber) {
                setAlertTitle("로그인이 필요한 페이지입니다.");
                setAlertText("");
                setShowAlertModal(true);
                navigate(MAIN_PATH());
                return;
            }

            const response = await requestProfile(request);
            if (response.result === "SU") {
                setUserProfile(response.responseData);
            } else {
                setAlertTitle("서버 에러입니다.");
                setAlertText("다시 시도해 주세요.");
                setShowAlertModal(true);
                navigate(MAIN_PATH());
            }
        };
        getProfile();
    }, [navigate]);

    const handleShowChangeUserIdModal = () => setShowChangeUserIdModal(true);
    const handleCloseChangeUserIdModal = () => {
        setShowChangeUserIdModal(false);
        setChangeUserIdPasswordType("password");
    };

    const handleShowChangePasswordModal = () =>
        setShowChangePasswordModal(true);
    const handleCloseChangePasswordModal = () => {
        setShowChangePasswordModal(false);
        setOriginalPasswordType("password");
        setChangePasswordType("password");
        setCheckPasswordType("password");
    };

    if (!userProfile) {
        return <Loader />;
    }

    const userId = userProfile.userId;
    const employeeNumber = userProfile.employeeNumber;

    return (
        <div className="d-flex flex-column min-vh-100">
            <ChangeUserIdModal
                originalUserId={userId}
                employeeNumber={employeeNumber}
                showChangeUserIdModal={showChangeUserIdModal}
                handleCloseChangeUserIdModal={handleCloseChangeUserIdModal}
                changeUserIdpasswordType={changeUserIdpasswordType}
                updateUserProfile={setUserProfile}
            />
            <ChangePasswordModal
                userId={userId}
                employeeNumber={employeeNumber}
                showChangePasswordModal={showChangePasswordModal}
                handleCloseChangePasswordModal={handleCloseChangePasswordModal}
                originalPasswordType={originalPasswordType}
                changePasswordType={changePasswordType}
                checkPasswordType={checkPasswordType}
                updateUserProfile={setUserProfile}
            />
            <Container className="my-5">
                <h1 className="text-center mb-4">마이페이지</h1>
                <Row className="justify-content-center mb-3">
                    <Col xs={12} md={8} lg={6}>
                        <div className="border p-3 rounded">
                            <p>
                                <strong>{"사번: "}</strong>
                                {userProfile.employeeNumber}
                            </p>
                            <p>
                                <strong>{"아이디: "}</strong>
                                {userProfile.userId}
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
                            onClick={handleShowChangeUserIdModal}
                        >
                            {"아이디 변경"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleShowChangePasswordModal}
                        >
                            {"비밀번호 변경"}
                        </Button>
                    </Col>
                </Row>
            </Container>
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={() => setShowAlertModal(false)}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </div>
    );
}

export default MyProfile;
