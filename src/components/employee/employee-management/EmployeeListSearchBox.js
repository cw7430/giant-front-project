import { useRef, useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    InputGroup,
    Alert,
} from "react-bootstrap";

function EmployeeListSearchBox(props) {
    const {
        employeeListData,
        classList,
        employmentStatusList,
        setFilteredEmployeeList,
    } = props;

    const keywords = [
        ...classList.map((item) => ({ keyWord: item.className })),
        ...employmentStatusList.map((item) => ({
            keyWord: item.employmentStatusName,
        })),
    ];

    const searchWordRef = useRef(null);

    const [searchOrder, setSearchOrder] = useState("keyWord");
    const [readOnly, setReadOnly] = useState(true);
    const [checkedKeywords, setCheckedKeywords] = useState({});
    const [allIncluded, setAllIncluded] = useState(false);
    const [searching, setSearching] = useState(false);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSearchOrder(selectedValue);
        setReadOnly(selectedValue === "keyWord");
        searchWordRef.current.value = "";
        setCheckedKeywords({});
        setAllIncluded(false);
        handleReset();
    };

    const handleAllIncludedChange = () => {
        setAllIncluded(!allIncluded);
        const newCheckedKeywords = {};
        keywords.forEach((keyword) => {
            newCheckedKeywords[keyword.keyWord] = !allIncluded;
        });
        setCheckedKeywords(newCheckedKeywords);
        updateSearchWord(newCheckedKeywords);
    };

    const handleKeywordChange = (keyword) => {
        const newCheckedKeywords = {
            ...checkedKeywords,
            [keyword]: !checkedKeywords[keyword],
        };
        setCheckedKeywords(newCheckedKeywords);
        setAllIncluded(Object.values(newCheckedKeywords).every(Boolean)); // 모두 체크된 상태 확인
        updateSearchWord(newCheckedKeywords);
    };

    const updateSearchWord = (newCheckedKeywords) => {
        const selectedKeywords = Object.keys(newCheckedKeywords).filter(
            (key) => newCheckedKeywords[key]
        );
        searchWordRef.current.value = selectedKeywords.join(" "); // 공백으로 연결
    };

    const handleSearch = () => {
        setFilteredEmployeeList(employeeListData);
        const searchValue = searchWordRef.current.value.toLowerCase();
        setSearching(true);

        const filteredList = employeeListData.filter((employee) => {
            if (searchOrder === "employeeName") {
                return employee.employeeName
                    .toLowerCase()
                    .includes(searchValue);
            }
            if (searchOrder === "employeeNumber") {
                return employee.employeeNumber
                    .toLowerCase()
                    .includes(searchValue);
            }
            if (searchOrder === "departmentName") {
                return employee.departmentName
                    .toLowerCase()
                    .includes(searchValue);
            }
            if (searchOrder === "keyWord") {
                const selectedKeywords = Object.keys(checkedKeywords).filter(
                    (key) => checkedKeywords[key]
                );
                return (
                    selectedKeywords.includes(employee.className) ||
                    selectedKeywords.includes(employee.employmentStatusName)
                );
            }
            return true;
        });
        setFilteredEmployeeList(filteredList);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key !== "Enter") return;
        handleSearch();
    };

    const handleReset = () => {
        setFilteredEmployeeList(employeeListData);
        setSearching(false);
        searchWordRef.current.value = "";
        setCheckedKeywords({});
        setAllIncluded(false);
    };

    return (
        <>
            <Container className="mb-4">
                {searching && (
                    <Alert variant="primary" className="font-weight-bold h5">
                        {`${searchOrder === "keyWord"
                                ? "키워드"
                                : searchOrder === "employeeName"
                                    ? "이름"
                                    : searchOrder === "employeeNumber"
                                        ? "사번"
                                        : searchOrder === "departmentName"
                                            ? "부서"
                                            : ""
                            }
                     : ${searchWordRef.current.value}`}
                    </Alert>
                )}
            </Container>

            <Container className="mb-4">
                <Form.Group className="mb-3">
                    <Row className="mt-3">
                        <InputGroup>
                            <Col xs={2}>
                                <Form.Select
                                    onChange={handleSelectChange}
                                    value={searchOrder}
                                >
                                    <option value="keyWord">{"키워드"}</option>
                                    <option value="employeeName">
                                        {"이름"}
                                    </option>
                                    <option value="employeeNumber">
                                        {"사번"}
                                    </option>
                                    <option value="departmentName">
                                        {"부서"}
                                    </option>
                                </Form.Select>
                            </Col>
                            <Col xs={8}>
                                <Form.Control
                                    type="text"
                                    readOnly={readOnly}
                                    ref={searchWordRef}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </Col>
                            <Col xs={1}>
                                <Button
                                    variant="primary"
                                    onClick={handleSearch}
                                >
                                    {"검색"}
                                </Button>
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
                    {searchOrder === "keyWord" && (
                        <>
                            <Row className="mt-3">
                                <Col xs="auto">
                                    <Form.Check
                                        type="checkbox"
                                        label="모두포함"
                                        checked={allIncluded}
                                        onChange={handleAllIncludedChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="justify-content-between mt-3">
                                {keywords.map((keyword) => (
                                    <Col xs="auto" key={keyword.keyWord}>
                                        <Form.Check
                                            type="checkbox"
                                            label={keyword.keyWord}
                                            checked={
                                                checkedKeywords[
                                                keyword.keyWord
                                                ] || false
                                            }
                                            onChange={() =>
                                                handleKeywordChange(
                                                    keyword.keyWord
                                                )
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Form.Group>
            </Container>
        </>
    );
}

export default EmployeeListSearchBox;
