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
import Loader from "../../../util/Loader";
import ConfirmModal from "../../modals/ConfirmModal";
import AlertModal from "../../modals/AlertModal";
import {
    SingleDatePicker,
    SingleTimePicker,
} from "../../../util/CustomDatePicker";

const parseTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const addMinutesToTime = (time, minutesToAdd) => {
    const totalMinutes = parseTimeToMinutes(time) + minutesToAdd;
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}`;
};

function AttendanceBulkModal(props) {
    const {
        showAttendanceBukModal,
        handleCloseAttendanceBukModal,
        attendanceStatusList,
        existingEmployeeList,
        classList,
        updateData,
    } = props;

    const [loading, setLoading] = useState(false);
    const [showSearchEmployeeModal, setShowSearchEmployeeModal] =
        useState(false);
    const [exceptedEmployeeList, setExceptedEmployeeList] = useState([]);
    const [isAbsent, setIsAbsent] = useState(false);
    const [commuteDate, setCommuteDate] = useState(new Date());
    const [commuteTime, setCommuteTime] = useState("09:00");
    const [quitTime, setQuitTime] = useState("18:00");
    const [attendanceStatus, setAttendanceStatus] = useState("");
    const [checkboxStates, setCheckboxStates] = useState([
        false,
        false,
        false,
        false,
    ]);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const filteredAttendanceStatusList = attendanceStatusList.filter(
        (attendanceStatus) => attendanceStatus.attendanceStatusCode !== "ATD04"
    );

    const handleShowSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(true);

    const handleCloseSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(false);

    const handleBadgeRemove = (employeeNumber) => {
        setExceptedEmployeeList(
            exceptedEmployeeList.filter((num) => num !== employeeNumber)
        );
    };

    const calculateAttendanceStatus = useCallback(() => {
        if (isAbsent) return;

        let status = "ATD01";
        const commuteTimeMinutes = parseTimeToMinutes(commuteTime);
        const quitTimeMinutes = parseTimeToMinutes(quitTime);
        const timeDifference = quitTimeMinutes - commuteTimeMinutes;

        if (commuteTimeMinutes >= quitTimeMinutes) {
            setQuitTime(addMinutesToTime(commuteTime, 1));
        } else {
            if (commuteTimeMinutes > parseTimeToMinutes("09:00")) {
                status = "ATD02"; // 지각
            }
            if (quitTimeMinutes < parseTimeToMinutes("18:00")) {
                status = status === "ATD02" ? "ATD04" : "ATD03"; // 조퇴 또는 지각+조퇴
            }
            if (timeDifference <= 240) {
                // 4시간 이하 근무
                status = "ATD05"; // 근무시간 부족
            }
        }

        setAttendanceStatus(status);
    }, [isAbsent, commuteTime, quitTime]);

    // 모달 상태 변경에 따른 초기화 및 상태 계산
    useEffect(() => {
        if (!showAttendanceBukModal) {
            setExceptedEmployeeList([]);
            setIsAbsent(false);
            setCommuteDate(new Date());
            setCommuteTime("09:00");
            setQuitTime("18:00");
            setError(false);
            setErrorMessage("");
        } else {
            calculateAttendanceStatus(); // 모달이 열릴 때 초기 계산 실행
        }
    }, [showAttendanceBukModal, calculateAttendanceStatus]);

    // isAbsent 변경에 따른 출근 상태 처리
    useEffect(() => {
        if (isAbsent) {
            setCommuteTime("");
            setQuitTime("");
            setAttendanceStatus("ATD05"); // 결근
        } else {
            // isAbsent가 false로 바뀔 때만 기본값 설정
            setCommuteTime("09:00");
            setQuitTime("18:00");
        }
    }, [isAbsent]);

    useEffect(() => {
        const states = [false, false, false, false];
        switch (attendanceStatus) {
            case "ATD01": // 정상
                states[0] = true;
                break;
            case "ATD02": // 지각
                states[1] = true;
                break;
            case "ATD03": // 조퇴
                states[2] = true;
                break;
            case "ATD04": // 지각 + 조퇴
                states[1] = true;
                states[2] = true;
                break;
            case "ATD05": // 결근
                states[3] = true;
                break;
            default:
                break;
        }
        setCheckboxStates(states);
    }, [attendanceStatus]);

    if (loading) {
        return <Loader />; // 로딩 중일 때 표시
    }

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
                        <Form.Label htmlFor="commuteStatus">
                            {"출근여부"}
                        </Form.Label>
                        <Row id="commuteStatus">
                            <Col xs={2}>
                                <Form.Check
                                    type="radio"
                                    value={"false"}
                                    label={"출근"}
                                    name="commuteStatus"
                                    checked={!isAbsent}
                                    onChange={() => setIsAbsent(false)}
                                />
                            </Col>
                            <Col xs={2}>
                                <Form.Check
                                    type="radio"
                                    value={"true"}
                                    label={"결근"}
                                    name="commuteStatus"
                                    checked={isAbsent}
                                    onChange={() => setIsAbsent(true)}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="datePicker">{"출근일"}</Form.Label>
                        <SingleDatePicker
                            id="datePicker"
                            selectedDate={commuteDate}
                            onDateChange={setCommuteDate}
                        />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="commuteTime">
                                {"출근시간"}
                            </Form.Label>
                            <SingleTimePicker
                                id="commuteTime"
                                selectedTime={commuteTime}
                                setSelectedTime={setCommuteTime}
                                disabled={isAbsent}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="quitTime">
                                {"퇴근시간"}
                            </Form.Label>
                            <SingleTimePicker
                                id="quitTime"
                                selectedTime={quitTime}
                                setSelectedTime={setQuitTime}
                                disabled={isAbsent}
                            />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label className="me-3" htmlFor="attendanceStatus">
                            {"근태상태"}
                        </Form.Label>
                        <Form.Text className="text-info">
                            {"*출근여부 및 시간 입력시 자동으로 체크됩니다."}
                        </Form.Text>
                        <Row id="commuteStatus">
                            {filteredAttendanceStatusList.map(
                                (attendanceStatus, key) => (
                                    <Col xs={2} key={key}>
                                        <Form.Check
                                            type="checkbox"
                                            value={key}
                                            label={
                                                attendanceStatus.attendanceStatusName
                                            }
                                            checked={checkboxStates[key]}
                                            readOnly
                                        />
                                    </Col>
                                )
                            )}
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        {error && (
                            <Form.Text className="text-error">
                                {errorMessage}
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
