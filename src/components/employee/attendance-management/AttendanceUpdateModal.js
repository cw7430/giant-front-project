import { useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import {
    SingleDatePicker,
    SingleTimePicker,
} from "../../../util/CustomDatePicker";
import {
    requestAttendance,
    requestAttendanceDuplicateCheck,
    requestUpdateAttendance,
} from "../../../servers/employServer";
import AlertModal from "../../modals/AlertModal";
import ConfirmModal from "../../modals/ConfirmModal";
import Loader from "../../../util/Loader";

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

function AttendanceUpdateModal(props) {
    const {
        showAttendancUpdateModal,
        handleCloseAttendanceUpdateModal,
        selectedAttendanceId,
        attendanceStatusList,
        updateData,
        currentYearMonth,
    } = props;

    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState({});
    const [employeeName, setEmployeeName] = useState("");
    const [commuteDate, setCommuteDate] = useState(new Date());
    const [commuteTime, setCommuteTime] = useState("");
    const [quitTime, setQuitTime] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("");
    const [attendanceRemark, setAttendanceRemark] = useState("");
    const [isAbsent, setIsAbsent] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState([
        false,
        false,
        false,
        false,
    ]);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");

    const filteredAttendanceStatusList = attendanceStatusList.filter(
        (attendanceStatus) => attendanceStatus.attendanceStatusCode !== "ATD04"
    );

    const handleShowConfirmModal = () => setShowConfirmModal(true);

    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        updateData(currentYearMonth);
    };

    useEffect(() => {
        if (showAttendancUpdateModal) {
            const fetchData = async (selectedAttendanceId) => {
                setLoading(true);
                try {
                    const response = await requestAttendance({
                        attendanceId: selectedAttendanceId,
                    });

                    if (response.result !== "SU") {
                        setAlertTitle("오류");
                        setAlertText("데이터 요청에 실패했습니다.");
                        setShowAlertModal(true);
                        handleCloseAttendanceUpdateModal();
                    } else {
                        setAttendance(response.responseData);
                        setEmployeeName(response.responseData.employeeName);
                        setCommuteDate(response.responseData.commuteDate);
                        setCommuteTime(response.responseData.commuteTime);
                        setQuitTime(response.responseData.quitTime);
                        setAttendanceStatus(
                            response.responseData.attendanceStatusCode
                        );
                        setAttendanceRemark(
                            response.responseData.attendanceRemark
                        );
                        if (
                            (!response.responseData.commuteTime ||
                                !response.responseData.quitTime) &&
                            response.responseData.attendanceStatusCode ===
                                "ATD05"
                        ) {
                            setIsAbsent(true);
                        } else {
                            setIsAbsent(false);
                        }
                    }
                } catch (error) {
                    console.error("데이터 요청 중 오류 발생:", error);
                    setAlertTitle("오류");
                    setAlertText("데이터 요청에 실패했습니다.");
                    setShowAlertModal(true);
                    handleCloseAttendanceUpdateModal();
                } finally {
                    setLoading(false);
                }
            };

            fetchData(selectedAttendanceId);
        } else {
            setError(false);
            setErrorMessage("");
        }
    }, [
        showAttendancUpdateModal,
        selectedAttendanceId,
        handleCloseAttendanceUpdateModal,
    ]);

    // isAbsent 변경에 따른 출근 상태 처리
    useEffect(() => {
        if (isAbsent) {
            setCommuteTime("");
            setQuitTime("");
            setAttendanceStatus("ATD05"); // 결근
        } else {
            if (!attendance.commuteTime) {
                setCommuteTime("09:00");
            } else {
                setCommuteTime(attendance.commuteTime);
            }

            if (!attendance.quitTime) {
                setQuitTime("18:00");
            } else {
                setQuitTime(attendance.quitTime);
            }
        }
    }, [isAbsent, attendance]);

    useEffect(() => {
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

    const handleSubmit = async () => {
        handleCloseConfirmModal();

        const formattedCommuteDate =
            commuteDate instanceof Date
                ? commuteDate.toISOString().split("T")[0]
                : new Date(commuteDate).toISOString().split("T")[0];

        const submitData = {
            attendanceId: selectedAttendanceId,
            employeeNumber: attendance.employeeNumber,
            commuteDate: formattedCommuteDate,
            commuteTime: commuteTime?.split(":").slice(0, 2).join(":"),
            quitTime: quitTime?.split(":").slice(0, 2).join(":"),
            attendanceStatusCode: attendanceStatus,
            attendanceRemark: attendanceRemark,
        };

        if (submitData.commuteDate !== attendance.commuteDate) {
            const duplicateResponse = await requestAttendanceDuplicateCheck(
                submitData
            );
            if (duplicateResponse !== "DP") {
                setError(true);
                setErrorMessage("중복된 요청입니다.");
                return;
            } else if (duplicateResponse.result === "FA") {
                setError(true);
                setErrorMessage("등록일자를 확인하여 사원을 선택해주세요.");
                return;
            } else if (duplicateResponse.result === "SE") {
                setError(true);
                setErrorMessage(
                    "수정 중 문제가 발생했습니다. 다시 시도해주세요."
                );
                return;
            }
        }

        const submitResponse = await requestUpdateAttendance(submitData);

        if (submitResponse.result === "SU") {
            setError(false);
            setErrorMessage("");
            setAlertTitle("수정완료");
            setAlertText("근태 수정을 완료하였습니다.");
            setShowAlertModal(true);
            handleCloseAttendanceUpdateModal();
        } else {
            setError(true);
            setErrorMessage("수정 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <>
            <Modal
                backdrop="static"
                show={showAttendancUpdateModal}
                onHide={handleCloseAttendanceUpdateModal}
            >
                <Modal.Header>
                    <Modal.Title>{"근태 수정"}</Modal.Title>
                </Modal.Header>
                {!loading && (
                    <Modal.Body>
                        <Form.Group className="mt-3 mb-3">
                            <Form.Label htmlFor="employeeName">
                                {"사원명"}
                            </Form.Label>
                            <InputGroup>
                                <Form.Text id="employeeName">
                                    {employeeName}
                                </Form.Text>
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
                            <Form.Label htmlFor="datePicker">
                                {"출근일"}
                            </Form.Label>
                            <SingleDatePicker
                                id="datePicker"
                                selectedDate={commuteDate}
                                onDateChange={setCommuteDate}
                                minDate="2024-10-02"
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
                            <Form.Label
                                className="me-3"
                                htmlFor="attendanceStatus"
                            >
                                {"근태상태"}
                            </Form.Label>
                            <Form.Text className="text-primary">
                                {
                                    "*출근여부 및 시간 입력시 자동으로 체크됩니다."
                                }
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
                        <Form.Group className="mt-3 mb-3">
                            <Form.Label htmlFor="attendanceRemark">
                                {"비고"}
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    id="attendanceRemark"
                                    value={attendanceRemark}
                                    onChange={(e) =>
                                        setAttendanceRemark(e.target.value)
                                    }
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            {error && (
                                <Form.Text className="text-error">
                                    {errorMessage}
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Modal.Body>
                )}
                {loading && (
                    <Modal.Body>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Form.Text className="text-info">
                                <Loader />
                            </Form.Text>
                        </Row>
                    </Modal.Body>
                )}
                {!loading && (
                    <Modal.Footer>
                        <Button
                            variant="success"
                            onClick={handleShowConfirmModal}
                        >
                            {"등록"}
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleCloseAttendanceUpdateModal}
                        >
                            {"닫기"}
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
            <ConfirmModal
                showConfirmModal={showConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
                handleConfirm={handleSubmit}
                confirmTitle={"확인"}
                confirmText={`${
                    commuteDate instanceof Date
                        ? commuteDate.toISOString().split("T")[0]
                        : new Date(commuteDate).toISOString().split("T")[0]
                } 근태 정보를 수정하시겠습니까?`}
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

export default AttendanceUpdateModal;
