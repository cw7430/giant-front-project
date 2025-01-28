function Loader() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh", // 화면 전체 높이를 기준으로 중앙 배치
                position: "fixed", // 화면에 고정
                top: 0,
                left: 0,
                backgroundColor: "rgba(211, 211, 211, 0.8)", // 얕은 회색 배경 (투명도 적용)
                zIndex: 9999, // 최상단 배치
            }}
        >
            <img
                src={require("../assets/image/loader.gif")}
                alt="로딩중..."
                style={{
                    width: "50px", // 로딩 GIF의 가로 크기
                    height: "50px", // 로딩 GIF의 세로 크기
                    objectFit: "contain", // GIF 비율 유지
                }}
            />
        </div>
    );
}

export default Loader;
