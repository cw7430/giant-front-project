import { Modal, Button, Container, Row, Col } from "react-bootstrap";

function EmployeeSelectModal(props) {
    const { view, showEmployeeSelectModal, handleCloseEmployeeSelectModal, handleShowAttendanceBukModal } = props;
    
    const toggleBulkButton = () => {
        if(view === "Attendance") handleShowAttendanceBukModal();
        handleCloseEmployeeSelectModal();
    }
    
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
                            <Button variant="primary">{"개별등록"}</Button>
                        </Col>
                        <Col xs="auto">
                            <Button variant="secondary" onClick={toggleBulkButton}>{"일괄등록"}</Button>
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
