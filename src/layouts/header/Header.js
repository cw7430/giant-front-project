import { useState } from "react";
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import LogInModal from "../../components/main/LoginModal";
import { Link, useNavigate } from "react-router-dom";
import { MAIN_PATH, MY_PROFILE_PATH, EMPLOYEE_PATH } from "../../constant/url";

function Header(props) {
    const { isLogin, setIsLogin } = props;

    const navigate = useNavigate();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [passwordType, setPasswordType] = useState("password");

    const handleShowLoginModal = () => setShowLoginModal(true);
    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
        setPasswordType("password");
    };
    const handlePasswordType = () => {
        setPasswordType((prevType) =>
            prevType === "password" ? "text" : "password"
        );
    };
    const handleLogOut = () => {
        navigate(MAIN_PATH());
        sessionStorage.clear();
        setIsLogin(false);
    };

    const handleMyProfile = () => {
        navigate(MY_PROFILE_PATH());
    };
    return (
        <div className="bg-black text-white py-3 px-4 d-flex justify-content-between align-items-center">
            <Navbar bg="black" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to={MAIN_PATH()} className="fs-4">
                        {"Giant"}
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={MAIN_PATH()}>{"홈"}</Nav.Link>
                        <Nav.Link href="#">{"재고관리"}</Nav.Link>
                        <Nav.Link href="#">{"매출관리"}</Nav.Link>
                        <Nav.Link as={Link} to={EMPLOYEE_PATH()}>{"인사관리"}</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            {!isLogin && (
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-light"
                        type="button"
                        onClick={handleShowLoginModal}
                    >
                        {"로그인"}
                    </Button>
                </div>
            )}
            {isLogin && (
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-light"
                        type="button"
                        onClick={handleMyProfile}
                    >
                        {"내프로필"}
                    </Button>
                    <Button
                        variant="outline-light"
                        type="button"
                        onClick={handleLogOut}
                    >
                        {"로그아웃"}
                    </Button>
                </div>
            )}
            <LogInModal
                showLoginModal={showLoginModal}
                handleCloseLoginModal={handleCloseLoginModal}
                passwordType={passwordType}
                handlePasswordType={handlePasswordType}
                setIsLogin={setIsLogin}
            />
        </div>
    );
}

export default Header;
