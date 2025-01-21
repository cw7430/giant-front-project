import { useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import {
    SingleDatePicker,
    SingleTimePicker,
} from "../../../util/CustomDatePicker";

function AttendanceUpdateModal(props) {
    const {
        showAttendancUpdateModal,
        handleCloseAttendanceUpdateModal,
        selectedAttendance,
        attendanceStatusList,
        updateData,
        currentYearMonth,
    } = props;

    const [commuteDate, setCommuteDate] = useState(
        selectedAttendance.commuteDate
    );

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
                <Modal.Body>
                    <Form.Group className="mt-3 mb-3">
                        <Form.Label htmlFor="employeeNumber">
                            {"사번"}
                        </Form.Label>
                        <InputGroup>
                            <Form.Text id="employeeNumber">
                                {selectedAttendance.employeeNumber}
                            </Form.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="datePicker">{"출근일"}</Form.Label>
                        <SingleDatePicker
                            id="datePicker"
                            selectedDate={commuteDate}
                            onDateChange={setCommuteDate}
                        />
                    </Form.Group>
                </Modal.Body>
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
            </Modal>
        </>
    );
}

export default AttendanceUpdateModal;
