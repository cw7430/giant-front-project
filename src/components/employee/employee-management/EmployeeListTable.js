import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import CustomPagination from "../../../util/CustomPagination";
import CaretUp from "../../../assets/svg/CaretUp";
import CaretUpFill from "../../../assets/svg/CaretUpFill";
import CaretDown from "../../../assets/svg/CaretDown";
import CaretDownFill from "../../../assets/svg/CaretDownFill";
import { EMPLOYEE_PROFILE_PATH } from "../../../constant/url";

function EmployeeListTable(props) {
    const { filteredEmployeeList } = props;

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
                                <th>{"사번"}</th>
                                <th>{"이름"}</th>
                                <th>{"연락처"}</th>
                                <th>{"부서"}</th>
                                <th>{"직급"}</th>
                                <th>{"등록일"}</th>
                                <th>{"수정일"}</th>
                                <th>{"재직여부"}</th>
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
                                    <td>{employee.employeeRegisterDate}</td>
                                    <td>{employee.employeeUpdateDate || ""}</td>
                                    <td>{employee.employmentStatusName}</td>
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
