import { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Button,
    InputGroup,
    Row,
    Col,
    Table,
} from "react-bootstrap";
import CustomPagination from "../../util/CustomPagination";
import { sortCode } from "../../util/sort";

function SearchEmployeeModal(props) {
    const {
        view,
        showSearchEmployeeModal,
        handleCloseSearchEmployeeModal,
        filteredEmployeeList,
        setFilteredEmployeeList,
        exceptedEmployeeList,
        setExceptedEmployeeList,
        classList,
    } = props;

    const sortedClassList = sortCode(classList, "classCode", "desc");
    const [searchedData, setSearchedData] = useState(filteredEmployeeList);
    const [pagedData, setPagedData] = useState(searchedData);
    const [searching, setSearching] = useState(false);
    const [searchOrder, setSearchOrder] = useState("employeeName");
    const [searchWord, setSearchWord] = useState("");
    const [selectedClass, setSelectedClass] = useState("");

    const handleSearchOrderChange = (event) => {
        const selectedValue = event.target.value;
        setSearchWord("");
        setSearchOrder(selectedValue);
    };

    const handleClassCodeChange = (event) => {
        const selectedCode = event.target.value;
        setSelectedClass(selectedCode);
    };

    const handleReset = () => {
        setSearching(false);
        setSearchOrder("employeeName");
        setSearchWord("");
        setSearchedData(filteredEmployeeList);
        if (sortedClassList.length > 0) {
            setSelectedClass(sortedClassList[0].classCode); // 초기값 설정
        }
    };

    useEffect(() => {
        if (showSearchEmployeeModal) {
            // 모달이 열릴 때 초기화
            handleReset();
        }
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
                            <Col xs={6}>
                                {searchOrder !== "class" && (
                                    <Form.Control
                                        type="text"
                                        value={searchWord}
                                        onChange={(e) =>
                                            setSearchWord(e.target.value)
                                        }
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
                                <Button variant="primary">{"검색"}</Button>
                            </Col>
                            {searching && ( // 검색 중일 때만 초기화 버튼 보여줌
                                <Col xs={1}>
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
                                    <th>{"사번"}</th>
                                    <th>{"이름"}</th>
                                    <th>{"부서"}</th>
                                    <th>{"직급"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedData.map((employee) => (
                                    <tr
                                        key={employee.employeeNumber}
                                        style={{ cursor: "pointer" }}
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
                    variant="success"
                    onClick={handleCloseSearchEmployeeModal}
                >
                    {"등록"}
                </Button>
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
