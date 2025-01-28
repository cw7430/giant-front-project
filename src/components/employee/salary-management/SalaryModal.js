import { useCallback, useEffect, useState } from "react";
import {
    Modal,
    Form,
    Button,
    InputGroup,
    Row,
    Col,
    Badge,
} from "react-bootstrap";
import SearchEmployeeModal from "../SearchEmplyeeModal";
import ConfirmModal from "../../modals/ConfirmModal";
import AlertModal from "../../modals/AlertModal";
import { SingleDatePicker } from "../../../util/CustomDatePicker";
import Loader from "../../../util/Loader";

function SalaryModal(props) {
    const {
        showSalaryModal,
        handleCloseSalaryModal,
        existingEmployeeList,
        classList,
        updateData,
    } = props;

    const [loading, setLoading] = useState(false);
    const [showSearchEmployeeModal, setShowSearchEmployeeModal] =
        useState(false);
    const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState("");

    const handleShowSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(true);

    const handleCloseSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(false);

    useEffect(() => {
        if (!showSalaryModal) {
            setSelectedEmployeeNumber("");
        }
    }, [showSalaryModal]);

    return (
        <>
            <Modal
                backdrop="static"
                show={showSalaryModal}
                onHide={handleCloseSalaryModal}
            >
                <Modal.Header>
                    <Modal.Title>{"급여 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3 mb-3">
                        <Form.Label htmlFor="employeeNumber">
                            {"사번"}
                        </Form.Label>
                        <InputGroup>
                            <Col xs={5}>
                                <Form.Control
                                    type="text"
                                    id="employeeNumber"
                                    value={selectedEmployeeNumber}
                                    onChange={(e) =>
                                        setSelectedEmployeeNumber(
                                            e.target.value
                                        )
                                    }
                                    readOnly={true}
                                />
                            </Col>
                            <Col xs={2}>
                                <Button
                                    variant="primary"
                                    onClick={handleShowSearchEmployeeModal}
                                >
                                    {"검색"}
                                </Button>
                            </Col>
                        </InputGroup>
                    </Form.Group>
                    {loading && <Loader />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseSalaryModal}>
                        {"등록"}
                    </Button>
                    <Button variant="danger" onClick={handleCloseSalaryModal}>
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <SearchEmployeeModal
                view={"single"}
                showSearchEmployeeModal={showSearchEmployeeModal}
                handleCloseSearchEmployeeModal={handleCloseSearchEmployeeModal}
                existingEmployeeList={existingEmployeeList}
                setSelectedEmployeeNumber={setSelectedEmployeeNumber}
                classList={classList}
                selectedEmployeeList={[]}
            />
        </>
    );
}

export default SalaryModal;
