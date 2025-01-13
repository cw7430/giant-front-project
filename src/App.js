import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { Route, Routes } from "react-router-dom";
import {
    MY_PROFILE_PATH,
    MAIN_PATH,
    EMPLOYEE_PATH,
    EMPLOYEE_PROFILE_PATH,
} from "./constant/url";
import Container from "./layouts/container/Container";
import Main from "./components/main/Main";
import { useEffect, useState } from "react";
import MyProfile from "./components/main/my-profile/MyProfile";
import PrivateRoute from "./auth/PrivateRoute";
import Employee from "./components/employee/Employee";
import EmployeeProfile from "./components/employee/employee-management/EmployeeProfile";

function App() {
    const [isLogin, setIsLogin] = useState(null); // 초기값을 null로 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    // 로그인 상태 확인
    useEffect(() => {
        const employeeNumber = sessionStorage.getItem("employeeNumber");
        const authorityCode = sessionStorage.getItem("authorityCode");
        setIsLogin(!!(employeeNumber && authorityCode));
        setLoading(false); // 로딩이 끝났음을 표시
    }, []);

    if (loading) {
        // 로딩 중일 때는 로딩 화면이나 빈 화면을 렌더링
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route
                element={
                    <Container isLogin={isLogin} setIsLogin={setIsLogin} />
                }
            >
                <Route path={MAIN_PATH()} element={<Main />} />
                <Route
                    path={MY_PROFILE_PATH()}
                    element={
                        <PrivateRoute isLogin={isLogin}>
                            <MyProfile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={EMPLOYEE_PATH()}
                    element={
                        <PrivateRoute isLogin={isLogin}>
                            <Employee />
                        </PrivateRoute>
                    }
                ></Route>
                <Route
                    path={EMPLOYEE_PROFILE_PATH(":employeeNumber")}
                    element={
                        <PrivateRoute isLogin={isLogin}>
                            <EmployeeProfile />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
        </Routes>
    );
}

export default App;
