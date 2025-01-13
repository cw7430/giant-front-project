import { useState } from "react";
import DatePicker from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { Form, Button, InputGroup, Container, Row, Col } from "react-bootstrap";
import CalendarFill from "../assets/svg/CalendarFill";

const range = (start, end, step = 1) => {
    const length = Math.ceil((end - start) / step);
    return Array.from({ length }, (_, i) => start + i * step);
};

export function SingleDatePicker() {
    const [startDate, setStartDate] = useState(new Date());
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
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => {
                    const currentYear = getYear(date);
                    const currentMonth = getMonth(date);

                    const availableMonths =
                        currentYear === 2024
                            ? months.slice(9) // 10월부터 12월까지
                            : months; // 모든 월

                    return (
                        <Container>
                            <Row className="justify-content-center">
                                <Col xs={1}>
                                    <button
                                        className="icon-button"
                                        onClick={decreaseMonth}
                                        disabled={
                                            prevMonthButtonDisabled ||
                                            (currentYear === 2024 &&
                                                currentMonth === 9)
                                        }
                                    >
                                        {"<"}
                                    </button>
                                </Col>
                                <Col xs={3}>
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
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </Col>
                                <Col xs={3}>
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
                                <Col xs={1}>
                                    <button
                                        className="icon-button"
                                        onClick={increaseMonth}
                                        disabled={nextMonthButtonDisabled}
                                    >
                                        {">"}
                                    </button>
                                </Col>
                            </Row>
                        </Container>
                    );
                }}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<Form.Control type="text" readOnly={true} />}
                minDate={new Date("2024-10-02")}
                maxDate={new Date()}
            />
        </InputGroup>
    );
}
