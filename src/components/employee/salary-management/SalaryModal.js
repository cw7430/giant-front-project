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
import {
    requestAttendanceList,
    requestSalaryDuplicateCheck,
    requestRegisterSalary,
} from "../../../servers/employServer";
import { formatCurrency, dateFormatter } from "../../../util/formatter";

function SalaryModal(props) {
    const {
        showSalaryModal,
        handleCloseSalaryModal,
        existingEmployeeList,
        classList,
        updateData,
    } = props;

    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const maxYear = prevMonthDate.getFullYear();
    const maxMonth = prevMonthDate.getMonth() + 1;
    const yearMonth = `${prevMonthDate.getFullYear()}-${String(
        prevMonthDate.getMonth() + 1
    ).padStart(2, "0")}`;

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
    const [formattedIncentiveSalary, setFormattedIncentiveSalary] =
        useState("0");
    const [paidBonusSalary, setPaidBonusSalary] = useState(0);
    const [formattedBonusSalary, setFormattedBonusSalary] = useState("0");
    const [totalSalary, setTotalSalary] = useState("0");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [employeeNumberError, setEmployeeNumberError] = useState(false);
    const [employeeNumberErrorMessage, setEmployeeNumberErrorMessage] =
        useState("");
    const [commuteDateError, setCommuteDateError] = useState(false);
    const [commuteDateErrorMessage, setCommuteDateErrorMessage] = useState("");

    const handleShowSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(true);

    const handleCloseSearchEmployeeModal = () =>
        setShowSearchEmployeeModal(false);

    const handleShowConfirmModal = () => setShowConfirmModal(true);

    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        updateData(`${currentYear}-${currentMonth}`);
    };

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
            { length: maxYear - 2024 + 1 },
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

        if (selectedYear === maxYear.toString()) {
            totalMonths = maxMonth - startMonth + 1;
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

    const handleBonusSalaryChange = (e) => {
        let value = e.target.value.replace(/,/g, ""); // 입력된 값에서 , 제거
        if (!isNaN(value) && value !== "") {
            const numericValue = parseInt(value, 10);
            setPaidBonusSalary(numericValue);
            setFormattedBonusSalary(formatCurrency(numericValue));
        } else {
            setPaidBonusSalary(0);
            setFormattedBonusSalary("0");
        }
    };

    const handleReset = useCallback(() => {
        setSelectedYear(initialYear);
        setSelectedMonth(initialMonth);
        setIsCalculated(false);
        setSalaryPeriodDateStart("");
        setSalaryPeriodDateEnd("");
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
        setTotalSalary(0);
        setError(false);
        setErrorMessage("");
        setEmployeeNumberError(false);
        setEmployeeNumberErrorMessage("");
        setCommuteDateError(false);
        setCommuteDateErrorMessage("");
    }, [initialYear, initialMonth]);

    useEffect(() => {
        if (!showSalaryModal) {
            setSalaryPaymentDate(new Date());
            setSelectedEmployeeNumber("");
            handleReset();
        }
    }, [showSalaryModal, handleReset]);

    useEffect(() => {
        if (selectedEmployeeNumber) {
            handleReset();
        }
    }, [selectedEmployeeNumber, handleReset]);

    useEffect(() => {
        setTotalSalary(
            formatCurrency(
                paidBasicSalary + paidIncentiveSalary + paidBonusSalary
            )
        );
    }, [paidBasicSalary, paidIncentiveSalary, paidBonusSalary]);

    const handleSubmit = async () => {
        handleCloseConfirmModal();

        if (!selectedEmployeeNumber) {
            setEmployeeNumberError(true);
            setEmployeeNumberErrorMessage("사번을 선택하여주세요.");
            setCommuteDateError(true);
            setCommuteDateErrorMessage("근태정보를 조회해주세요.");
            return;
        }

        if (selectedEmployeeNumber) {
            setEmployeeNumberError(false);
            setEmployeeNumberErrorMessage("");
        }

        if (!isCalculated) {
            setCommuteDateError(true);
            setCommuteDateErrorMessage("근태정보를 조회해주세요.");
            return;
        }

        if (isCalculated) {
            setCommuteDateError(false);
            setEmployeeNumberErrorMessage("");
        }

        const salaryData = {
            employeeNumber: selectedEmployeeNumber,
            salaryPeriodDateStart: salaryPeriodDateStart,
            salaryPeriodDateEnd: salaryPeriodDateEnd,
            salaryPaymentDate: dateFormatter(salaryPaymentDate),
            commuteDays: commuteDays,
            lateCommuteDays: lateCommuteDays,
            earlyDepartureDays: earlyDepartureDays,
            combinedLateEarlyDays: combinedLateEarlyDays,
            absentDays: absentDays,
            paidBasicSalary: paidBasicSalary,
            paidIncentiveSalary: paidIncentiveSalary,
            paidBonusSalary: paidBonusSalary,
        };

        const duplicateResponse = await requestSalaryDuplicateCheck(salaryData);

        if (duplicateResponse.result === "DP") {
            setError(true);
            setErrorMessage("중복된 요청입니다.");
            return;
        }

        if (duplicateResponse.result === "SE") {
            setError(true);
            setErrorMessage("등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            return;
        }

        if (duplicateResponse.result === "SU") {
            setError(false);
            setErrorMessage("");
        }

        const registerResponse = await requestRegisterSalary(salaryData);

        if (registerResponse.result === "SE") {
            setError(true);
            setErrorMessage("등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            return;
        }

        if (registerResponse.result === "SU") {
            setError(false);
            setErrorMessage("");
            setAlertTitle("등록완료");
            setAlertText("급여 등록을 완료하였습니다.");
            setShowAlertModal(true);
            handleCloseSalaryModal();
        }
    };

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
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="datePicker">{"지급일"}</Form.Label>
                        <SingleDatePicker
                            id="datePicker"
                            selectedDate={salaryPaymentDate}
                            onDateChange={setSalaryPaymentDate}
                            minDate="2024-11-01"
                        />
                    </Form.Group>
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
                        <Form.Label htmlFor="salaryPeriod">{"기간"}</Form.Label>
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
                                    disabled={!isCalculated}
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
                                    disabled={!isCalculated}
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
                                        value={commuteDays}
                                        onChange={(e) =>
                                            setCommuteDays(e.target.value)
                                        }
                                        readOnly={true}
                                        disabled={!isCalculated}
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
                                        value={
                                            lateCommuteDays +
                                            combinedLateEarlyDays
                                        }
                                        onChange={(e) =>
                                            setLateCommuteDays(e.target.value)
                                        }
                                        readOnly={true}
                                        disabled={!isCalculated}
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
                                        disabled={!isCalculated}
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
                                        value={absentDays}
                                        onChange={(e) =>
                                            setAbsentDays(e.target.value)
                                        }
                                        readOnly={true}
                                        disabled={!isCalculated}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Row>
                            <Col xs={7}>
                                <Form.Label htmlFor="salary">
                                    {"급여"}
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Text className="text-info">
                                    {"*보너스는 직접 입력하세요."}
                                </Form.Text>
                            </Col>
                        </Row>
                        <Row id="salary" className="mb-3">
                            <Col>
                                <FloatingLabel
                                    controlId="basicSalary"
                                    label="기본급"
                                >
                                    <Form.Control
                                        type="text"
                                        value={formattedBasicSalary}
                                        onChange={(e) =>
                                            setFormattedBasicSalary(
                                                e.target.value
                                            )
                                        }
                                        readOnly={true}
                                        disabled={!isCalculated}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel
                                    controlId="incentiveSalary"
                                    label="성과급"
                                >
                                    <Form.Control
                                        type="text"
                                        value={formattedIncentiveSalary}
                                        onChange={(e) =>
                                            setFormattedIncentiveSalary(
                                                e.target.value
                                            )
                                        }
                                        readOnly={true}
                                        disabled={!isCalculated}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel
                                    controlId="bonusSalary"
                                    label="보너스"
                                >
                                    <Form.Control
                                        type="text"
                                        value={formattedBonusSalary}
                                        onChange={handleBonusSalaryChange}
                                        disabled={!isCalculated}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FloatingLabel
                                    controlId="totalSalary"
                                    label="총액"
                                >
                                    <Form.Control
                                        type="text"
                                        value={totalSalary}
                                        readOnly={true}
                                        disabled={!isCalculated}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        {error && (
                            <Form.Text className="text-error">
                                {errorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleShowConfirmModal}>
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
            <ConfirmModal
                showConfirmModal={showConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
                handleConfirm={handleSubmit}
                confirmTitle={"확인"}
                confirmText={`${dateFormatter(
                    salaryPaymentDate
                )} 급여 정보를 등록하시겠습니까?`}
            />
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </>
    );
}

export default SalaryModal;
