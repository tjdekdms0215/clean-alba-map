import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContractAnalyzerPanel from '../components/ai/ContractAnalyzerPanel';
import {
    beginKakaoLogin,
    clearStoredAuth,
    getStoredAuth
} from '../utils/auth';

const ContractAnalyzer = () => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState(
        getStoredAuth()
    );

    const handleLogin = () => {
        const started = beginKakaoLogin();

        if (!started) {
            alert('카카오 로그인 설정을 확인해 주세요.');
        }
    };

    const handleLogout = () => {
        clearStoredAuth();
        setAuthState(getStoredAuth());
        navigate('/');
    };

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <div style={leftHeaderStyle}>
                    <button
                        type="button"
                        style={brandButtonStyle}
                        onClick={() => navigate('/')}
                    >
                        전남대 클린알바맵
                    </button>

                    <button
                        type="button"
                        style={navButtonStyle}
                        onClick={() => navigate('/guide')}
                    >
                        근로기준법 안내
                    </button>
                </div>

                <button
                    type="button"
                    style={
                        authState.isLoggedIn
                            ? logoutButtonStyle
                            : loginButtonStyle
                    }
                    onClick={
                        authState.isLoggedIn
                            ? handleLogout
                            : handleLogin
                    }
                >
                    {authState.isLoggedIn
                        ? '로그아웃'
                        : '카카오 로그인'}
                </button>
            </header>

            <main style={mainStyle}>
                <div style={contentStyle}>
                    <button
                        type="button"
                        style={backButtonStyle}
                        onClick={() => navigate('/guide')}
                    >
                        ‹ 근로기준법 안내로 돌아가기
                    </button>

                    <ContractAnalyzerPanel />
                </div>
            </main>
        </div>
    );
};

const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#F6F8FB'
};

const headerStyle = {
    height: '64px',
    padding: '0 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E8EDF4',
    boxSizing: 'border-box'
};

const leftHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
};

const brandButtonStyle = {
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#121826',
    cursor: 'pointer',
    fontSize: '17px',
    fontWeight: '900'
};

const navButtonStyle = {
    padding: '0 6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#596274',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
};

const loginButtonStyle = {
    height: '38px',
    minWidth: '132px',
    padding: '0 16px',
    backgroundColor: '#FEE500',
    border: 'none',
    borderRadius: '12px',
    color: '#191919',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '800'
};

const logoutButtonStyle = {
    height: '38px',
    minWidth: '108px',
    padding: '0 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE2EB',
    borderRadius: '12px',
    color: '#4E5968',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '800'
};

const mainStyle = {
    padding: '32px 20px 56px'
};

const contentStyle = {
    width: '100%',
    maxWidth: '960px',
    margin: '0 auto'
};

const backButtonStyle = {
    marginBottom: '18px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#99A2AF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
};

export default ContractAnalyzer;
