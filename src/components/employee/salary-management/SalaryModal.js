import { useCallback, useEffect, useState } from "react";
import {
    Modal,
    Form,
    FloatingLabel,
    Button,
    InputGroup,
    Row,
    Col,
} from "react-bootstrap";
import SearchEmployeeModal from "../SearchEmplyeeModal";
import ConfirmModal from "../../modals/ConfirmModal";
import AlertModal from "../../modals/AlertModal";
import { SingleDatePicker } from "../../../util/CustomDatePicker";
import Loader from "../../../util/Loader";
import { requestAttendanceList } from "../../../servers/employServer";
import { formatCurrency, dateFormatter } from "../../../util/formatter";

function SalaryModal(props) {
    const {
        showSalaryModal,
        handleCloseSalaryModal,
        yearMonth,
        existingEmployeeList,
        classList,
        updateData,
    } = props;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const initialYear = yearMonth
        ? yearMonth.slice(0, 4)
        : currentYear.toString();
    const initialMonth = yearMonth
        ? yearMonth.slice(5, 7)
        : currentMonth.toString().padStart(2, "0");

    const [loading, setLoading] = useState(false);
    const [showSearchEmployeeModal, setShowSearchEmployeeModal] =
        useState(false);
    const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState("");
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [isCalculated, setIsCalculated] = useState(false);
    const [salaryPeriodDateStart, setSalaryPeriodDateStart] = useState("");
    const [salaryPeriodDateEnd, setSalaryPeriodDateEnd] = useState("");
    const [salaryPaymentDate, setSalaryPaymentDate] = useState(new Date());
    const [commuteDays, setCommuteDays] = useState(0);
    const [lateCommuteDays, setLateCommuteDays] = useState(0);
    const [earlyDepartureDays, setEarlyDepartureDays] = useState(0);
    const [combinedLateEarlyDays, setCombinedLateEarlyDays] = useState(0);
    const [absentDays, setAbsentDays] = useState(0);
    const [paidBasicSalary, setPaidBasicSalary] = useState(0);
    const [formattedBasicSalary, setFormattedBasicSalary] = useState("0");
    const [paidIncentiveSalary, setPaidIncentiveSalary] = useState(0);
    const [formattedIncentiveSalary, setFormattedIncentiveSalary] = useState("0");
    const [paidBonusSalary, setPaidBonusSalary] = useState(0);

    const [employeeNumberError, setEmployeeNumberError] = useState(false);
    const [employeeNumberErrorMessage, setEmployeeNumberErrorMessage] =
        useState("");
    const [commuteDateError, setCommuteDateError] = useState(false);
    const [commuteDateErrorMessage, setCommuteDateErrorMessage] = useState("");

    const handleShowSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(true);

    const handleCloseSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(false);

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

    const handleCalculateSalary = async () => {
        if (!selectedEmployeeNumber) {
            setEmployeeNumberError(true);
            setEmployeeNumberErrorMessage("사번을 먼저 선택하여주세요.");
            setIsCalculated(false);
            return;
        }

        if (selectedEmployeeNumber) {
            setEmployeeNumberError(false);
            setEmployeeNumberErrorMessage("");
        }

        setLoading(true);
        try {
            const response = await requestAttendanceList({
                searchOrder: "employeeNumber",
                commuteDate: `${selectedYear}-${selectedMonth}`,
                employeeNumber: selectedEmployeeNumber,
            });

            if (response.result === "SE") {
                setCommuteDateError(true);
                setCommuteDateErrorMessage(
                    "서버에 문제가 있습니다. 나중에 다시 시도해주세요."
                );
                setIsCalculated(false);
                return;
            }

            setCommuteDateError(false);
            setCommuteDateErrorMessage("");
            const attendanceData = response.responseData;

            // 1. paidBasicSalary 계산
            const uniqueBasicSalaries = new Set(
                attendanceData.map((item) => item.basicSalary)
            );
            if (uniqueBasicSalaries.size > 1) {
                setCommuteDateError(true);
                setCommuteDateErrorMessage(
                    "데이터에 문제가 있습니다. 관리자에게 문의해주세요."
                );
                return;
            }

            setCommuteDateError(false);
            setCommuteDateErrorMessage("");
            const basicSalary = uniqueBasicSalaries.values().next().value;
            setPaidBasicSalary(basicSalary);
            setFormattedBasicSalary(formatCurrency(basicSalary));

            // 2. salaryPeriodDateStart 계산
            const minCommuteDate = attendanceData.reduce(
                (min, item) =>
                    item.commuteDate < min ? item.commuteDate : min,
                attendanceData[0].commuteDate
            );
            setSalaryPeriodDateStart(minCommuteDate);

            // 3. salaryPeriodDateEnd 계산
            const maxCommuteDate = attendanceData.reduce(
                (max, item) =>
                    item.commuteDate > max ? item.commuteDate : max,
                attendanceData[0].commuteDate
            );
            setSalaryPeriodDateEnd(maxCommuteDate);

            // 4. commuteDays 계산
            const commuteDaysCount = attendanceData.filter(
                (item) => item.attendanceStatusCode === "ATD01"
            ).length;
            setCommuteDays(commuteDaysCount);

            // 5. lateCommuteDays 계산
            const lateCommuteDaysCount = attendanceData.filter(
                (item) => item.attendanceStatusCode === "ATD02"
            ).length;
            setLateCommuteDays(lateCommuteDaysCount);

            // 6. earlyDepartureDays 계산
            const earlyDepartureDaysCount = attendanceData.filter(
                (item) => item.attendanceStatusCode === "ATD03"
            ).length;
            setEarlyDepartureDays(earlyDepartureDaysCount);

            // 7. combinedLateEarlyDays 계산
            const combinedLateEarlyDaysCount = attendanceData.filter(
                (item) => item.attendanceStatusCode === "ATD04"
            ).length;
            setCombinedLateEarlyDays(combinedLateEarlyDaysCount);

            // 8. absentDays 계산
            const absentDaysCount = attendanceData.filter(
                (item) => item.attendanceStatusCode === "ATD05"
            ).length;
            setAbsentDays(absentDaysCount);

            // 9. paidIncentiveSalary 계산
            const totalIncentiveSalary = attendanceData.reduce((sum, item) => {
                const incentiveSalary =
                    Math.ceil(
                        (item.incentiveSalary * item.incentiveSalaryRate) /
                            100 /
                            10
                    ) * 10; // 올림 처리
                return sum + incentiveSalary;
            }, 0);
            setPaidIncentiveSalary(totalIncentiveSalary);
            setFormattedIncentiveSalary(formatCurrency(totalIncentiveSalary));

            setIsCalculated(true);
        } catch (error) {
            console.error(error);
            setIsCalculated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = useCallback(() => {
        setSelectedYear(initialYear);
        setSelectedMonth(initialMonth);
        setIsCalculated(false);
        setSalaryPeriodDateStart("");
        setSalaryPeriodDateEnd("");
        setSalaryPaymentDate(new Date());
        setCommuteDays(0);
        setLateCommuteDays(0);
        setEarlyDepartureDays(0);
        setCombinedLateEarlyDays(0);
        setAbsentDays(0);
        setPaidBasicSalary(0);
        setFormattedBasicSalary("0");
        setPaidIncentiveSalary(0);
        setFormattedIncentiveSalary("0");
        setPaidBonusSalary(0);
        setEmployeeNumberError(false);
        setEmployeeNumberErrorMessage("");
        setCommuteDateError(false);
        setCommuteDateErrorMessage("");
    }, [initialYear, initialMonth]);

    useEffect(() => {
        if (!showSalaryModal) {
            setSelectedEmployeeNumber("");
            handleReset();
        }
    }, [showSalaryModal, handleReset]);

    useEffect(() => {
        if (selectedEmployeeNumber) {
            handleReset();
        }
    }, [selectedEmployeeNumber, handleReset]);

    return (
        <>
            <Modal
                backdrop="static"
                show={showSalaryModal}
                onHide={handleCloseSalaryModal}
            >
                <Modal.Header>
                    <Modal.Title>{"급여 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3 mb-3">
                        <Form.Label htmlFor="employeeNumber">
                            {"사번"}
                        </Form.Label>
                        <InputGroup>
                            <Col xs={6}>
                                <Form.Control
                                    type="text"
                                    id="employeeNumber"
                                    value={selectedEmployeeNumber}
                                    onChange={(e) =>
                                        setSelectedEmployeeNumber(
                                            e.target.value
                                        )
                                    }
                                    readOnly={true}
                                />
                            </Col>
                            <Col xs={2}>
                                <Button
                                    variant="primary"
                                    onClick={handleShowSearchEmployeeModal}
                                >
                                    {"검색"}
                                </Button>
                            </Col>
                        </InputGroup>
                    </Form.Group>
                    {employeeNumberError && (
                        <Form.Group>
                            <Form.Text className="text-error">
                                {employeeNumberErrorMessage}
                            </Form.Text>
                        </Form.Group>
                    )}
                    <Form.Group className="mt-3 mb-3">
                        <Form.Label htmlFor="commuteDate">
                            {"근태조회"}
                        </Form.Label>
                        <InputGroup id="commuteDate">
                            <Col xs={3}>
                                <Form.Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                >
                                    {generateYearOptions()}
                                </Form.Select>
                            </Col>
                            <Col xs={3}>
                                <Form.Select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                >
                                    {generateMonthOptions()}
                                </Form.Select>
                            </Col>
                            <Col xs={2}>
                                <Button
                                    variant="success"
                                    onClick={handleCalculateSalary}
                                >
                                    {"조회"}
                                </Button>
                            </Col>
                        </InputGroup>
                    </Form.Group>
                    {commuteDateError && (
                        <Form.Group>
                            <Form.Text className="text-error">
                                {commuteDateErrorMessage}
                            </Form.Text>
                        </Form.Group>
                    )}
                    {loading && <Loader />}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="salaryPeriod">
                            {"기간"}
                        </Form.Label>
                        <Row id="salaryPeriod">
                            <Col>
                                <Form.Control
                                    type="text"
                                    id="salaryPeriodDateStart"
                                    value={salaryPeriodDateStart}
                                    onChange={(e) =>
                                        setSalaryPeriodDateStart(e.target.value)
                                    }
                                    readOnly={true}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    id="salaryPeriodDateEnd"
                                    value={salaryPeriodDateEnd}
                                    onChange={(e) =>
                                        setSalaryPeriodDateEnd(e.target.value)
                                    }
                                    readOnly={true}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="attendance">
                            {"근태상황"}
                        </Form.Label>
                        <Row id="attendance">
                            <Col>
                                <FloatingLabel
                                    controlId="commuteDays"
                                    label="정상"
                                >
                                    <Form.Control
                                        type="text"
                                        id="commuteDays"
                                        value={commuteDays}
                                        onChange={(e) =>
                                            setCommuteDays(e.target.value)
                                        }
                                        readOnly={true}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel
                                    controlId="lateCommuteDays"
                                    label="지각"
                                >
                                    <Form.Control
                                        type="text"
                                        id="lateCommuteDays"
                                        value={
                                            lateCommuteDays +
                                            combinedLateEarlyDays
                                        }
                                        onChange={(e) =>
                                            setLateCommuteDays(e.target.value)
                                        }
                                        readOnly={true}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel
                                    controlId="earlyDepartureDays"
                                    label="조퇴"
                                >
                                    <Form.Control
                                        type="text"
                                        id="earlyDepartureDays"
                                        value={
                                            earlyDepartureDays +
                                            combinedLateEarlyDays
                                        }
                                        onChange={(e) =>
                                            setEarlyDepartureDays(
                                                e.target.value
                                            )
                                        }
                                        readOnly={true}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel
                                    controlId="absentDays"
                                    label="결근"
                                >
                                    <Form.Control
                                        type="text"
                                        id="absentDays"
                                        value={absentDays}
                                        onChange={(e) =>
                                            setAbsentDays(e.target.value)
                                        }
                                        readOnly={true}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseSalaryModal}>
                        {"등록"}
                    </Button>
                    <Button variant="danger" onClick={handleCloseSalaryModal}>
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <SearchEmployeeModal
                view={"single"}
                showSearchEmployeeModal={showSearchEmployeeModal}
                handleCloseSearchEmployeeModal={handleCloseSearchEmployeeModal}
                existingEmployeeList={existingEmployeeList}
                setSelectedEmployeeNumber={setSelectedEmployeeNumber}
                classList={classList}
                selectedEmployeeList={[]}
            />
        </>
    );
}

export default SalaryModal;
