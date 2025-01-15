import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { EyeOn, EyeOff } from "../../../assets/svg/Svgs";
import AlertModal from "../../modals/AlertModal";
import ConfirmModal from "../../modals/ConfirmModal";
import {
    requestChangePassword,
    requestLogIn,
    requestProfile,
} from "../../../servers/employServer";

function ChangePasswordModal(props) {
    const {
        userId,
        employeeNumber,
        showChangePasswordModal,
        handleCloseChangePasswordModal,
        originalPasswordType,
        changePasswordType,
        checkPasswordType,
        handleOriginalPasswordType,
        handleChangePasswordType,
        handleCheckPasswordType,
        updateUserProfile,
    } = props;

    const originalPasswordRef = useRef(null);
    const passwordRef = useRef(null);
    const checkPasswordRef = useRef(null);

    const [originalPasswordError, setOriginalPasswordError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [checkPasswordError, setCheckPasswordError] = useState(false);
    const [originalPasswordErrorMessage, setOriginalPasswordErrorMessage] =
        useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [checkPasswordErrorMessage, setCheckPasswordErrorMessage] =
        useState("");

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCloseAlertModal = () => setShowAlertModal(false);
    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    useEffect(() => {
        if (showChangePasswordModal) {
            if (originalPasswordRef.current) {
                originalPasswordRef.current.focus();
            }
        } else {
            setOriginalPasswordError(false);
            setPasswordError(false);
            setCheckPasswordError(false);
            setOriginalPasswordErrorMessage("");
            setPasswordErrorMessage("");
            setCheckPasswordErrorMessage("");
        }
    }, [showChangePasswordModal]);

    const handleOriginalPasswordKeyDown = (event) => {
        if (event.key !== "Enter") return;
        if (!passwordRef.current) return;
        passwordRef.current.focus();
    };

    const handlePasswordKeyDown = (event) => {
        if (event.key !== "Enter") return;
        if (!checkPasswordRef.current) return;
        checkPasswordRef.current.focus();
    };

    const handleCheckPasswordKeyDown = (event) => {
        if (event.key !== "Enter") return;
        handleValidate();
    };

    const handleValidate = () => {
        const originalPassword = originalPasswordRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const checkPassword = checkPasswordRef.current?.value || "";
        const passwordPattern =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?`~-]).{10,25}$/;

        if (!originalPassword) {
            setOriginalPasswordError(true);
            setOriginalPasswordErrorMessage("비밀번호를 입력해주세요.");
            if (originalPasswordRef.current)
                originalPasswordRef.current.focus();
            return;
        }

        if (!password) {
            setPasswordError(true);
            setPasswordErrorMessage("비밀번호를 입력해주세요.");
            if (passwordRef.current) passwordRef.current.focus();
            return;
        } else if (!passwordPattern.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage(
                "비밀번호는 10자리 이상 25자리 이하 영문, 숫자, 특수문자의 조합만 가능합니다."
            );
            if (passwordRef.current) passwordRef.current.focus();
            return;
        }

        if (!checkPassword) {
            setCheckPasswordError(true);
            setCheckPasswordErrorMessage("비밀번호를 입력해주세요.");
            if (passwordRef.current) passwordRef.current.focus();
            return;
        }

        if (password !== checkPassword) {
            setCheckPasswordError(true);
            setCheckPasswordErrorMessage("비밀번호가 일치하지 않습니다.");
            if (checkPasswordRef.current) checkPasswordRef.current.focus();
            return;
        }

        setOriginalPasswordError(false);
        setPasswordError(false);
        setCheckPasswordError(false);
        setOriginalPasswordErrorMessage("");
        setPasswordErrorMessage("");
        setCheckPasswordErrorMessage("");
        handleCheckOriginalPassword(originalPassword);
    };

    const handleCheckOriginalPassword = async (originalPassword) => {
        const request = { userId: userId, password: originalPassword };
        const response = await requestLogIn(request);
        if (response.result === "SU") {
            setOriginalPasswordError(false);
            setCheckPasswordError(false);
            setOriginalPasswordErrorMessage("");
            setCheckPasswordErrorMessage("");
            setShowConfirmModal(true);
        } else if (response.result === "FA") {
            setOriginalPasswordError(true);
            setOriginalPasswordErrorMessage("비밀번호가 올바르지 않습니다.");
            if (originalPasswordRef.current)
                originalPasswordRef.current.focus();
        } else if (response.result === "SE") {
            setCheckPasswordError(true);
            setCheckPasswordErrorMessage(
                "서버 오류입니다. 잠시 후 다시 시도해주세요."
            );
        }
    };

    const handleChangePassword = async (checkPassword) => {
        handleCloseConfirmModal();
        const password = checkPasswordRef.current?.value || "";

        const request = {
            employeeNumber: employeeNumber,
            password: password,
        };
        const response = await requestChangePassword(request);
        if (response.result === "SU") {
            const updatedProfileResponse = await requestProfile({
                employeeNumber: employeeNumber,
            });
            updateUserProfile(updatedProfileResponse);
            handleCloseChangePasswordModal();
            setAlertTitle("변경완료");
            setAlertText("비밀번호 변경이 완료되었습니다.");
            setShowAlertModal(true);
        } else {
            setCheckPasswordError(true);
            setCheckPasswordErrorMessage(
                "서버 오류입니다. 잠시 후 다시 시도해주세요."
            );
        }
    };

    return (
        <>
            <Modal
                backdrop="static"
                show={showChangePasswordModal}
                onHide={handleCloseChangePasswordModal}
            >
                <Modal.Header>
                    <Modal.Title>{"비밀번호 변경"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="originalPassword">
                            {"기존 비밀번호"}
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type={originalPasswordType}
                                id="originalPassword"
                                ref={originalPasswordRef}
                                onKeyDown={handleOriginalPasswordKeyDown}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={handleOriginalPasswordType}
                            >
                                {originalPasswordType === "password" && (
                                    <EyeOn />
                                )}
                                {originalPasswordType === "text" && <EyeOff />}
                            </Button>
                        </InputGroup>
                        {originalPasswordError && (
                            <Form.Text className="text-danger">
                                {originalPasswordErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">
                            {"변경 비밀번호"}
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type={changePasswordType}
                                id="password"
                                ref={passwordRef}
                                onKeyDown={handlePasswordKeyDown}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={handleChangePasswordType}
                            >
                                {changePasswordType === "password" && <EyeOn />}
                                {changePasswordType === "text" && <EyeOff />}
                            </Button>
                        </InputGroup>
                        {passwordError && (
                            <Form.Text className="text-danger">
                                {passwordErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="checkPassword">
                            {"비밀번호 확인"}
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type={checkPasswordType}
                                id="checkPassword"
                                ref={checkPasswordRef}
                                onKeyDown={handleCheckPasswordKeyDown}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={handleCheckPasswordType}
                            >
                                {checkPasswordType === "password" && <EyeOn />}
                                {checkPasswordType === "text" && <EyeOff />}
                            </Button>
                        </InputGroup>
                        {checkPasswordError && (
                            <Form.Text className="text-danger">
                                {checkPasswordErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleValidate}>
                        {"비밀번호 변경"}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCloseChangePasswordModal}
                    >
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ConfirmModal
                showConfirmModal={showConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
                handleConfirm={handleChangePassword}
                confirmTitle={"비밀번호 변경 확인"}
                confirmText={"비밀번호를 변경하시겠습니까?"}
            />
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </>
    );
}

export default ChangePasswordModal;
