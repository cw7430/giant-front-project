import { Modal, Button } from "react-bootstrap";

function ConfirmModal(props) {
    const {
        showConfirmModal,
        handleCloseConfirmModal,
        handleConfirm,
        confirmTitle,
        confirmText,
    } = props;

    return (
        <Modal
            backdrop="static"
            show={showConfirmModal}
            onHide={handleCloseConfirmModal}
        >
            <Modal.Header>
                <Modal.Title>{confirmTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{confirmText}</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleConfirm}>
                    {"확인"}
                </Button>
                <Button variant="danger" onClick={handleCloseConfirmModal}>
                    {"취소"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;
