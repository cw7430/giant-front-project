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

const formatTime = (time) => {
    if (!time || typeof time !== "string") return "";
    const parts = time.split(":");
    return parts.slice(0, 2).join(":");
};

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
    const { selectedDate, onDateChange, minDate } = props;

    const [minYear, minMonth] = minDate.split("-").map(Number);

    const years = range(2024, getYear(new Date()) + 1, 1);

    const months = Array.from(
        { length: 12 },
        (_, i) => `${String(i + 1).padStart(2, "0")}월`
    );

    const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
    const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));

    // 선택된 연도와 월에 따라 날짜 활성화
    const filterDateBySelectedMonth = (date) => {
        return (
            date.getFullYear() === selectedYear &&
            date.getMonth() === selectedMonth
        );
    };

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
                    const today = new Date();

                    const availableMonths =
                        currentYear === minYear
                            ? months.slice(minMonth - 1)
                            : currentYear === getYear(today)
                            ? months.slice(0, getMonth(today) + 1)
                            : months;
                    return (
                        <Container>
                            <Row className="justify-content-center">
                                <Col
                                    xs={1}
                                    className="d-flex justify-content-center"
                                >
                                    <button
                                        className="icon-button"
                                        onClick={() => {
                                            decreaseMonth();
                                            setSelectedMonth(
                                                currentMonth - 1 >= 0
                                                    ? currentMonth - 1
                                                    : 11
                                            );
                                            if (currentMonth === 0) {
                                                setSelectedYear(
                                                    currentYear - 1
                                                );
                                            }
                                        }}
                                        disabled={
                                            prevMonthButtonDisabled ||
                                            (currentYear === minYear &&
                                                currentMonth === minMonth - 1)
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
                                            setSelectedYear(newYear);
                                            changeYear(newYear);

                                            if (
                                                newYear === minYear &&
                                                getMonth(date) < minMonth - 1
                                            ) {
                                                setSelectedMonth(minMonth - 1);
                                                changeMonth(minMonth - 1);
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
                                            setSelectedMonth(newMonthIndex);
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
                                        onClick={() => {
                                            increaseMonth();
                                            setSelectedMonth(
                                                currentMonth + 1 <= 11
                                                    ? currentMonth + 1
                                                    : 0
                                            );
                                            if (currentMonth === 11) {
                                                setSelectedYear(
                                                    currentYear + 1
                                                );
                                            }
                                        }}
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
                minDate={new Date(minDate)}
                maxDate={new Date()}
                filterDate={filterDateBySelectedMonth} // 필터 조건 추가
                dayClassName={(date) => {
                    const day = date.getDay();
                    if (day === 6) return "saturday";
                    if (day === 0) return "sunday";
                    return undefined;
                }}
            />
        </InputGroup>
    );
}

export function SingleTimePicker(props) {
    const { selectedTime, setSelectedTime, disabled } = props;

    const formatedTime = formatTime(selectedTime);

    const [showTimeSelect, setShowTimeSelect] = useState(false);

    return (
        <>
            <InputGroup>
                <InputGroup.Text>
                    <ClockFill />
                </InputGroup.Text>
                <Form.Control
                    value={formatedTime}
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
