import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../constant/url";
import Loader from "../util/Loader";
import AlertModal from "../components/modals/AlertModal";

function PrivateRoute(props) {
    const { isLogin, children } = props;
    const navigate = useNavigate();
    const [showAlertModal, setShowAlertModal] = useState(false);

    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        navigate(MAIN_PATH(), { replace: true }); // 모달 닫기 후 리다이렉트
    };

    useEffect(() => {
        if (!isLogin) {
            setShowAlertModal(true); // 로그인 필요 시 모달 표시
        }
    }, [isLogin]);

    return (
        <>
            {isLogin ? children : <Loader />}
            {/* 로그인 상태일 때만 children을 렌더링 */}
            <AlertModal
                showAlertModal={showAlertModal}
                handleCloseAlertModal={handleCloseAlertModal}
                alertTitle="로그인 필요"
                alertText="로그인이 필요한 페이지입니다."
            />
        </>
    );
}

export default PrivateRoute;
