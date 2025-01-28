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

function SalaryListSearchBox(props) {
    const {
        yearMonth,
        setYearMonth,
        salaryList,
        setFilteredSalaryList,
        setSalarySort,
    } = props;

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

    const [searchOrder, setSearchOrder] = useState("employeeName");
    const [searching, setSearching] = useState(false);

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);

        if (year === "2024") {
            setSelectedMonth("11");
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
        const startMonth = selectedYear === "2024" ? 11 : 1;
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
        setSalarySort("idAsc");
        const formattedYearMonth = `${selectedYear}-${selectedMonth}`;
        setYearMonth(formattedYearMonth);
    };

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSearchOrder(selectedValue);
        handleResetSearch();
    };

    const handleSearch = () => {
        setSalarySort("idAsc");
        setFilteredSalaryList(salaryList);
        const searchValue = searchWordRef.current.value.toLowerCase();
        setSearching(true);

        let filteredList;

        filteredList = salaryList.filter((data) => {
            return (
                (searchOrder === "employeeName" &&
                    data.employeeName.toLowerCase().includes(searchValue)) ||
                (searchOrder === "employeeNumber" &&
                    data.employeeNumber.toLowerCase().includes(searchValue))
            );
        });

        setFilteredSalaryList(filteredList);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key !== "Enter") return;
        handleSearch();
    };

    const handleResetSearch = () => {
        setSalarySort("idAsc");
        setFilteredSalaryList(salaryList);
        setSearching(false);
        searchWordRef.current.value = "";
    };

    return (
        <>
            <Container className="mb-4">
                {searching && (
                    <Alert variant="primary" className="font-weight-bold h5">
                        {`${
                            searchOrder === "employeeName"
                                ? "이름"
                                : searchOrder === "employeeNumber"
                                ? "사번"
                                : ""
                        }
             : ${searchWordRef.current.value}`}
                    </Alert>
                )}
            </Container>
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
                                <Form.Select
                                    value={searchOrder}
                                    onChange={handleSelectChange}
                                >
                                    <option value="employeeName">
                                        {"이름"}
                                    </option>
                                    <option value="employeeNumber">
                                        {"사번"}
                                    </option>
                                </Form.Select>
                            </Col>
                            <Col xs={8}>
                                <Form.Control
                                    type="text"
                                    ref={searchWordRef}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder={
                                        "조회하신 날짜 범위 내에서 검색 가능합니다. "
                                    }
                                />
                            </Col>
                            <Col xs={1}>
                                <Button
                                    variant="primary"
                                    onClick={handleSearch}
                                >
                                    {"검색"}
                                </Button>
                            </Col>
                            {searching && ( // 검색 중일 때만 초기화 버튼 보여줌
                                <Col xs={1}>
                                    <Button
                                        variant="danger"
                                        onClick={handleResetSearch}
                                    >
                                        {"초기화"}
                                    </Button>
                                </Col>
                            )}
                        </InputGroup>
                    </Row>
                </Form.Group>
            </Container>
        </>
    );
}

export default SalaryListSearchBox;
