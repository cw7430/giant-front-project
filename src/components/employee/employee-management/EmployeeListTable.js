import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Table } from "react-bootstrap";
import CustomPagination from "../../../util/CustomPagination";
import {
    CaretUp,
    CaretUpFill,
    CaretDown,
    CaretDownFill,
} from "../../../assets/svg/Svgs";
import { EMPLOYEE_PROFILE_PATH } from "../../../constant/url";
import { sortCode } from "../../../util/sort";

function EmployeeListTable(props) {
    const {
        filteredEmployeeList,
        setFilteredEmployeeList,
        employeeSort,
        setEmployeeSort,
    } = props;

    const handleSortChange = (sortKey) => {
        setEmployeeSort(sortKey);

        let sortedList = [];
        switch (sortKey) {
            case "employeeNumberAsc":
                sortedList = sortCode(
                    [...filteredEmployeeList],
                    "employeeNumber",
                    "asc"
                );
                break;
            case "employeeNumberDesc":
                sortedList = sortCode(
                    [...filteredEmployeeList],
                    "employeeNumber",
                    "desc"
                );
                break;
            case "departmentNumberAsc":
                sortedList = sortCode(
                    [...filteredEmployeeList],
                    "departmentNumber",
                    "asc"
                );
                break;
            case "departmentNumberDesc":
                sortedList = sortCode(
                    [...filteredEmployeeList],
                    "departmentNumber",
                    "desc"
                );
                break;
            case "classCodeAsc":
                sortedList = sortCode(
                    [...filteredEmployeeList],
                    "classCode",
                    "asc"
                );
                break;
            case "classCodeDesc":
                sortedList = sortCode(
                    [...filteredEmployeeList],
                    "classCode",
                    "desc"
                );
                break;
            default:
                sortedList = sortCode(
                    [...filteredEmployeeList],
                    "employeeNumber",
                    "asc"
                );
        }

        setFilteredEmployeeList(sortedList); // 상태 업데이트
    };

    const navigate = useNavigate();

    const [pagedData, setPagedData] = useState(filteredEmployeeList);

    const handleNavigateProfilePage = (employeeNumber) => {
        navigate(EMPLOYEE_PROFILE_PATH(employeeNumber));
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Table bordered hover>
                        <thead className="table-dark">
                            <tr>
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
                                        {employeeSort ===
                                        "employeeNumberAsc" ? (
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
                                        {employeeSort ===
                                        "employeeNumberDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">{"이름"}</th>
                                <th className="text-center">{"연락처"}</th>
                                <th className="text-center">
                                    {"부서"}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange(
                                                "departmentNumberAsc"
                                            )
                                        }
                                    >
                                        {employeeSort ===
                                        "departmentNumberAsc" ? (
                                            <CaretUpFill />
                                        ) : (
                                            <CaretUp />
                                        )}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange(
                                                "departmentNumberDesc"
                                            )
                                        }
                                    >
                                        {employeeSort ===
                                        "departmentNumberDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">
                                    {"직급"}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("classCodeAsc")
                                        }
                                    >
                                        {employeeSort === "classCodeAsc" ? (
                                            <CaretUpFill />
                                        ) : (
                                            <CaretUp />
                                        )}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("classCodeDesc")
                                        }
                                    >
                                        {employeeSort === "classCodeDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">{"등록일"}</th>
                                <th className="text-center">{"수정일"}</th>
                                <th className="text-center">{"재직여부"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedData.map((employee) => (
                                <tr
                                    key={employee.employeeNumber}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleNavigateProfilePage(
                                            employee.employeeNumber
                                        )
                                    }
                                >
                                    <td>{employee.employeeNumber}</td>
                                    <td>{employee.employeeName}</td>
                                    <td>{employee.telNumber}</td>
                                    <td>{employee.departmentName}</td>
                                    <td>{employee.className}</td>
                                    <td className="text-end">{employee.employeeRegisterDate}</td>
                                    <td className="text-end">{employee.employeeUpdateDate || ""}</td>
                                    <td className="text-center">{employee.employmentStatusName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md="auto">
                    <CustomPagination
                        data={filteredEmployeeList}
                        itemsPerPage={10}
                        pageBlockSize={5}
                        setPagedData={setPagedData}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default EmployeeListTable;
