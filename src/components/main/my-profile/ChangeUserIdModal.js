import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../../assets/svg/Svgs";
import {
    requestUserIdDuplicateCheck,
    requestLogIn,
    requestChangeUserId,
    requestProfile,
} from "../../../servers/employServer";
import AlertModal from "../../modals/AlertModal";
import ConfirmModal from "../../modals/ConfirmModal";

function ChangeUserIdModal(props) {
    const {
        originalUserId,
        employeeNumber,
        showChangeUserIdModal,
        handleCloseChangeUserIdModal,
        changeUserIdpasswordType,
        handleChangeUserIdPasswordType,
        updateUserProfile,
    } = props;

    const userIdRef = useRef(null);
    const passwordRef = useRef(null);

    const [userIdError, setUserIdError] = useState(false);
    const [checkUserID, setCheckUserID] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [userIdErrorMessage, setUserIdErrorMessage] = useState("");
    const [userIdCheckMessage, setUserIdCheckMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCloseAlertModal = () => setShowAlertModal(false);
    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    useEffect(() => {
        if (showChangeUserIdModal) {
            if (userIdRef.current) {
                userIdRef.current.focus();
            }
        } else {
            setUserIdError(false);
            setPasswordError(false);
            setCheckUserID(false);
            setUserIdErrorMessage("");
            setPasswordErrorMessage("");
            setUserIdCheckMessage("");
        }
    }, [showChangeUserIdModal]);

    const handleUserIdKeyDown = (event) => {
        if (event.key !== "Enter") return;
        if (!passwordRef.current) return;
        passwordRef.current.focus();
    };

    const handlePasswordKeyDown = (event) => {
        if (event.key !== "Enter") return;
        handleCheckPassword();
    };

    const handleUserIdDuplicateCheck = async () => {
        const userId = userIdRef.current?.value || "";
        const userIdPattern = /^[a-zA-Z][a-zA-Z0-9]{5,24}$/;
        const request = { userId: userId };
        if (!userIdPattern.test(userId)) {
            setUserIdError(true);
            setUserIdErrorMessage(
                "아이디는 6자리 이상 25자리 이하의 영문 또는 영문+숫자 조합이어야 합니다."
            );
            setCheckUserID(false);
            return;
        } else {
            const response = await requestUserIdDuplicateCheck(request);
            if (response.result === "SU") {
                setUserIdError(false);
                setUserIdErrorMessage("");
                setCheckUserID(true);
                setUserIdCheckMessage("사용 가능한 아이디입니다.");
                if (userIdRef.current) userIdRef.current.readOnly = true;
            } else if (response.result === "NU") {
                setCheckUserID(false);
                setUserIdError(true);
                setUserIdErrorMessage("아이디를 입력해주세요.");
            } else if (response.result === "FA") {
                setCheckUserID(false);
                setUserIdError(true);
                setUserIdErrorMessage("중복된 아이디입니다.");
            } else if (response.result === "SE") {
                setCheckUserID(false);
                setUserIdError(true);
                setUserIdErrorMessage(
                    "서버 오류가 발생했습니다. 나중에 다시 시도해주세요."
                );
            }
        }
    };

    const handleCheckPassword = async () => {
        const password = passwordRef.current?.value || "";

        setUserIdError(false);
        setPasswordError(false);

        if (!checkUserID) {
            setUserIdError(true);
            setUserIdErrorMessage("아이디 중복 확인을 해주세요.");
            if (userIdRef.current) userIdRef.current.focus();
            return;
        }

        if (!password) {
            setPasswordError(true);
            setPasswordErrorMessage("비밀번호를 입력해주세요.");
            if (passwordRef.current) passwordRef.current.focus();
            return;
        }

        const request = { userId: originalUserId, password: password };
        const response = await requestLogIn(request);
        if (response.result === "SU") {
            setPasswordError(false);
            setPasswordErrorMessage("");
            setShowConfirmModal(true); // 확인 모달 표시
        } else if (response.result === "FA") {
            setPasswordError(true);
            setPasswordErrorMessage("비밀번호가 올바르지 않습니다.");
            if (passwordRef.current) passwordRef.current.focus();
        } else if (response.result === "SE") {
            setPasswordError(true);
            setPasswordErrorMessage(
                "서버 오류입니다. 잠시 후 다시 시도해주세요."
            );
        }
    };

    const handleConfirmChangeUserId = async () => {
        handleCloseConfirmModal(); // 확인 모달 닫기
        const userId = userIdRef.current?.value || "";
        const request = { userId: userId, employeeNumber: employeeNumber };
        const response = await requestChangeUserId(request);
        if (response.result === "SU") {
            const updatedProfileResponse = await requestProfile({
                employeeNumber: employeeNumber,
            });
            updateUserProfile(updatedProfileResponse);
            handleCloseChangeUserIdModal();
            setAlertTitle("변경완료");
            setAlertText("아이디 변경이 완료되었습니다.");
            setShowAlertModal(true);
        } else {
            setPasswordError(true);
            setPasswordErrorMessage(
                "서버 오류입니다. 잠시 후 다시 시도해주세요."
            );
        }
    };

    return (
        <>
            <Modal
                backdrop="static"
                show={showChangeUserIdModal}
                onHide={handleCloseChangeUserIdModal}
            >
                <Modal.Header>
                    <Modal.Title>{"아이디 변경"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="originalUserId">
                            {"기존아이디"}
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Text id="originalUserId">
                                {originalUserId}
                            </Form.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="userId">{"변경아이디"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                id="userId"
                                ref={userIdRef}
                                onKeyDown={handleUserIdKeyDown}
                            />
                            <Button
                                variant="primary"
                                onClick={handleUserIdDuplicateCheck}
                            >
                                {"중복검사"}
                            </Button>
                        </InputGroup>
                        {userIdError && (
                            <Form.Text className="text-danger">
                                {userIdErrorMessage}
                            </Form.Text>
                        )}
                        {checkUserID && (
                            <Form.Text className="text-success">
                                {userIdCheckMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">{"비밀번호"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type={changeUserIdpasswordType}
                                id="password"
                                ref={passwordRef}
                                onKeyDown={handlePasswordKeyDown}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={handleChangeUserIdPasswordType}
                            >
                                {changeUserIdpasswordType === "password" && (
                                    <EyeOn />
                                )}
                                {changeUserIdpasswordType === "text" && (
                                    <EyeOff />
                                )}
                            </Button>
                        </InputGroup>
                        {passwordError && (
                            <Form.Text className="text-danger">
                                {passwordErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCheckPassword}>
                        {"아이디 변경"}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCloseChangeUserIdModal}
                    >
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Confirm Modal */}
            <ConfirmModal
                showConfirmModal={showConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
                handleConfirm={handleConfirmChangeUserId}
                confirmTitle={"아이디 변경 확인"}
                confirmText={"아이디를 변경하시겠습니까?"}
            />

            {/* Alert Modal */}
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </>
    );
}

export default ChangeUserIdModal;
