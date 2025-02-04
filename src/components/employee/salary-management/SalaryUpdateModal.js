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
import ConfirmModal from "../../modals/ConfirmModal";
import AlertModal from "../../modals/AlertModal";
import { SingleDatePicker } from "../../../util/CustomDatePicker";
import Loader from "../../../util/Loader";
import {
    requestSalary,
    requestAttendanceList,
    requestSalaryDuplicateCheck,
    requestUpdateSalary,
} from "../../../servers/employServer";
import { formatCurrency, dateFormatter } from "../../../util/formatter";

function SalaryUpdateModal(props) {
    const {
        showSalaryUpdateModal,
        handleCloseSalaryUpdateModal,
        selectedSalaryId,
        attendanceStatusList,
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
    const [prevData, setPrevData] = useState({});
    const [employeeName, setEmployeeName] = useState("");
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

    useEffect(() => {
        if (showSalaryUpdateModal) {
            const fetchData = async (selectedSalaryId) => {
                setLoading(true);
                try {
                    const response = await requestSalary({
                        salaryId: selectedSalaryId,
                    });
                    if (response.result !== "SU") {
                        setAlertTitle("오류");
                        setAlertText("데이터 요청에 실패했습니다.");
                        setShowAlertModal(true);
                        handleCloseSalaryUpdateModal();
                    } else {
                        setPrevData(response.responseData);
                        setEmployeeName(response.responseData.employeeName);
                        setSalaryPeriodDateStart(
                            response.responseData.salaryPeriodDateStart
                        );
                        setSalaryPeriodDateEnd(
                            response.responseData.salaryPeriodDateEnd
                        );
                        const [year, month] =
                            response.responseData.salaryPeriodDateStart.split(
                                "-"
                            );
                        setSelectedYear(year);
                        setSelectedMonth(month);
                        setSalaryPaymentDate(
                            response.responseData.salaryPaymentDate
                        );
                        setCommuteDays(response.responseData.commuteDays);
                        setLateCommuteDays(
                            response.responseData.lateCommuteDays
                        );
                        setEarlyDepartureDays(
                            response.responseData.earlyDepartureDays
                        );
                        setCombinedLateEarlyDays(
                            response.responseData.combinedLateEarlyDays
                        );
                        setAbsentDays(response.responseData.absentDays);
                        setPaidBasicSalary(
                            response.responseData.paidBasicSalary
                        );
                        setFormattedBasicSalary(
                            formatCurrency(
                                response.responseData.paidBasicSalary
                            )
                        );
                        setPaidIncentiveSalary(
                            response.responseData.paidIncentiveSalary
                        );
                        setFormattedIncentiveSalary(
                            formatCurrency(
                                response.responseData.paidIncentiveSalary
                            )
                        );
                        setPaidBonusSalary(
                            response.responseData.paidBonusSalary
                        );
                        setFormattedBonusSalary(
                            formatCurrency(
                                response.responseData.paidBonusSalary
                            )
                        );
                    }
                } catch (error) {
                    console.error("데이터 요청 중 오류 발생:", error);
                    setAlertTitle("오류");
                    setAlertText("데이터 요청에 실패했습니다.");
                    setShowAlertModal(true);
                    handleCloseSalaryUpdateModal();
                } finally {
                    setLoading(false);
                }
            };
        }
    }, [showSalaryUpdateModal, selectedSalaryId, handleCloseSalaryUpdateModal]);

    useEffect(() => {
        setTotalSalary(
            formatCurrency(
                paidBasicSalary + paidIncentiveSalary + paidBonusSalary
            )
        );
    }, [paidBasicSalary, paidIncentiveSalary, paidBonusSalary]);
}

export default SalaryUpdateModal;
