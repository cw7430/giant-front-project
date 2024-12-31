import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import { sortCode } from "../../../util/sort";
import { requestRegisterEmployee } from "../../../servers/employServer";
import { requestEmployeeNumberSequence } from "../../../servers/utilServer";
import DepartmentModal from "./DepartmentModal";
import ConfirmModal from "../../modals/ConfirmModal";
import AlertModal from "../../modals/AlertModal";

function RegisterEmployeeModal(props) {
    const {
        showRegisterModal,
        handleCloseRegisterModal,
        classList,
        departmentList,
        teamList,
        updateData,
    } = props;

    const employeeNameRef = useRef(null);
    const telNumberRef = useRef(null);

    const [isEmployeeNumberCreated, setIsEmployeeNumberCreated] =
        useState(false);
    const [createdEmployeeNumber, setCreatedEmployeeNumber] = useState("");
    const [departmentNumber, setDepartmentNumber] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [teamNumber, setTeamNumber] = useState("");
    const [teamName, setTeamName] = useState("");
    const [departmentHead, setDepartmentHead] = useState("");
    const [teamHead, setTeamHead] = useState("");
    const [authorityCode, setAuthorityCode] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [classCode, setClassCode] = useState("");
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertText, setAlertText] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const sortedClassList = sortCode(classList, "classCode", "desc");

    const handleShowDepartmentModal = () => {
        if (!isEmployeeNumberCreated) {
            setDepartmentError(true);
            setDepartmentErrorMessage("사번 생성 후 이용 가능합니다.");
        } else {
            setDepartmentNumber("");
            setDepartmentName("");
            setTeamNumber("");
            setTeamName("");
            setDepartmentHead("");
            setTeamHead("");
            setAuthorityCode("");
            setShowDepartmentModal(true);
        }
    };

    const handleCloseDepartmentModal = () => setShowDepartmentModal(false);
    const handleCloseConfirmModal = () => setShowConfirmModal(false);
    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        updateData();
    };

    const handleHypenTelNum = (event) => {
        const inputValue = event.target.value;
        const formattedValue = inputValue
            .replace(/[^0-9]/g, "")
            .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        telNumberRef.current.value = formattedValue;
    };

    const handleCreateEmployeeNumber = async () => {
        const response = await requestEmployeeNumberSequence({id:1});
        if (response.result === "SE") {
            setEmployeeNumberError(true);
            setEmployeeNumberErrorMessage(
                "서버 오류가 발생했습니다. 나중에 다시 시도해주세요."
            );
        } else {
            setEmployeeNumberError(false);
            setEmployeeNumberErrorMessage("");
            setDepartmentError(false);
            setDepartmentErrorMessage("");
            createEmployeeNumber(response.sequenceValue);
        }
    };

    const createEmployeeNumber = (sequence) => {
        let formattedNumber;

        if (sequence < 1000) {
            formattedNumber = `EMP${String(sequence).padStart(3, "0")}`;
        } else {
            formattedNumber = `EMP${sequence}`;
        }
        setCreatedEmployeeNumber(formattedNumber);
        setIsEmployeeNumberCreated(true);
    };

    const [employeeNumberError, setEmployeeNumberError] = useState(false);
    const [employeeNameError, setEmployeeNameError] = useState(false);
    const [telNumberError, setTelNumberError] = useState(false);
    const [departmentError, setDepartmentError] = useState(false);
    const [registerError, setRegisterError] = useState(false);

    const [employeeNumberErrorMessage, setEmployeeNumberErrorMessage] =
        useState("");
    const [employeeNameErrorMessage, setEmployeeNameErrorMessage] =
        useState("");
    const [telNumberErrorMessage, setTelNumberErrorMessage] = useState("");
    const [departmentErrorMessage, setDepartmentErrorMessage] = useState("");
    const [registerErrorMessage, setRegisterErrorMessage] = useState("");

    useEffect(() => {
        if (!showRegisterModal) {
            setIsEmployeeNumberCreated(false);
            setCreatedEmployeeNumber("");
            setDepartmentNumber("");
            setDepartmentName("");
            setTeamNumber("");
            setTeamName("");
            setDepartmentHead("");
            setTeamHead("");
            setAuthorityCode("");
            setClassCode("");
            setEmployeeNumberError(false);
            setEmployeeNameError(false);
            setTelNumberError(false);
            setDepartmentError(false);
            setRegisterError(false);
            setEmployeeNumberErrorMessage("");
            setEmployeeNameErrorMessage("");
            setTelNumberErrorMessage("");
            setDepartmentErrorMessage("");
            setRegisterErrorMessage("");
        }
        if (sortedClassList.length > 0) {
            const initialClassCode = sortedClassList[0].classCode;
            setClassCode(initialClassCode); // 초기값 설정
            setSelectedClass(initialClassCode);
        }
    }, [showRegisterModal, sortedClassList]);

    const handleClassCodeChange = (event) => {
        const selectedCode = event.target.value;
        setClassCode(selectedCode);
        setSelectedClass(selectedCode);
    };

    const handleValidate = () => {
        let hasError = false;

        if (!isEmployeeNumberCreated) {
            setEmployeeNumberError(true);
            setEmployeeNumberErrorMessage("사번을 생성해주세요.");
            hasError = true;
        } else {
            setEmployeeNumberError(false);
            setEmployeeNumberErrorMessage("");
        }

        const employeeName = employeeNameRef.current?.value || "";
        const employeeNameRegex = /^[가-힣]+$/;

        if (!employeeName) {
            setEmployeeNameError(true);
            setEmployeeNameErrorMessage("이름을 입력해주세요.");
            hasError = true;
        } else if (!employeeNameRegex.test(employeeName)) {
            setEmployeeNameError(true);
            setEmployeeNameErrorMessage("이름 형식이 올바르지 않습니다.");
            hasError = true;
        } else {
            setEmployeeNameError(false);
            setEmployeeNameErrorMessage("");
        }

        const telNumber = telNumberRef.current?.value || "";
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

        if (!departmentNumber || !teamNumber || !authorityCode) {
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
        const employeeName = employeeNameRef.current?.value || "";
        const telNumber = telNumberRef.current?.value || "";

        const request = {
            employeeNumber: createdEmployeeNumber,
            userId: createdEmployeeNumber,
            password: createdEmployeeNumber,
            authorityCode: authorityCode,
            employeeName: employeeName,
            telNumber: telNumber,
            departmentNumber: departmentNumber,
            teamNumber: teamNumber,
            departmentHead: departmentHead,
            teamHead: teamHead,
            classCode: classCode,
        };

        handleRegister(request);
    };

    const handleRegister = async (request) => {
        const response = await requestRegisterEmployee(request);
        if (response.result === "SU") {
            setAlertTitle("등록완료");
            setAlertText("사원 등록이 완료되었습니다.");
            setShowAlertModal(true);
            handleCloseRegisterModal();
        } else {
            setRegisterError(true);
            setRegisterErrorMessage(
                "서버 오류입니다. 잠시 후 다시 시도해주세요."
            );
        }
    };

    return (
        <>
            <Modal
                backdrop="static"
                show={showRegisterModal}
                onHide={handleCloseRegisterModal}
            >
                <Modal.Header>
                    <Modal.Title>{"사원 정보 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="employeeNumber">
                            {"사번"}
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                id="employeeNumber"
                                value={createdEmployeeNumber}
                                readOnly={true}
                            />
                            <Button
                                variant="primary"
                                onClick={handleCreateEmployeeNumber}
                                disabled={isEmployeeNumberCreated}
                            >
                                {"자동발급"}
                            </Button>
                        </InputGroup>
                        {employeeNumberError && (
                            <Form.Text className="text-danger">
                                {employeeNumberErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="employeeName">{"이름"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                id="employeeName"
                                ref={employeeNameRef}
                            />
                        </InputGroup>
                        {employeeNameError && (
                            <Form.Text className="text-danger">
                                {employeeNameErrorMessage}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="telNumber">{"연락처"}</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                id="telNumber"
                                ref={telNumberRef}
                                onInput={handleHypenTelNum}
                                maxLength={13}
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
                                    onClick={handleShowDepartmentModal}
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
                        </InputGroup>
                    </Form.Group>
                    {registerError && (
                        <Form.Group className="mb-3">
                            <Form.Text>{registerErrorMessage}</Form.Text>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleValidate}>
                        {"등록"}
                    </Button>
                    <Button variant="danger" onClick={handleCloseRegisterModal}>
                        {"닫기"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <DepartmentModal
                handleCloseDepartmentModal={handleCloseDepartmentModal}
                showDepartmentModal={showDepartmentModal}
                departmentList={departmentList}
                teamList={teamList}
                createdEmployeeNumber={createdEmployeeNumber}
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
                confirmText={"사원을 등록하시겠습니까?"}
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

export default RegisterEmployeeModal;
