import { Modal, Button, Container, Row, Col } from "react-bootstrap";

function EmployeeSelectModal(props) {
    const {
        view,
        showEmployeeSelectModal,
        handleCloseEmployeeSelectModal,
        handleShowAttendanceModal,
        handleShowAttendanceBulkModal,
        handleShowSalaryModal,
    } = props;

    const toggleSingleButton = () => {
        if (view === "Attendance") handleShowAttendanceModal();
        if (view === "Salary") handleShowSalaryModal();
        handleCloseEmployeeSelectModal();
    }

    const toggleBulkButton = () => {
        if (view === "Attendance") handleShowAttendanceBulkModal();
        handleCloseEmployeeSelectModal();
    };

    return (
        <Modal
            backdrop="static"
            show={showEmployeeSelectModal}
            onHide={handleCloseEmployeeSelectModal}
        >
            <Modal.Header>
                <Modal.Title>{"선택해주세요"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Button variant="primary" onClick={toggleSingleButton}>{"개별등록"}</Button>
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="secondary"
                                onClick={toggleBulkButton}
                            >
                                {"일괄등록"}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="danger"
                    onClick={handleCloseEmployeeSelectModal}
                >
                    {"닫기"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EmployeeSelectModal;
