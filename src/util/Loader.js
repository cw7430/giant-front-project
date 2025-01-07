function Loader() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh", // 화면 전체 높이를 기준으로 중앙 배치
            position: "relative"
        }}>
            <img
                src={require('../assets/image/loader.gif')}
                alt="로딩중..."
                style={{
                    width: "100px", // 로딩 GIF의 가로 크기
                    height: "100px", // 로딩 GIF의 세로 크기
                    objectFit: "contain", // GIF 비율 유지
                }}
            />
        </div>
    );
}

export default Loader;
