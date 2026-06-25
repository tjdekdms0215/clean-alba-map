import React from 'react';

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between', // 왼쪽 묶음과 오른쪽 묶음을 양 끝으로 밀어내기!
    alignItems: 'center',            // 수직 중앙 정렬
    height: '64px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd'
};

const btnStyle={
    backgroundColor: 'transparent', // 1. 배경색을 투명하게 (옷 벗기기!)
    border: 'black',                 // 2. 테두리 없애기 (옷 벗기기!)
    padding: '8px 12px',            // 클릭하기 편하게 투명한 여백 주기
    cursor: 'pointer',              // 마우스 올리면 손가락 모양으로 바뀌게
    fontSize: '15px',               // 글씨 크기
    fontWeight: '500',              // 글씨를 살짝 도톰하게 (Noto Sans의 500 굵기)
    color: '#444'
};

const containerStyle={
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '80vh',
                position: 'relative'
            };

const Login = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

    const handleKakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    return(
        <>
            <div style={headerStyle}>
                <button style={btnStyle}>전남대 클린알바맵</button>
            </div>
            <div style={containerStyle}>
                <button onClick={handleKakaoLogin} style={kakaoButtonStyle}>
                    <img
                    src="https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_large_narrow.png"
                    alt="카카오 심볼"
                    style={symbolStyle}
                    />
                </button>
            </div>
        </>
    );
};

//카카오 컨테이너
const kakaoButtonStyle={
    backgroundColor: "#FEE500",
    borderRadius: '12px'
};

//카카오 심볼
const symbolStyle={
    color: '#000000'
};

//카카오 레이블
const labelStyle={
    color: "rgba(0, 0, 0, 0.85)",
    fontSizet: '#30Pt'
};

export default Login;