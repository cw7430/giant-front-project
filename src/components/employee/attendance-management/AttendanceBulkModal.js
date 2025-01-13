import { useEffect, useRef, useState } from "react";
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
import { SingleDatePicker } from "../../../util/CustomDatePicker";

function AttendanceBulkModal(props) {
    const {
        showAttendanceBukModal,
        handleCloseAttendanceBukModal,
        attendanceStatusList,
        existingEmployeeList,
        classList,
    } = props;

    const [showSearchEmployeeModal, setShowSearchEmployeeModal] =
        useState(false);
    const [exceptedEmployeeList, setExceptedEmployeeList] = useState([]);

    const handleShowSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(true);

    const handleCloseSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(false);

    const handleBadgeRemove = (employeeNumber) => {
        setExceptedEmployeeList(
            exceptedEmployeeList.filter((num) => num !== employeeNumber)
        );
    };

    useEffect(() => {
        if (!showAttendanceBukModal) {
            setExceptedEmployeeList([]);
        }
    }, [showAttendanceBukModal]);

    return (
        <>
            <Modal
                backdrop="static"
                show={showAttendanceBukModal}
                onHide={handleCloseAttendanceBukModal}
            >
                <Modal.Header>
                    <Modal.Title>{"근태 일괄 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mt-3 mb-3">
                        <InputGroup>
                            <Col xs={4}>
                                <span>{"제외할 사원 검색"}</span>
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
                    </Row>
                    <Row className="mt-3">
                        {exceptedEmployeeList.map((employeeNumber) => (
                            <Col className="mb-1" xs={2} key={employeeNumber}>
                                <Badge pill bg="dark">
                                    {employeeNumber}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleBadgeRemove(employeeNumber)
                                        }
                                    >
                                        <Form.Text className="text-warning">
                                            {"X"}
                                        </Form.Text>
                                    </button>
                                </Badge>
                            </Col>
                        ))}
                    </Row>
                    <SingleDatePicker />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={handleCloseAttendanceBukModal}
                    >
                        {"등록"}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCloseAttendanceBukModal}
                    >
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <SearchEmployeeModal
                view={"bulk"}
                showSearchEmployeeModal={showSearchEmployeeModal}
                handleCloseSearchEmployeeModal={handleCloseSearchEmployeeModal}
                existingEmployeeList={existingEmployeeList}
                selectedEmployeeList={exceptedEmployeeList}
                setSelectedEmployeeList={setExceptedEmployeeList}
                classList={classList}
            />
        </>
    );
}

export default AttendanceBulkModal;
