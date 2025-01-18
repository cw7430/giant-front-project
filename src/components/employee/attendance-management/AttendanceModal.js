import { useCallback, useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import SearchEmployeeModal from "../SearchEmplyeeModal";
import ConfirmModal from "../../modals/ConfirmModal";
import AlertModal from "../../modals/AlertModal";
import {
    SingleDatePicker,
    SingleTimePicker,
} from "../../../util/CustomDatePicker";
import {
    requestAttendanceDuplicateCheck,
    requestRegisterAttendance,
} from "../../../servers/employServer";

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

function AttendanceModal(props) {
    const {
        showAttendanceModal,
        handleCloseAttendanceModal,
        attendanceStatusList,
        existingEmployeeList,
        classList,
        updateData,
        currentYearMonth,
    } = props;

    const [showSearchEmployeeModal, setShowSearchEmployeeModal] =
        useState(false);
    const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState("");
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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const filteredAttendanceStatusList = attendanceStatusList.filter(
        (attendanceStatus) => attendanceStatus.attendanceStatusCode !== "ATD04"
    );

    const handleShowSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(true);

    const handleCloseSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(false);

    const handleShowConfirmModal = () => setShowConfirmModal(true);

    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        updateData(currentYearMonth);
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
        if (!showAttendanceModal) {
            setSelectedEmployeeNumber("");
            setIsAbsent(false);
            setCommuteDate(new Date());
            setCommuteTime("09:00");
            setQuitTime("18:00");
            setError(false);
            setErrorMessage("");
        } else {
            calculateAttendanceStatus(); // 모달이 열릴 때 초기 계산 실행
        }
    }, [showAttendanceModal, calculateAttendanceStatus]);

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

    const handleSubmit = () => {
        handleCloseConfirmModal();
        const attendanceData = {
            employeeNumber: selectedEmployeeNumber,
            commuteDate: commuteDate.toISOString().split("T")[0],
            commuteTime: commuteTime,
            quitTime: quitTime,
            attendanceStatusCode: attendanceStatus,
            attendanceRemark: "",
       };
       console.log(`데이터 디버깅: ${attendanceData}`);
    };

    return (
        <>
            <Modal
                backdrop="static"
                show={showAttendanceModal}
                onHide={handleCloseAttendanceModal}
            >
                <Modal.Header>
                    <Modal.Title>{"근태 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3 mb-3">
                        <Form.Label htmlFor="commuteStatus">
                            {"사번"}
                        </Form.Label>
                        <InputGroup>
                            <Col xs={5}>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployeeNumber}
                                    onChange={(e) =>
                                        setSelectedEmployeeNumber(
                                            e.target.value
                                        )
                                    }
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
                        <Form.Text className="text-primary">
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
                    <Button variant="success" onClick={handleShowConfirmModal}>
                        {"등록"}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCloseAttendanceModal}
                    >
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
            <ConfirmModal
                showConfirmModal={showConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
                handleConfirm={handleSubmit}
                confirmTitle={"확인"}
                confirmText={`${
                    commuteDate.toISOString().split("T")[0]
                } 근태 정보를 등록하시겠습니까?`}
            />
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </>
    );
}

export default AttendanceModal;
