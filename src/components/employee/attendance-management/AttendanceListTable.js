import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import CustomPagination from "../../../util/CustomPagination";
import {
    CaretUp,
    CaretUpFill,
    CaretDown,
    CaretDownFill,
} from "../../../assets/svg/Svgs";
import { sortNumber, sortCode, sortDate } from "../../../util/sort";

function AttandanceListTable(props) {
    const {
        filteredAttendanceList,
        setFilteredAttendanceList,
        attendanceSort,
        setAttendanceSort,
        handleAttendanceSingle,
    } = props;

    const [pagedData, setPagedData] = useState(filteredAttendanceList);

    const handleSortChange = (sortKey) => {
        setAttendanceSort(sortKey);

        let sortedList = [];
        switch (sortKey) {
            case "idAsc":
                sortedList = sortNumber(
                    [...filteredAttendanceList],
                    "id",
                    "asc"
                );
                break;
            case "idDesc":
                sortedList = sortNumber(
                    [...filteredAttendanceList],
                    "id",
                    "desc"
                );
                break;
            case "employeeNumberAsc":
                sortedList = sortCode(
                    [...filteredAttendanceList],
                    "employeeNumber",
                    "asc"
                );
                break;
            case "employeeNumberDesc":
                sortedList = sortCode(
                    [...filteredAttendanceList],
                    "employeeNumber",
                    "desc"
                );
                break;
            case "commuteDateAsc":
                sortedList = sortDate(
                    [...filteredAttendanceList],
                    "commuteDate",
                    "asc"
                );
                break;
            case "commuteDateDesc":
                sortedList = sortDate(
                    [...filteredAttendanceList],
                    "commuteDate",
                    "desc"
                );
                break;
            case "attendanceStatusAsc":
                sortedList = sortCode(
                    [...filteredAttendanceList],
                    "attendanceStatusCode",
                    "asc"
                );
                break;
            case "attendanceStatusDesc":
                sortedList = sortCode(
                    [...filteredAttendanceList],
                    "attendanceStatusCode",
                    "desc"
                );
                break;
            default:
                sortedList = sortNumber(
                    [...filteredAttendanceList],
                    "id",
                    "asc"
                );
        }
        setFilteredAttendanceList(sortedList);
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
                                        {attendanceSort === "idAsc" ? (
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
                                        {attendanceSort === "idDesc" ? (
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
                                        {attendanceSort ===
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
                                        {attendanceSort ===
                                        "employeeNumberDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">{"이름"}</th>
                                <th className="text-center">
                                    {"날짜"}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("commuteDateAsc")
                                        }
                                    >
                                        {attendanceSort === "commuteDateAsc" ? (
                                            <CaretUpFill />
                                        ) : (
                                            <CaretUp />
                                        )}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange("commuteDateDesc")
                                        }
                                    >
                                        {attendanceSort ===
                                        "commuteDateDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">{"출근시간"}</th>
                                <th className="text-center">{"퇴근시간"}</th>
                                <th className="text-center">
                                    {"근태상태"}
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange(
                                                "attendanceStatusAsc"
                                            )
                                        }
                                    >
                                        {attendanceSort ===
                                        "attendanceStatusAsc" ? (
                                            <CaretUpFill />
                                        ) : (
                                            <CaretUp />
                                        )}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() =>
                                            handleSortChange(
                                                "attendanceStatusDesc"
                                            )
                                        }
                                    >
                                        {attendanceSort ===
                                        "attendanceStatusDesc" ? (
                                            <CaretDownFill />
                                        ) : (
                                            <CaretDown />
                                        )}
                                    </button>
                                </th>
                                <th className="text-center">{"비고"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedData.map((attendance) => (
                                <tr
                                    key={attendance.attendanceId}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleAttendanceSingle(
                                            attendance.attendanceId
                                        )
                                    }
                                >
                                    <td>{attendance.id}</td>
                                    <td>{attendance.employeeNumber}</td>
                                    <td>{attendance.employeeName}</td>
                                    <td className="text-end">{attendance.commuteDate}</td>
                                    <td className="text-end">
                                        {attendance.commuteTime
                                            ?.split(":")
                                            .slice(0, 2)
                                            .join(":")}
                                    </td>
                                    <td className="text-end">
                                        {attendance.quitTime
                                            ?.split(":")
                                            .slice(0, 2)
                                            .join(":")}
                                    </td>
                                    <td className="text-center">{attendance.attendanceStatusName}</td>
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
