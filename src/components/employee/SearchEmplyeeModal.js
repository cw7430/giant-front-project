import { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Button,
    InputGroup,
    Row,
    Col,
    Table,
    Badge,
} from "react-bootstrap";
import CustomPagination from "../../util/CustomPagination";
import CaretUp from "../../assets/svg/CaretUp";
import CaretUpFill from "../../assets/svg/CaretUpFill";
import CaretDown from "../../assets/svg/CaretDown";
import CaretDownFill from "../../assets/svg/CaretDownFill";
import { sortCode } from "../../util/sort";

function SearchEmployeeModal(props) {
    const {
        view,
        showSearchEmployeeModal,
        handleCloseSearchEmployeeModal,
        existingEmployeeList,
        selectedEmployeeList,
        setSelectedEmployeeList,
        classList,
    } = props;

    const sortedClassList = sortCode(classList, "classCode", "desc");
    const [filteredEmployeeList, setFilteredEmployeeList] =
        useState(existingEmployeeList);
    const [pagedData, setPagedData] = useState(filteredEmployeeList);
    const [searching, setSearching] = useState(false);
    const [searchOrder, setSearchOrder] = useState("employeeName");
    const [searchWord, setSearchWord] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [employeeSort, setEmployeeSort] = useState("employeeNumberAsc");

    const handleSearchOrderChange = (event) => {
        const selectedValue = event.target.value;
        setSearchWord("");
        setSearchOrder(selectedValue);
    };

    const handleClassCodeChange = (event) => {
        const selectedCode = event.target.value;
        setSelectedClass(selectedCode);
    };

    const handleSearch = () => {
        setEmployeeSort("employeeNumberAsc");
        setFilteredEmployeeList(existingEmployeeList);
        setSearching(true);

        const filteredList = existingEmployeeList.filter((employee) => {
            if (searchOrder === "employeeName") {
                return employee.employeeName
                    .toLowerCase()
                    .includes(searchWord.toLowerCase());
            }
            if (searchOrder === "employeeNumber") {
                return employee.employeeNumber
                    .toLowerCase()
                    .includes(searchWord.toLowerCase());
            }
            if (searchOrder === "departmentName") {
                return employee.departmentName
                    .toLowerCase()
                    .includes(searchWord.toLowerCase());
            }
            if (searchOrder === "class") {
                return employee.classCode === selectedClass;
            }
            return true;
        });
        setFilteredEmployeeList(filteredList);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key !== "Enter") return;
        handleSearch();
    };

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

    const handleReset = () => {
        setEmployeeSort("employeeNumberAsc");
        setSearching(false);
        setSearchOrder("employeeName");
        setSearchWord("");
        setFilteredEmployeeList(existingEmployeeList);
        if (sortedClassList.length > 0) {
            setSelectedClass(sortedClassList[0].classCode); // 초기값 설정
        }
    };

    const handleRowClick = (employeeNumber) => {
        if (view === "bulk") {
            if (selectedEmployeeList.includes(employeeNumber)) {
                // 이미 선택된 항목이면 제거
                setSelectedEmployeeList(
                    selectedEmployeeList.filter((num) => num !== employeeNumber)
                );
            } else {
                // 선택되지 않은 항목이면 추가
                setSelectedEmployeeList([
                    ...selectedEmployeeList,
                    employeeNumber,
                ]);
            }
        }
    };

    const handleBadgeRemove = (employeeNumber) => {
        setSelectedEmployeeList(
            selectedEmployeeList.filter((num) => num !== employeeNumber)
        );
    };

    useEffect(() => {
        if (!showSearchEmployeeModal) {
            handleReset();
        }
        setFilteredEmployeeList(existingEmployeeList);
    }, [showSearchEmployeeModal]);

    return (
        <Modal
            backdrop="static"
            show={showSearchEmployeeModal}
            onHide={handleCloseSearchEmployeeModal}
        >
            <Modal.Header>
                <Modal.Title>{"사원검색"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    {selectedEmployeeList.map((employeeNumber) => (
                        <Col className="mb-1" xs={2} key={employeeNumber}>
                            <Badge pill bg="dark">
                                {employeeNumber}
                                <button
                                    className="icon-button"
                                    onClick={() =>
                                        handleBadgeRemove(employeeNumber)
                                    }
                                >
                                    <Form.Text className="text-warning">
                                        {"X"}
                                    </Form.Text>
                                </button>
                            </Badge>
                        </Col>
                    ))}
                </Row>
                <Form.Group className="mb-3">
                    <Row className="mt-3">
                        <InputGroup>
                            <Col xs={3}>
                                <Form.Select
                                    onChange={handleSearchOrderChange}
                                    value={searchOrder}
                                >
                                    <option value="employeeName">
                                        {"이름"}
                                    </option>
                                    <option value="employeeNumber">
                                        {"사번"}
                                    </option>
                                    <option value="departmentName">
                                        {"부서"}
                                    </option>
                                    <option value="class">{"직급"}</option>
                                </Form.Select>
                            </Col>
                            <Col xs={5}>
                                {searchOrder !== "class" && (
                                    <Form.Control
                                        type="text"
                                        value={searchWord}
                                        onChange={(e) =>
                                            setSearchWord(e.target.value)
                                        }
                                        onKeyDown={handleSearchKeyDown}
                                    />
                                )}
                                {searchOrder === "class" && (
                                    <Form.Select
                                        id="className"
                                        value={selectedClass}
                                        onChange={handleClassCodeChange}
                                    >
                                        {sortedClassList.map((classItem) => (
                                            <option
                                                key={classItem.classCode}
                                                value={classItem.classCode}
                                            >
                                                {classItem.className}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}
                            </Col>
                            <Col xs={2}>
                                <Button
                                    variant="primary"
                                    onClick={handleSearch}
                                >
                                    {"검색"}
                                </Button>
                            </Col>
                            {searching && ( // 검색 중일 때만 초기화 버튼 보여줌
                                <Col xs={2}>
                                    <Button
                                        variant="danger"
                                        onClick={handleReset}
                                    >
                                        {"초기화"}
                                    </Button>
                                </Col>
                            )}
                        </InputGroup>
                    </Row>
                </Form.Group>
                <Row>
                    <Col>
                        <Table bordered hover>
                            <thead className="table-dark">
                                <tr>
                                    <th>
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
                                    <th>{"이름"}</th>
                                    <th>
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
                                    <th>
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
                                                handleSortChange(
                                                    "classCodeDesc"
                                                )
                                            }
                                        >
                                            {employeeSort ===
                                            "classCodeDesc" ? (
                                                <CaretDownFill />
                                            ) : (
                                                <CaretDown />
                                            )}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedData.map((employee) => (
                                    <tr
                                        className={
                                            selectedEmployeeList.includes(
                                                employee.employeeNumber
                                            )
                                                ? "table-secondary"
                                                : "table-default"
                                        }
                                        key={employee.employeeNumber}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            handleRowClick(
                                                employee.employeeNumber
                                            )
                                        }
                                    >
                                        <td>{employee.employeeNumber}</td>
                                        <td>{employee.employeeName}</td>
                                        <td>{employee.departmentName}</td>
                                        <td>{employee.className}</td>
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
                            itemsPerPage={5}
                            pageBlockSize={5}
                            setPagedData={setPagedData}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="danger"
                    onClick={handleCloseSearchEmployeeModal}
                >
                    {"닫기"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SearchEmployeeModal;
