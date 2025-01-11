import { useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";

function DepartmentModal(props) {
    const {
        handleCloseDepartmentModal,
        showDepartmentModal,
        departmentList,
        teamList,
        createdEmployeeNumber,
        setDepartmentNumber,
        setDepartmentName,
        setTeamNumber,
        setTeamName,
        setDepartmentHead,
        setTeamHead,
        setAuthorityCode,
    } = props;

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [position, setPosition] = useState("");

    const [departmentError, setDepartmentError] = useState(false);
    const [teamError, setTeamError] = useState(false);
    const [positionError, setPositionError] = useState(false);
    const [departmentErrorMessage, setDepartmentErrorMessage] = useState("");
    const [teamErrorMessage, setTeamErrorMessage] = useState("");
    const [positionErrorMessage, setPositionErrorMessage] = useState("");

    useEffect(() => {
        if (selectedDepartment) {
            const filtered = teamList.filter(
                (team) => team.departmentNumber === selectedDepartment
            );
            setFilteredTeams(filtered);
        } else {
            setFilteredTeams([]);
        }

        if (!showDepartmentModal) {
            setSelectedDepartment("");
            setFilteredTeams([]);
            setSelectedTeam("");
            setPosition("");
            setDepartmentError(false);
            setTeamError(false);
            setPositionError(false);
            setDepartmentErrorMessage("");
            setTeamErrorMessage("");
            setPositionErrorMessage("");
        }
    }, [selectedDepartment, teamList, showDepartmentModal]);

    const validate = () => {
        let isValid = true;

        if (!selectedDepartment) {
            setDepartmentError(true);
            setDepartmentErrorMessage("부서를 선택해주세요.");
            isValid = false;
        } else {
            setDepartmentError(false);
            setDepartmentErrorMessage("");
        }

        if (!selectedTeam) {
            setTeamError(true);
            setTeamErrorMessage("팀을 선택해주세요.");
            isValid = false;
        } else {
            setTeamError(false);
            setTeamErrorMessage("");
        }

        if (!position) {
            setPositionError(true);
            setPositionErrorMessage("직책을 선택해주세요.");
            isValid = false;
        } else {
            setPositionError(false);
            setPositionErrorMessage("");
        }

        if(isValid){
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        const departmentItem = departmentList.find(
            (dept) => dept.departmentNumber === selectedDepartment
        );
        const teamListItem = teamList.find(
            (team) => team.teamNumber === selectedTeam
        );

        if (departmentItem) {
            setDepartmentNumber(departmentItem.departmentNumber);
            setDepartmentName(departmentItem.departmentName);
        }

        if (teamListItem) {
            setTeamNumber(teamListItem.teamNumber);
            setTeamName(teamListItem.teamName);
            setAuthorityCode(teamListItem.authorityCode);
        }

        if (position === "POS1") {
            setTeamHead(teamListItem ? teamListItem.teamHead : null);
            setDepartmentHead(
                departmentItem ? departmentItem.departmentHead : null
            );
        } else if (position === "POS2") {
            setDepartmentHead(
                departmentItem ? departmentItem.departmentHead : null
            );
            setTeamHead(createdEmployeeNumber);
        } else if (position === "POS3") {
            setTeamHead(teamListItem ? teamListItem.teamHead : null);
            setDepartmentHead(createdEmployeeNumber);
        }

        handleCloseDepartmentModal();
    };

    return (
        <>
            <Modal
                backdrop="static"
                show={showDepartmentModal}
                onHide={handleCloseDepartmentModal}
            >
                <Modal.Header>
                    <Modal.Title>{"부서 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="department">{"부서"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Select
                                id="department"
                                onChange={(e) =>
                                    setSelectedDepartment(e.target.value || "")
                                }
                            >
                                <option value="">{"==선택=="}</option>
                                {departmentList.map((departmentItem) => (
                                    <option
                                        key={departmentItem.departmentNumber}
                                        value={departmentItem.departmentNumber}
                                    >
                                        {departmentItem.departmentName}
                                    </option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    {departmentError && (
                        <Form.Group className="mb-3">
                            <Form.Text className="text-danger">{departmentErrorMessage}</Form.Text>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="team">{"팀"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Select
                                id="team"
                                disabled={!selectedDepartment}
                                onChange={(e) =>
                                    setSelectedTeam(e.target.value)
                                }
                            >
                                <option value="">{"==선택=="}</option>
                                {filteredTeams.map((teamListItem) => (
                                    <option
                                        key={teamListItem.teamNumber}
                                        value={teamListItem.teamNumber}
                                    >
                                        {teamListItem.teamName}
                                    </option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    {teamError && (
                        <Form.Group className="mb-3">
                            <Form.Text className="text-danger">{teamErrorMessage}</Form.Text>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="position">{"직책"}</Form.Label>
                        <Row id="position" className="mt-3">
                            <Col xs="auto">
                                <Form.Check
                                    type="radio"
                                    label="팀원"
                                    name="position"
                                    value="POS1"
                                    onChange={(e) =>
                                        setPosition(e.target.value)
                                    }
                                />
                            </Col>
                            <Col xs="auto">
                                <Form.Check
                                    type="radio"
                                    label="팀장"
                                    name="position"
                                    value="POS2"
                                    onChange={(e) =>
                                        setPosition(e.target.value)
                                    }
                                />
                            </Col>
                            <Col xs="auto">
                                <Form.Check
                                    type="radio"
                                    label="부장"
                                    name="position"
                                    value="POS3"
                                    onChange={(e) =>
                                        setPosition(e.target.value)
                                    }
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    {positionError && (
                        <Form.Group className="mb-3">
                            <Form.Text className="text-danger">{positionErrorMessage}</Form.Text>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={validate}>
                        {"등록"}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCloseDepartmentModal}
                    >
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DepartmentModal;
