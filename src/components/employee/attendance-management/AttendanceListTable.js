import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import CustomPagination from "../../../util/CustomPagination";

function AttandanceListTable(props) {
    const { filteredAttendanceList, setFilteredEmployeeList } = props;

    const [pagedData, setPagedData] = useState(filteredAttendanceList);

    return (
        <Container>
            <Row>
                <Col>
                    <Table bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th>{"사번"}</th>
                                <th>{"이름"}</th>
                                <th>{"날짜"}</th>
                                <th>{"출근시간"}</th>
                                <th>{"퇴근시간"}</th>
                                <th>{"근태상태"}</th>
                                <th>{"비고"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedData.map((attendance) => (
                                <tr
                                    key={attendance.attendanceId}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{attendance.employeeNumber}</td>
                                    <td>{attendance.employeeName}</td>
                                    <td>{attendance.commuteDate}</td>
                                    <td>{attendance.commuteTime?.split(":").slice(0, 2).join(":")}</td>
                                    <td>{attendance.quitTime?.split(":").slice(0, 2).join(":")}</td>
                                    <td>{attendance.attendanceStatusName}</td>
                                    <td>{attendance.attendanceRemark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md="auto">
                    <CustomPagination
                        data={filteredAttendanceList}
                        itemsPerPage={10}
                        pageBlockSize={5}
                        setPagedData={setPagedData}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default AttandanceListTable;
