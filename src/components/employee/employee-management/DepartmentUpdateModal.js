import { useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";

function DepartmentUpdateModal(props) {
    const {
        handleCloseDepartmentModal,
        showDepartmentModal,
        departmentList,
        teamList,
        defaultEmployeeNumber,
        defaultDepartmentNumber,
        defaultTeamNumber,
        defaultDepartmentHead,
        defaultTeamHead,
        setDepartmentNumber,
        setDepartmentName,
        setTeamNumber,
        setTeamName,
        setDepartmentHead,
        setTeamHead,
    } = props;

    const [selectedDepartment, setSelectedDepartment] = useState(
        defaultDepartmentNumber || ""
    );
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(defaultTeamNumber || "");
    const [position, setPosition] = useState("");

    const [teamError, setTeamError] = useState(false);
    const [positionError, setPositionError] = useState(false);
    const [teamErrorMessage, setTeamErrorMessage] = useState("");
    const [positionErrorMessage, setPositionErrorMessage] = useState("");

    useEffect(() => {
        if (!showDepartmentModal) {
            setSelectedDepartment(defaultDepartmentNumber || "");
            setFilteredTeams([]);
            setSelectedTeam(defaultTeamNumber || "");
            setPosition("");
            setTeamError(false);
            setPositionError(false);
            setTeamErrorMessage("");
            setPositionErrorMessage("");
        }
    }, [showDepartmentModal]);

    useEffect(() => {
        const filtered = teamList.filter(
            (team) => team.departmentNumber === selectedDepartment
        );
        setFilteredTeams(filtered);

        if (selectedDepartment === defaultDepartmentNumber) {
            setSelectedTeam(defaultTeamNumber);
        } else {
            setSelectedTeam("");
            setPosition("");
        }
    }, [
        selectedDepartment,
        teamList,
        defaultDepartmentNumber,
        defaultTeamNumber,
    ]);

    useEffect(() => {
        if (
            selectedTeam === defaultTeamNumber &&
            selectedDepartment === defaultDepartmentNumber
        ) {
            if (
                defaultDepartmentHead ===
                departmentList.find(
                    (dept) => dept.departmentNumber === defaultDepartmentNumber
                )?.departmentHead
            ) {
                setPosition("");
            } else if (
                defaultTeamHead ===
                teamList.find((team) => team.teamNumber === defaultTeamNumber)
                    ?.teamHead
            ) {
                setPosition("");
            } else {
                setPosition("");
            }
        }
    }, [
        selectedTeam,
        selectedDepartment,
        departmentList,
        teamList,
        defaultDepartmentNumber,
        defaultTeamNumber,
        defaultDepartmentHead,
        defaultTeamHead,
    ]);

    const validate = () => {
        let isValid = true;

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

        if (isValid) {
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
            setTeamHead(defaultEmployeeNumber);
        } else if (position === "POS3") {
            setTeamHead(teamListItem ? teamListItem.teamHead : null);
            setDepartmentHead(defaultEmployeeNumber);
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
                    <Modal.Title>{"부서 수정"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="department">{"부서"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Select
                                id="department"
                                value={selectedDepartment}
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
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="team">{"팀"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Select
                                id="team"
                                value={selectedTeam}
                                onChange={(e) => {
                                    setSelectedTeam(e.target.value);
                                    setPosition("");
                                }}
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
                                    checked={position === "POS1"}
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
                                    checked={position === "POS2"}
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
                                    checked={position === "POS3"}
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
                        {"수정"}
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

export default DepartmentUpdateModal;
