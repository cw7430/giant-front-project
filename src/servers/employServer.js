import axios from "axios";

const DOMAIN = "http://localhost:8081/api/employee";

export const requestLogIn = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/login`, request);
        return response.data;
    } catch (error) {
        console.error("로그인 요청 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestUserIdDuplicateCheck = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/check_userId`, request);
        return response.data;
    } catch (error) {
        console.error("아이디 중복체크 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestProfile = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/personal_profile`, request);
        return response.data;
    } catch (error) {
        console.error("회원정보를 가져오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestProfileList = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/employee_list`);
        return response.data;
    } catch(error) {
        console.error("사원 목록 불러오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestClassList = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/class_list`);
        return response.data;
    } catch(error) {
        console.error("직급 목록 불러오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestDepartmentList = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/department_list`);
        return response.data;
    } catch(error) {
        console.error("부서 목록 불러오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestTeamList = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/team_list`);
        return response.data;
    } catch(error) {
        console.error("팀 목록 불러오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestEmploymentStatusList = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/employment_status_list`);
        return response.data;
    } catch(error) {
        console.error("재직 상태 목록 불러오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestAttendanceList = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/attendance_list`, request);
        return response.data;
    } catch(error) {
        console.error("근태 목록 불러오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestAttendanceStatusList = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/attendance_status_list`);
        return response.data;
    } catch(error) {
        console.error("근태 상태 목록 불러오던 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestAttendanceDuplicateCheck = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/attendance_duplicate_check`, request);
        return response.data;
    } catch (error) {
        console.error("근태 중복체크 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestAttendanceDuplicateCheckBulk = async () => {
    try {
        const response = await axios.post(`${DOMAIN}/attendance_duplicate_check_bulk`, request);
        return response.data;
    } catch (error) {
        console.error("근태 일괄 중복체크 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestRegisterEmployee = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/register_employee`, request);
        return response.data;
    } catch (error) {
        console.error("사원 등록 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestUpdateEmployee = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/update_employee`, request);
        return response.data;
    } catch (error) {
        console.error("사원 수정 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestChangeUserId = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/change_userId`, request);
        return response.data;
    } catch(error) {
        console.error("아이디 변경 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestChangePassword = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/change_password`, request);
        return response.data;
    } catch(error) {
        console.error("비밀번호 변경 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestRegisterAttendance = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/register_attendance`, request);
        return response.data;
    } catch(error) {
        console.error("근태 등록 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestRegisterAttendanceMultiple = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/register_attendances_multiple`, request);
        return response.data;
    } catch(error) {
        console.error("근태 다중 등록 중 오류 발생:", error);
        return { result: "SE" };
    }
};

export const requestUpdateAttendance = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/update_attendances`, request);
        return response.data;
    } catch(error) {
        console.error("근태 수정 중 오류 발생:", error);
        return { result: "SE" };
    }
};