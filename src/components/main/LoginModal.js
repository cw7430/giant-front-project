import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import EyeOn from "../../assets/svg/EyeOn";
import EyeOff from "../../assets/svg/EyeOff";
import { useEffect, useRef, useState } from "react";
import { requestLogIn } from "../../servers/employServer";

function LogInModal(props) {
    const {
        showLoginModal,
        handleCloseLoginModal,
        passwordType,
        handlePasswordType,
        setIsLogin
    } = props;

    const userIdRef = useRef(null);
    const passwordRef = useRef(null);

    const [userIdError, setUserIdError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [logInError, setLogInError] = useState(false);
    const [userIdErrorMessage, setUserIdErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [logInErrorMessage, setLogInErrorMessage] = useState("");

    useEffect(() => {
        if (showLoginModal) {
            if (userIdRef.current) {
                userIdRef.current.focus();
            }
        } else {
            setUserIdError(false);
            setPasswordError(false);
            setLogInError(false);
            setUserIdErrorMessage("");
            setPasswordErrorMessage("");
            setLogInErrorMessage("");
        }
    }, [showLoginModal]);

    const handleUserIdKeyDown = (event) => {
        if (event.key !== "Enter") return;
        if (!passwordRef.current) return;
        passwordRef.current.focus();
    };

    const handlePasswordKeyDown = (event) => {
        if (event.key !== "Enter") return;
        validteLogIn();
    };

    const validteLogIn = () => {
        const userIdPattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;

        const userId = userIdRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        let isValid = true;

        if (!userIdPattern.test(userId)) {
            setUserIdError(true);
            setUserIdErrorMessage(
                "아이디는 영문 또는 영문과 숫자의 조합만 가능합니다."
            );
            isValid = false;
        } else {
            setUserIdError(false);
        }

        if (password.trim() === "") {
            setPasswordError(true);
            setPasswordErrorMessage("비밀번호를 입력해주세요.");
            isValid = false;
        } else {
            setPasswordError(false);
        }

        if (isValid) {
            const request = { userId: userId, password: password };
            handleLogIn(request);
        }
    };

    const handleLogIn = async (request) => {
        const response = await requestLogIn(request);
        if (response.result === "SU") {
            sessionStorage.setItem("employeeNumber", response.employeeNumber);
            sessionStorage.setItem("authorityCode", response.authorityCode);
            setLogInError(false);
            setLogInErrorMessage("");
            setIsLogin(true);
            handleCloseLoginModal();
        } else if (response.result === "FA") {
            setLogInError(true);
            setLogInErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
        } else if (response.result === "SE") {
            setLogInError(true);
            setLogInErrorMessage("서버 오류입니다. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <Modal
            show={showLoginModal}
            onHide={handleCloseLoginModal}
            backdrop="static"
        >
            <Modal.Header>
                <Modal.Title>{"로그인"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="userId">{"아이디"}</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            id="userId"
                            ref={userIdRef}
                            onKeyDown={handleUserIdKeyDown}
                        />
                    </InputGroup>
                    {userIdError && (
                        <Form.Text className="text-danger">
                            {userIdErrorMessage}
                        </Form.Text>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="password">{"비밀번호"}</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type={passwordType}
                            id="password"
                            ref={passwordRef}
                            onKeyDown={handlePasswordKeyDown}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={handlePasswordType}
                        >
                            {passwordType === "password" && <EyeOn />}
                            {passwordType === "text" && <EyeOff />}
                        </Button>
                    </InputGroup>
                    {passwordError && (
                        <Form.Text className="text-danger">
                            {passwordErrorMessage}
                        </Form.Text>
                    )}
                    {logInError && (
                        <Form.Text className="text-danger">
                            {logInErrorMessage}
                        </Form.Text>
                    )}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={validteLogIn}>
                    {"로그인"}
                </Button>
                <Button variant="danger" onClick={handleCloseLoginModal}>
                    {"닫기"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LogInModal;
