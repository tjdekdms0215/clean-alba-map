import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    // 1. 상태 (State) - ✨ 빠졌던 도구들 추가!
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState(''); 
    const [isAdmin, setIsAdmin] = useState(false); 

    // 2. 처음 켜질 때 금고 확인 (Effect)
    useEffect(() => {
        const token = localStorage.getItem('jwt_token'); 
        // 변수 이름 헷갈리지 않게 savedNickname으로 살짝 바꿨어!
        const savedNickname = localStorage.getItem('user_nickname');
        const user_role = localStorage.getItem('user_role');

        if (token) {
            setIsLoggedIn(true);
            
            // ✨ 에러 나던 부분 수정! 세팅 함수(setNickname)를 써야 해!
            if (savedNickname) setNickname(savedNickname); 

            if (user_role === 'ADMIN') { 
                setIsAdmin(true);
            }
        }
    }, []);

    // 3. 로그아웃 폭파 함수 (Logic)
    const handleLogout = () => {
        localStorage.removeItem('jwt_token'); 
        localStorage.removeItem('user_email'); 
        localStorage.removeItem('user_nickname'); 
        localStorage.removeItem('user_role');
        setIsLoggedIn(false);   
        setIsAdmin(false);                
        alert('로그아웃 되었습니다.'); 
    };

    // 4. 화면 그리기 (UI)
    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f5f5f5' }}>
            
            {/* 상단바 */}
            <div style={headerStyle}>
                <div>    
                    <button style={btnStyle}>전남대 클린알바맵</button>
                </div>

                {/* ✨ 버튼들이 수직 중앙에 예쁘게 오도록 alignItems: 'center' 추가 */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button style={btnStyle}>서비스 소개</button>
                    <button style={btnStyle}>근로기준법 안내</button>

                    {/* ✨ 조건부 렌더링 마법 (닉네임 + 관리자 버튼 추가) ✨ */}
                    {isLoggedIn ? (
                        <>
                            
                            {isAdmin && (
                                <button onClick={() => navigate('/admin')} style={{...btnStyle, color: 'red', fontWeight: 'bold'}}>
                                    ⚙️ 관리자 페이지
                                </button>
                            )}
                            
                            <button onClick={handleLogout} style={btnStyle}>로그아웃</button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')} style={btnStyle}>로그인</button>
                    )}
                </div>
            </div>

            {/* 본문 영역 */}
            <div style={contentStyle}>
                <div style={mapStyle}></div>
                <div style={sidebarStyle}></div>
            </div>
            
            {/* 공중부양 제보하기 버튼 */}
            <button style={fabStyle}>후기 쓰기</button>
            
        </div>
    );
};

// ... (아래 스타일 코드는 다은님이 짠 그대로 두기!) ...

// --- 🎨 스타일 영역 ---

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',            
    height: '64px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd'
};

const btnStyle = {
    backgroundColor: 'transparent', 
    border: 'none', // 오류 수정: 'black'은 틀린 문법! 'none'으로 지워주기
    padding: '8px 12px',            
    cursor: 'pointer',              
    fontSize: '15px',               
    fontWeight: '500',              
    color: '#444'
};

const contentStyle = {
    display: 'flex',                  
    height: 'calc(100vh - 64px)',     
};

const mapStyle = {
    flex: 1,
    backgroundColor: '#e9ecef', // 지도가 들어올 공간 임시 색상
};

const sidebarStyle = {
    width: '500px',
    borderLeft: '1px solid #ddd',
    backgroundColor: '#ffffff'
};

const fabStyle = {
    position: 'fixed',
    top: '90px',          
    left: '45px',          
    width: '100px',          
    height: '40px',
    backgroundColor: '#ffffff', 
    color: 'black',
    border: '1px solid #ddd',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)' // 예쁜 그림자 추가
};

export default Home;