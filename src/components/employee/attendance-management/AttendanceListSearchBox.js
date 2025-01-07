import { useRef, useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    InputGroup,
    Alert,
} from "react-bootstrap";

function AttendanceListSearchBox(props) {
    const { yearMonth, setYearMonth, attendanceStatusList } = props;

    const searchWordRef = useRef(null);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const initialYear = yearMonth
        ? yearMonth.slice(0, 4)
        : currentYear.toString();
    const initialMonth = yearMonth
        ? yearMonth.slice(5, 7)
        : currentMonth.toString().padStart(2, "0");

    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);

    const [searchOrder, setSearchOrder] = useState("keyWord");

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);

        if (year === "2024") {
            setSelectedMonth("10");
        } else {
            setSelectedMonth("01");
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const generateYearOptions = () => {
        return Array.from(
            { length: currentYear - 2024 + 1 },
            (_, index) => 2024 + index
        ).map((year) => (
            <option key={year} value={year}>
                {`${year}년`}
            </option>
        ));
    };

    const generateMonthOptions = () => {
        const startMonth = selectedYear === "2024" ? 10 : 1;
        let totalMonths;

        if (selectedYear === currentYear.toString()) {
            totalMonths = currentMonth - startMonth + 1;
        } else {
            totalMonths = 12 - startMonth + 1;
        }

        return Array.from(
            { length: totalMonths },
            (_, index) => startMonth + index
        ).map((month) => {
            const formattedMonth = month.toString().padStart(2, "0");
            return (
                <option key={formattedMonth} value={formattedMonth}>
                    {`${month}월`}
                </option>
            );
        });
    };

    const handleRetrieveData = () => {
        const formattedYearMonth = `${selectedYear}-${selectedMonth}`;
        setYearMonth(formattedYearMonth);
    };

    return (
        <>
            <Container className="mb-4">
                <Form.Group className="mb-3">
                    <Row className="mt-3">
                        <InputGroup>
                            <Col xs={2}>
                                <Form.Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                >
                                    {generateYearOptions()}
                                </Form.Select>
                            </Col>
                            <Col xs={2}>
                                <Form.Select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                >
                                    {generateMonthOptions()}
                                </Form.Select>
                            </Col>
                            <Col xs={1}>
                                <Button
                                    variant="success"
                                    onClick={handleRetrieveData}
                                >
                                    {"조회"}
                                </Button>
                            </Col>
                        </InputGroup>
                    </Row>
                    <Row className="mt-3">
                        <InputGroup>
                            <Col xs={2}>
                                <Form.Select value={searchOrder}>
                                    <option value="keyWord">{"키워드"}</option>
                                    <option value="employeeName">
                                        {"이름"}
                                    </option>
                                    <option value="employeeNumber">
                                        {"사번"}
                                    </option>
                                </Form.Select>
                            </Col>
                            <Col xs={8}>
                                <Form.Control type="text" ref={searchWordRef} />
                            </Col>
                            <Col xs={1}>
                                <Button variant="primary">{"검색"}</Button>
                            </Col>
                        </InputGroup>
                    </Row>
                </Form.Group>
            </Container>
        </>
    );
}

export default AttendanceListSearchBox;
