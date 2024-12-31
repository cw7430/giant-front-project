import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";

function Container(props) {

    const {isLogin, setIsLogin} = props;

    return (
        <div className="bg-light text-dark">
            <Header isLogin={isLogin} setIsLogin={setIsLogin} />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Container;