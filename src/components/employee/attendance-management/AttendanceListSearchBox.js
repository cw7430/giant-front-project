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
    const {
        yearMonth,
        setYearMonth,
        attendanceList,
        setFilteredAttendanceList,
        attendanceStatusList,
        setAttendanceSort,
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

    const [searchOrder, setSearchOrder] = useState("keyWord");
    const [readOnly, setReadOnly] = useState(true);
    const [checkedKeywords, setCheckedKeywords] = useState({});
    const [allIncluded, setAllIncluded] = useState(false);
    const [searching, setSearching] = useState(false);

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
        setAttendanceSort("idAsc");
        const formattedYearMonth = `${selectedYear}-${selectedMonth}`;
        setYearMonth(formattedYearMonth);
    };

    const keywords = attendanceStatusList.filter(
        (keyword) => keyword.attendanceStatusCode !== "ATD04"
    );

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSearchOrder(selectedValue);
        setReadOnly(selectedValue === "keyWord");
        handleResetSearch();
    };

    const handleAllIncludedChange = () => {
        setAllIncluded(!allIncluded);
        const newCheckedKeywords = {};
        keywords.forEach((keyword) => {
            newCheckedKeywords[keyword.attendanceStatusCode] = !allIncluded;
        });
        setCheckedKeywords(newCheckedKeywords);
        updateSearchWord(newCheckedKeywords);
    };

    const handleKeywordChange = (attendanceStatusCode) => {
        const newCheckedKeywords = {
            ...checkedKeywords,
            [attendanceStatusCode]: !checkedKeywords[attendanceStatusCode],
        };
        setCheckedKeywords(newCheckedKeywords);
        setAllIncluded(Object.values(newCheckedKeywords).every(Boolean)); // 모두 체크된 상태 확인
        updateSearchWord(newCheckedKeywords);
    };

    const updateSearchWord = (newCheckedKeywords) => {
        const selectedKeywords = Object.keys(newCheckedKeywords).filter(
            (key) => newCheckedKeywords[key]
        );
        const selectedKeywordNames = keywords
            .filter((keyword) =>
                selectedKeywords.includes(keyword.attendanceStatusCode)
            )
            .map((keyword) => keyword.attendanceStatusName);
        searchWordRef.current.value = selectedKeywordNames.join(" "); // 공백으로 연결
    };

    const handleSearch = () => {
        setAttendanceSort("idAsc");
        setFilteredAttendanceList(attendanceList);
        const searchValue = searchWordRef.current.value.toLowerCase();
        setSearching(true);

        let filteredList;

        if (searchOrder === "keyWord") {
            // 체크된 attendanceStatusCode 필터링
            const selectedCodes = Object.keys(checkedKeywords).filter(
                (code) => checkedKeywords[code]
            );

            // "ATD02" 또는 "ATD03"이 선택되면 "ATD04"를 포함
            if (
                selectedCodes.includes("ATD02") ||
                selectedCodes.includes("ATD03")
            ) {
                if (!selectedCodes.includes("ATD04")) {
                    selectedCodes.push("ATD04");
                }
            }

            // 필터 조건에 따라 데이터 필터링
            filteredList = attendanceList.filter((data) =>
                selectedCodes.includes(data.attendanceStatusCode)
            );
        } else {
            filteredList = attendanceList.filter((data) => {
                if (searchOrder === "employeeName") {
                    return data.employeeName
                        .toLowerCase()
                        .includes(searchValue);
                }
                if (searchOrder === "employeeNumber") {
                    return data.employeeNumber
                        .toLowerCase()
                        .includes(searchValue);
                }
                return true;
            });
        }

        setFilteredAttendanceList(filteredList);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key !== "Enter") return;
        handleSearch();
    };

    const handleResetSearch = () => {
        setAttendanceSort("idAsc");
        setFilteredAttendanceList(attendanceList);
        setSearching(false);
        searchWordRef.current.value = "";
        setCheckedKeywords({});
        setAllIncluded(false);
    };

    return (
        <>
            <Container className="mb-4">
                {searching && (
                    <Alert variant="primary" className="font-weight-bold h5">
                        {`${
                            searchOrder === "keyWord"
                                ? "키워드"
                                : searchOrder === "employeeName"
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
                                <Form.Control
                                    type="text"
                                    ref={searchWordRef}
                                    readOnly={readOnly}
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
                    {searchOrder === "keyWord" && (
                        <>
                            <Row className="mt-3">
                                <Col xs="auto">
                                    <Form.Check
                                        type="checkbox"
                                        label="모두포함"
                                        checked={allIncluded}
                                        onChange={handleAllIncludedChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                {keywords.map((keyword) => (
                                    <Col
                                        xs="auto"
                                        key={keyword.attendanceStatusCode}
                                    >
                                        <Form.Check
                                            type="checkbox"
                                            label={keyword.attendanceStatusName}
                                            checked={
                                                checkedKeywords[
                                                    keyword.attendanceStatusCode
                                                ] || false
                                            }
                                            onChange={() =>
                                                handleKeywordChange(
                                                    keyword.attendanceStatusCode
                                                )
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Form.Group>
            </Container>
        </>
    );
}

export default AttendanceListSearchBox;
