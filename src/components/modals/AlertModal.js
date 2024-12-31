import { Modal, Button } from "react-bootstrap";

function AlertModal(props) {
    const {showAlertModal, handleCloseAlertModal, alertTitle, alertText} = props;
    
    return (
        <Modal backdrop="static" show={showAlertModal} onHide={handleCloseAlertModal}>
            <Modal.Header>
                <Modal.Title>{alertTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{alertText}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleCloseAlertModal}>
                    {"확인"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AlertModal;
