import DatePicker from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { Form, InputGroup, Container, Row, Col, Modal } from "react-bootstrap";
import CalendarFill from "../assets/svg/CalendarFill";
import ClockFill from "../assets/svg/ClockFill";
import CaretLeftFill from "../assets/svg/CaretLeftFill";
import CaretRightFill from "../assets/svg/CaretRightFill";
import { useState } from "react";

const range = (start, end, step = 1) => {
    const length = Math.ceil((end - start) / step);
    return Array.from({ length }, (_, i) => start + i * step);
};

function CustomInput(props) {
    const { value, onClick } = props;

    return (
        <Form.Control
            type="text"
            value={value}
            onClick={onClick}
            style={{ cursor: "pointer" }}
            readOnly={true}
        />
    );
}

function TimeSelect(props) {
    const { showTimeSelect, handleCloseTimeSelect, selectedTime, setSelectedTime } = props;

    const [selectedHour, setSelectedHour] = useState("");
    const [selectedMinute, setSelectedMinute] = useState("");

    return (
        <Modal show={showTimeSelect} onHide={handleCloseTimeSelect}>
            <Modal.Body></Modal.Body>
        </Modal>
    );
}

export function SingleDatePicker(props) {
    const { selectedDate, onDateChange } = props;
    const years = range(2024, getYear(new Date()) + 1, 1);

    const months = Array.from(
        { length: 12 },
        (_, i) => `${String(i + 1).padStart(2, "0")}월`
    );

    return (
        <InputGroup>
            <InputGroup.Text>
                <CalendarFill />
            </InputGroup.Text>
            <DatePicker
                id="single-date-picker"
                locale={ko}
                dateFormat="yyyy-MM-dd"
                renderCustomHeader={(props) => {
                    const {
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                    } = props;

                    const currentYear = getYear(date);
                    const currentMonth = getMonth(date);

                    const availableMonths =
                        currentYear === 2024
                            ? months.slice(9) // 10월부터 12월까지
                            : months; // 모든 월

                    return (
                        <Container>
                            <Row className="justify-content-center">
                                <Col
                                    xs={1}
                                    className="d-flex justify-content-center"
                                >
                                    <button
                                        className="icon-button"
                                        onClick={decreaseMonth}
                                        disabled={
                                            prevMonthButtonDisabled ||
                                            (currentYear === 2024 &&
                                                currentMonth === 9)
                                        }
                                    >
                                        <CaretLeftFill />
                                    </button>
                                </Col>
                                <Col
                                    xs={4}
                                    className="d-flex justify-content-center"
                                >
                                    <select
                                        value={currentYear}
                                        onChange={({ target: { value } }) => {
                                            const newYear = parseInt(value, 10);
                                            changeYear(newYear);

                                            // 2024년으로 변경 시, 월을 10월로 제한
                                            if (
                                                newYear === 2024 &&
                                                getMonth(date) < 9
                                            ) {
                                                changeMonth(9);
                                            }
                                        }}
                                    >
                                        {years.map((option) => (
                                            <option key={option} value={option}>
                                                {`${option}년`}
                                            </option>
                                        ))}
                                    </select>
                                </Col>
                                <Col
                                    xs={4}
                                    className="d-flex justify-content-center"
                                >
                                    <select
                                        value={months[currentMonth]}
                                        onChange={({ target: { value } }) => {
                                            const newMonthIndex =
                                                months.indexOf(value);
                                            changeMonth(newMonthIndex);
                                        }}
                                    >
                                        {availableMonths.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </Col>
                                <Col
                                    xs={1}
                                    className="d-flex justify-content-center"
                                >
                                    <button
                                        className="icon-button"
                                        onClick={increaseMonth}
                                        disabled={nextMonthButtonDisabled}
                                    >
                                        <CaretRightFill />
                                    </button>
                                </Col>
                            </Row>
                        </Container>
                    );
                }}
                selected={selectedDate}
                onChange={(date) => onDateChange(date)}
                customInput={<CustomInput />}
                minDate={new Date("2024-10-02")}
                maxDate={new Date()}
            />
        </InputGroup>
    );
}

export function SingleTimePicker(props) {
    const { selectedTime, setSelectedTime } = props;

    const [showTimeSelect, setShowTimeSelect] = useState(false);

    const handleShowTimeSelect = () => setShowTimeSelect(true);
    const handleCloseTimeSelect = () => setShowTimeSelect(false);

    return (
        <>
            <InputGroup>
                <InputGroup.Text>
                    <ClockFill />
                </InputGroup.Text>
                <div className="react-datepicker-wrapper">
                    <div className="react-datepicker__input-container">
                        <Form.Control
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            onClick={handleShowTimeSelect}
                            style={{ cursor: "pointer" }}
                            readOnly={true}
                        />
                    </div>
                </div>
            </InputGroup>
            <TimeSelect
                showTimeSelect={showTimeSelect}
                handleCloseTimeSelect={handleCloseTimeSelect}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
            />
        </>
    );
}
