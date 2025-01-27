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
        setSalarySort("idAsc");
        const formattedYearMonth = `${selectedYear}-${selectedMonth}`;
        setYearMonth(formattedYearMonth);
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
            <Container className="mb-4"></Container>
        </>
    );
}

export default SalaryListSearchBox;
