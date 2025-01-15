import React, { useState, useEffect, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { Form, InputGroup, Container, Row, Col, Button } from "react-bootstrap";
import {
    CalendarFill,
    ClockFill,
    CaretLeftFill,
    CaretRightFill,
} from "../assets/svg/Svgs";

const range = (start, end, step = 1) => {
    const length = Math.ceil((end - start) / step);
    return Array.from({ length }, (_, i) => start + i * step);
};

const CustomInput = React.forwardRef((props, ref) => {
    const { value, onClick } = props;

    return (
        <Form.Control
            type="text"
            value={value}
            onClick={onClick}
            ref={ref} // forwardRef로 전달된 ref를 연결
            style={{ cursor: "pointer" }}
            readOnly={true}
        />
    );
});

function TimeSelect(props) {
    const { selectedTime, setSelectedTime, closeTimeSelect } = props;

    const [selectedHour, setSelectedHour] = useState("00");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const containerRef = useRef(null);

    useEffect(() => {
        if (selectedTime) {
            const [hour, minute] = selectedTime.split(":");
            setSelectedHour(hour);
            setSelectedMinute(minute);
        }
    }, [selectedTime]);

    const handleTimeChange = () => {
        const newTime = `${selectedHour}:${selectedMinute}`;
        setSelectedTime(newTime);
        closeTimeSelect();
    };

    const handleClickOutside = useCallback(
        (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                closeTimeSelect();
            }
        },
        [closeTimeSelect]
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div
            ref={containerRef}
            className="time-select-container shadow bg-white rounded p-3"
            style={{
                position: "absolute",
                zIndex: 10,
                minWidth: "274px", // 위젯의 최소 너비를 설정
            }}
        >
            {/* 콤보박스 간의 간격을 줄이기 위해 g-1 추가 */}
            <Form.Group
                as={Row}
                className="g-1 justify-content-center align-items-center"
                controlId="timeSelect"
            >
                <Col xs={3}>
                    <Form.Control
                        as="select"
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                    >
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, "0")}>
                                {`${String(i).padStart(2, "0")}시`}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col xs={3}>
                    <Form.Control
                        as="select"
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                    >
                        {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, "0")}>
                                {`${String(i).padStart(2, "0")}분`}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col xs={4}>
                    <Button
                        onClick={handleTimeChange}
                        variant="primary"
                        className="me-1"
                    >
                        {"등록"}
                    </Button>
                </Col>
            </Form.Group>
        </div>
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
    const { selectedTime, setSelectedTime, disabled } = props;

    const [showTimeSelect, setShowTimeSelect] = useState(false);

    return (
        <>
            <InputGroup>
                <InputGroup.Text>
                    <ClockFill />
                </InputGroup.Text>
                <Form.Control
                    value={selectedTime}
                    onClick={() => setShowTimeSelect(!showTimeSelect)}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    style={{ cursor: disabled ? "default" : "pointer" }}
                    readOnly={true}
                    disabled={disabled}
                />
            </InputGroup>

            {showTimeSelect && (
                <TimeSelect
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    closeTimeSelect={() => setShowTimeSelect(false)}
                />
            )}
        </>
    );
}
