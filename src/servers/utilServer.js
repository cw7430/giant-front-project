import axios from "axios";

const DOMAIN = "http://localhost:8081/api/util";

export const requestEmployeeNumberSequence = async (request) => {
    try {
        const response = await axios.post(`${DOMAIN}/sequence_generation`, request);
        return response.data;
    } catch(error) {
        console.error("사번 생성 중 오류 발생:", error);
        return { result: "SE" };
    }
};
