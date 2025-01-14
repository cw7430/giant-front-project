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
import {
    SingleDatePicker,
    SingleTimePicker,
} from "../../../util/CustomDatePicker";

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
    const [commuteDate, setCommuteDate] = useState(new Date());
    const [commuteTime, setCommuteTime] = useState("09:00");
    const [quitTime, setQuitTime] = useState("18:00");

    const [commuteDateError, setCommuteDateError] = useState(false);
    const [commuteTimeError, setCommuteTimeError] = useState(false);
    const [quitTimeError, setQuitTimeError] = useState(false);
    const [commuteDateErrorMessage, setCommuteDateErrorMessage] = useState("");
    const [commuteTimeErrorMessage, setCommuteTimeErrorMessage] = useState("");
    const [quitTimeErrorMessage, setQuitTimeErrorMessage] = useState("");

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
            setCommuteDate(new Date());
            setCommuteTime("09:00");
            setQuitTime("18:00");
            setCommuteDateError(false);
            setCommuteTimeError(false);
            setQuitTimeError(false);
            setCommuteDateErrorMessage("");
            setCommuteTimeErrorMessage("");
            setQuitTimeErrorMessage("");
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
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="datePicker">{"출근일"}</Form.Label>
                        <SingleDatePicker
                            id="datePicker"
                            selectedDate={commuteDate}
                            onDateChange={setCommuteDate}
                        />
                        {commuteDateError && (
                            <Form.Text className="text-danger">
                                {commuteDateErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="commuteTime">
                            {"출근시간"}
                        </Form.Label>
                        <SingleTimePicker
                            selectedTime={commuteTime}
                            setSelectedTime={setCommuteTime}
                        />
                        {commuteTimeError && (
                            <Form.Text className="text-danger">
                                {commuteTimeErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="quitTime">{"퇴근시간"}</Form.Label>
                        <InputGroup id="quitTime" className="mb-3"></InputGroup>
                        {quitTimeError && (
                            <Form.Text className="text-danger">
                                {quitTimeErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
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
