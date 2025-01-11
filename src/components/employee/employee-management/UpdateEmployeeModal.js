import { useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import { requestUpdateEmployee } from "../../../servers/employServer";
import DepartmentModal from "./DepartmentModal";
import ConfirmModal from "../../modals/ConfirmModal";
import AlertModal from "../../modals/AlertModal";

function UpdateEmployeeModal(props) {
    const {
        userProfile,
        showUpdateModal,
        handleCloseUpdateModal,
        classList,
        departmentList,
        teamList,
        employmentStatusList,
        updateData,
    } = props;

    const [telNumber, setTelNumber] = useState(userProfile.telNumber || "");
    const [departmentNumber, setDepartmentNumber] = useState(
        userProfile.departmentNumber || ""
    );
    const [departmentName, setDepartmentName] = useState(
        userProfile.departmentName || ""
    );
    const [teamNumber, setTeamNumber] = useState(userProfile.teamNumber || "");
    const [teamName, setTeamName] = useState(userProfile.teamName || "");
    const [departmentHead, setDepartmentHead] = useState(
        userProfile.departmentHead || ""
    );
    const [teamHead, setTeamHead] = useState(userProfile.teamHead || "");
    const [authorityCode, setAuthorityCode] = useState(
        userProfile.authorityCode || ""
    );
    const [classCode, setClassCode] = useState(userProfile.classCode || "");
    const [employmentStatusCode, setEmploymentStatusCode] = useState(
        userProfile.employmentStatusCode || ""
    );

    const [showDepartmentModal, setShowDepartmentModal] = useState(false);

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [telNumberError, setTelNumberError] = useState(false);
    const [departmentError, setDepartmentError] = useState(false);
    const [updateError, setUpdateError] = useState(false);

    const [telNumberErrorMessage, setTelNumberErrorMessage] = useState("");
    const [departmentErrorMessage, setDepartmentErrorMessage] = useState("");
    const [updateErrorMessage, setUpdateErrorMessage] = useState("");

    useEffect(() => {
        if (!showUpdateModal) {
            setTelNumber(userProfile.telNumber || "");
            setDepartmentNumber(userProfile.departmentNumber || "");
            setDepartmentName(userProfile.departmentName || "");
            setTeamNumber(userProfile.teamNumber || "");
            setTeamName(userProfile.teamName || "");
            setClassCode(userProfile.classCode || "");
            setDepartmentHead(userProfile.departmentHead || "");
            setTeamHead(userProfile.teamHead || "");
            setAuthorityCode(userProfile.authorityCode || "");
            setEmploymentStatusCode(userProfile.employmentStatusCode || "");

            setTelNumberError(false);
            setDepartmentError(false);
            setUpdateError(false);

            setTelNumberErrorMessage("");
            setDepartmentErrorMessage("");
            setUpdateErrorMessage("");
        }
    }, [showUpdateModal, userProfile]);

    const handleHypenTelNum = (event) => {
        const inputValue = event.target.value;
        const formattedValue = inputValue
            .replace(/[^0-9]/g, "")
            .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        setTelNumber(formattedValue);
    };

    const handelShowDepartmentModal = () => {
        setDepartmentNumber("");
        setDepartmentName("");
        setTeamNumber("");
        setTeamName("");
        setDepartmentHead("");
        setTeamHead("");
        setAuthorityCode("");
        setShowDepartmentModal(true);
    };

    const handleCloseDepartmentModal = () => setShowDepartmentModal(false);
    const handleCloseConfirmModal = () => setShowConfirmModal(false);
    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        updateData();
    };

    const handleGenerateauthorityCode = () => {
        // 권한 코드 로직 추가
        if (employmentStatusCode !== "EST01") {
            setAuthorityCode("AUT05");
        } else {
            const selectedTeam = teamList.find(
                (team) => team.teamNumber === teamNumber
            );
            if (selectedTeam) {
                setAuthorityCode(selectedTeam.authorityCode);
            } else {
                setAuthorityCode(userProfile.authorityCode || ""); // teamList에 해당 팀이 없을 경우 기본값 설정
            }
        }

        handleValidate();
    };

    const handleValidate = () => {
        let hasError = false;

        const telNumberRegex = /^(010|011|016|017|018|019)-\d{3,4}-\d{4}$/;

        if (!telNumber) {
            setTelNumberError(true);
            setTelNumberErrorMessage("전화번호를 입력해주세요.");
            hasError = true;
        } else if (!telNumberRegex.test(telNumber)) {
            setTelNumberError(true);
            setTelNumberErrorMessage("전화번호 형식이 올바르지 않습니다.");
            hasError = true;
        } else {
            setTelNumberError(false);
            setTelNumberErrorMessage("");
        }

        if (!departmentNumber || !teamNumber) {
            setDepartmentError(true);
            setDepartmentErrorMessage("부서를 등록해주세요.");
            hasError = true;
        } else {
            setDepartmentError(false);
            setDepartmentErrorMessage("");
        }

        if (!hasError) {
            setShowConfirmModal(true);
        }
    };

    const handleGenerateRequest = () => {
        setShowConfirmModal(false);

        const request = {
            employeeNumber: userProfile.employeeNumber,
            authorityCode: authorityCode,
            telNumber: telNumber,
            departmentNumber: departmentNumber,
            teamNumber: teamNumber,
            departmentHead: departmentHead,
            teamHead: teamHead,
            classCode: classCode,
            employmentStatusCode: employmentStatusCode,
        };

        handleUpdate(request);
    };

    const handleUpdate = async (request) => {
        const response = await requestUpdateEmployee(request);
        if (response.result === "SU") {
            setAlertTitle("등록완료");
            setAlertText("사원 수정이 완료되었습니다.");
            setShowAlertModal(true);
            handleCloseUpdateModal();
        } else {
            setUpdateError(true);
            setUpdateErrorMessage(
                "서버 오류입니다. 잠시 후 다시 시도해주세요."
            );
        }
    };

    return (
        <>
            <Modal
                backdrop="static"
                show={showUpdateModal}
                onHide={handleCloseUpdateModal}
            >
                <Modal.Header>
                    <Modal.Title>{"사원 정보 수정"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="employeeNumber">
                            {"사번"}
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Text id="employeeNumber">
                                {userProfile.employeeNumber}
                            </Form.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="employeeName">{"이름"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Text id="employeeName">
                                {userProfile.employeeName}
                            </Form.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="telNumber">{"연락처"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                id="telNumber"
                                maxLength={13}
                                value={telNumber}
                                onInput={handleHypenTelNum}
                            />
                        </InputGroup>
                        {telNumberError && (
                            <Form.Text className="text-danger">
                                {telNumberErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="departmentName">
                                {"부서"}
                            </Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    id="departmentName"
                                    readOnly={true}
                                    value={departmentName}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="teamName">{"팀"}</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    id="teamName"
                                    readOnly={true}
                                    value={teamName}
                                />
                                <Button
                                    variant="primary"
                                    onClick={handelShowDepartmentModal}
                                >
                                    {"부서검색"}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    {departmentError && (
                        <Form.Group className="mb-3">
                            <Form.Text className="text-danger">
                                {departmentErrorMessage}
                            </Form.Text>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="className">{"직급"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Select
                                id="className"
                                value={classCode}
                                onChange={(e) => setClassCode(e.target.value)}
                            >
                                {classList.map((classItem) => (
                                    <option
                                        key={classItem.classCode}
                                        value={classItem.classCode}
                                    >
                                        {classItem.className}
                                    </option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="employmentStatus">
                            {"재직상태"}
                        </Form.Label>
                        <Row id="employmentStatus" className="mt-3">
                            {employmentStatusList.map((employmentStatus) => (
                                <Col xs="auto" key={employmentStatus.employmentStatusCode}>
                                    <Form.Check
                                        type="radio"
                                        label={
                                            employmentStatus.employmentStatusName
                                        }
                                        name="employmentStatus"
                                        value={
                                            employmentStatus.employmentStatusCode
                                        }
                                        checked={
                                            employmentStatus.employmentStatusCode ===
                                            employmentStatusCode
                                        }
                                        onChange={(e) =>
                                            setEmploymentStatusCode(
                                                e.target.value
                                            )
                                        }
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                    {updateError && (
                        <Form.Group className="mb-3">
                            <Form.Text className="text-danger">{updateErrorMessage}</Form.Text>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={handleGenerateauthorityCode}
                    >
                        {"수정"}
                    </Button>
                    <Button variant="danger" onClick={handleCloseUpdateModal}>
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <DepartmentModal
                handleCloseDepartmentModal={handleCloseDepartmentModal}
                showDepartmentModal={showDepartmentModal}
                departmentList={departmentList}
                teamList={teamList}
                createdEmployeeNumber={userProfile.employeeNumber}
                setDepartmentNumber={setDepartmentNumber}
                setDepartmentName={setDepartmentName}
                setTeamNumber={setTeamNumber}
                setTeamName={setTeamName}
                setDepartmentHead={setDepartmentHead}
                setTeamHead={setTeamHead}
                setAuthorityCode={setAuthorityCode}
            />
            <ConfirmModal
                showConfirmModal={showConfirmModal}
                handleCloseConfirmModal={handleCloseConfirmModal}
                handleConfirm={handleGenerateRequest}
                confirmTitle={"확인"}
                confirmText={"사원을 수정하시겠습니까?"}
            />
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle={alertTitle}
                alertText={alertText}
            />
        </>
    );
}

export default UpdateEmployeeModal;
