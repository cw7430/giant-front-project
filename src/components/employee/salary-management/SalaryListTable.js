import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import CustomPagination from "../../../util/CustomPagination";
import { sortNumber, sortCode } from "../../../util/sort";
import {
    CaretUp,
    CaretUpFill,
    CaretDown,
    CaretDownFill,
} from "../../../assets/svg/Svgs";

const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
};

const formatDateToYearMonth = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // 유효하지 않은 날짜 처리
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
    )}`;
};

function SalaryListTable(props) {
    const {
        filteredSalaryList,
        setFilteredSalaryList,
        salarySort,
        setSalarySort,
    } = props;

    const [pagedData, setPagedData] = useState(filteredSalaryList);

    const handleSortChange = (sortKey) => {
        setSalarySort(sortKey);

        let sortedList = [];
        switch (sortKey) {
            case "idAsc":
                sortedList = sortNumber([...filteredSalaryList], "id", "asc");
                break;
            case "idDesc":
                sortedList = sortNumber([...filteredSalaryList], "id", "desc");
                break;
            case "employeeNumberAsc":
                sortedList = sortCode(
                    [...filteredSalaryList],
                    "employeeNumber",
                    "asc"
                );
                break;
            case "employeeNumberDesc":
                sortedList = sortCode(
                    [...filteredSalaryList],
                    "employeeNumber",
                    "desc"
                );
                break;
            case "salaryAsc":
                sortedList = sortNumber(
                    [...filteredSalaryList],
                    "totalSalary",
                    "asc"
                );
                break;
            case "salaryDesc":
                sortedList = sortNumber(
                    [...filteredSalaryList],
                    "totalSalary",
                    "desc"
                );
                break;
            default:
                sortedList = sortNumber([...filteredSalaryList], "id", "asc");
        }
        setFilteredSalaryList(sortedList);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Table bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th className="text-center">
                                    {"번호"}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("idAsc")
                                        }
                                    >
                                        {salarySort === "idAsc" ? (
                                            <CaretUpFill />
                                        ) : (
                                            <CaretUp />
                                        )}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("idDesc")
                                        }
                                    >
                                        {salarySort === "idDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">
                                    {"사번"}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange(
                                                "employeeNumberAsc"
                                            )
                                        }
                                    >
                                        {salarySort === "employeeNumberAsc" ? (
                                            <CaretUpFill />
                                        ) : (
                                            <CaretUp />
                                        )}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange(
                                                "employeeNumberDesc"
                                            )
                                        }
                                    >
                                        {salarySort === "employeeNumberDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">{"이름"}</th>
                                <th className="text-center">{"출근일수"}</th>
                                <th className="text-center">
                                    {"최종급여"}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("salaryAsc")
                                        }
                                    >
                                        {salarySort === "salaryAsc" ? (
                                            <CaretUpFill />
                                        ) : (
                                            <CaretUp />
                                        )}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("salaryDesc")
                                        }
                                    >
                                        {salarySort === "salaryDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">{"산정기간"}</th>
                                <th className="text-center">{"지급일"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedData.map((salary) => (
                                <tr
                                    key={salary.salaryId}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{salary.id}</td>
                                    <td>{salary.employeeNumber}</td>
                                    <td>{salary.employeeName}</td>
                                    <td className="text-end">
                                        {`${
                                            salary.commuteDays +
                                            salary.lateCommuteDays +
                                            salary.earlyDepartureDays
                                        }일`}
                                    </td>
                                    <td className="text-end">
                                        {formatCurrency(salary.totalSalary)}
                                    </td>
                                    <td className="text-end">
                                        {formatDateToYearMonth(
                                            salary.salaryPeriodDateStart
                                        )}
                                    </td>
                                    <td className="text-end">
                                        {salary.salaryPaymentDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md="auto">
                    <CustomPagination
                        data={filteredSalaryList}
                        itemsPerPage={10}
                        pageBlockSize={5}
                        setPagedData={setPagedData}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default SalaryListTable;
