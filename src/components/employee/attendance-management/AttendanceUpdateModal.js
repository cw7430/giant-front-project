import { useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import {
    SingleDatePicker,
    SingleTimePicker,
} from "../../../util/CustomDatePicker";
import { requestAttendance } from "../../../servers/employServer";
import AlertModal from "../../modals/AlertModal";

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
    const [employeeName, setEmployeeName] = useState("");
    const [commuteDate, setCommuteDate] = useState(new Date());

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");
    const [commuteTime, setCommuteTime] = useState("");
    const [quitTime, setQuitTime] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("");

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
                        setEmployeeName(response.responseData.employeeName);
                        setCommuteDate(response.responseData.commuteDate);
                        setCommuteTime(response.responseData.commuteTime);
                        setQuitTime(response.responseData.quitTime);
                        setAttendanceStatus(response.responseData.attendanceStatus);
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
        }
    }, [
        showAttendancUpdateModal,
        selectedAttendanceId,
        handleCloseAttendanceUpdateModal,
    ]);

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
                            <Form.Label htmlFor="datePicker">
                                {"출근일"}
                            </Form.Label>
                            <SingleDatePicker
                                id="datePicker"
                                selectedDate={commuteDate}
                                onDateChange={setCommuteDate}
                            />
                        </Form.Group>
                    </Modal.Body>
                )}
                {loading && (
                    <Modal.Body>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Form.Text className="text-info">
                                {"로딩중..."}
                            </Form.Text>
                        </Row>
                    </Modal.Body>
                )}
                {!loading && (
                    <Modal.Footer>
                        <Button
                            variant="success"
                            onClick={handleCloseAttendanceUpdateModal}
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
