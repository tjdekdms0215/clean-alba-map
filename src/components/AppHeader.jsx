import React, {
    useEffect,
    useState
} from 'react';
import {
    useLocation,
    useNavigate
} from 'react-router-dom';
import ServiceIntroModal from './ServiceIntroModal';
import {
    beginKakaoLogin,
    clearStoredAuth,
    getStoredAuth
} from '../utils/auth';

const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [authState, setAuthState] = useState(
        getStoredAuth()
    );
    const [isIntroOpen, setIsIntroOpen] = useState(false);

    useEffect(() => {
        setAuthState(getStoredAuth());
    }, [location.pathname]);

    useEffect(() => {
        const handleStorage = () => {
            setAuthState(getStoredAuth());
        };

        window.addEventListener(
            'storage',
            handleStorage
        );

        return () => {
            window.removeEventListener(
                'storage',
                handleStorage
            );
        };
    }, []);

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
        <>
            <header style={headerStyle}>
                <div style={headerLeftStyle}>
                    <button
                        type="button"
                        style={logoBtnStyle}
                        onClick={() => navigate('/')}
                    >
                        전남대 클린알바맵
                    </button>

                    <button
                        type="button"
                        style={navBtnStyle}
                        onClick={() => setIsIntroOpen(true)}
                    >
                        서비스 소개
                    </button>

                    <button
                        type="button"
                        style={navBtnStyle}
                        onClick={() => navigate('/guide')}
                    >
                        근로기준법 안내
                    </button>
                </div>

                <div style={headerRightStyle}>
                    {authState.isLoggedIn ? (
                        <>
                            <div style={profileDisplayStyle}>
                                <div style={profileCircleStyle}>
                                    <img
                                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                        alt="프로필"
                                        style={profileImageStyle}
                                    />
                                </div>

                                {authState.nickname && (
                                    <span
                                        style={
                                            profileTextStyle
                                        }
                                    >
                                        {authState.nickname}님
                                    </span>
                                )}
                            </div>

                            {authState.isAdmin && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate('/admin')
                                    }
                                    style={
                                        adminBtnStyle
                                    }
                                >
                                    관리자 페이지
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                style={btnStyle}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleLogin}
                            style={kakaoLoginBtnStyle}
                            aria-label="카카오 로그인"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                style={kakaoLogoStyle}
                                aria-hidden="true"
                            >
                                <path
                                    fill="#191919"
                                    d="M12 3C6.477 3 2 6.582 2 11c0 2.833 1.838 5.321 4.611 6.744l-1.153 4.227c-.103.377.327.681.656.464l5.119-3.386c.253.014.509.021.767.021 5.523 0 10-3.582 10-8.07C22 6.582 17.523 3 12 3Z"
                                />
                            </svg>

                            <span
                                style={kakaoLoginTextStyle}
                            >
                                카카오 로그인
                            </span>
                        </button>
                    )}
                </div>
            </header>

            <ServiceIntroModal
                isOpen={isIntroOpen}
                onClose={() => setIsIntroOpen(false)}
            />
        </>
    );
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '64px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    boxSizing: 'border-box',
    zIndex: 10,
    gap: '16px',
    flexWrap: 'wrap'
};

const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
};

const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
};

const logoBtnStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#333'
};

const navBtnStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px 10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#444'
};

const btnStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#444'
};

const adminBtnStyle = {
    ...btnStyle,
    color: '#ef4444',
    borderColor: '#ef4444',
    fontWeight: '700'
};

const profileDisplayStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const profileTextStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
};

const profileCircleStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid #eee',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const profileImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const kakaoLoginBtnStyle = {
    height: '38px',
    minWidth: '154px',
    padding: '0 16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#FEE500',
    color: '#191919',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap'
};

const kakaoLogoStyle = {
    width: '23px',
    height: '23px',
    flexShrink: 0,
    display: 'block'
};

const kakaoLoginTextStyle = {
    color: '#191919',
    fontSize: '15px',
    fontWeight: '600',
    lineHeight: 1
};

export default AppHeader;
