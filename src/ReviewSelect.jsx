import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://cleanalb-map.duckdns.org';

const KAKAO_REST_API_KEY =
    import.meta.env.VITE_KAKAO_REST_API_KEY;

const KAKAO_REDIRECT_URI =
    import.meta.env.VITE_KAKAO_REDIRECT_URI;

const ReviewSelect = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showIntroModal, setShowIntroModal] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const savedNickname = localStorage.getItem('user_nickname');
        const userRole = localStorage.getItem('user_role');

        if (token) {
            setIsLoggedIn(true);
            setNickname(savedNickname || '');
            setIsAdmin(userRole === 'ADMIN');
        }
    }, []);

    const handleKakaoLogin = () => {
        if (!KAKAO_REST_API_KEY || !KAKAO_REDIRECT_URI) {
            console.error('카카오 로그인 환경변수가 설정되지 않았습니다.');
            alert('카카오 로그인 설정을 확인해 주세요.');
            return;
        }

        const state = window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        sessionStorage.setItem('kakao_oauth_state', state);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: KAKAO_REST_API_KEY,
            redirect_uri: KAKAO_REDIRECT_URI,
            state
        });

        window.location.assign(
            `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
        );
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setNickname('');
        setIsAdmin(false);
        alert('로그아웃 되었습니다.');
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        const trimmedKeyword = keyword.trim();

        if (!trimmedKeyword) {
            setErrorMessage('사업장 이름을 입력해 주세요.');
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setHasSearched(true);

        try {
            // 백엔드 통합 검색 API 경로가 확정되면 이 주소만 맞춰 주세요.
            const response = await fetch(
                `${API_BASE_URL}/api/review-targets?keyword=${encodeURIComponent(
                    trimmedKeyword
                )}`
            );

            if (!response.ok) {
                throw new Error(`사업장 검색 실패: ${response.status}`);
            }

            const data = await response.json();
            const normalizedResults = Array.isArray(data)
                ? data
                : Array.isArray(data.results)
                    ? data.results
                    : [];

            setResults(normalizedResults);
        } catch (error) {
            console.error('후기 대상 사업장 검색 오류:', error);
            setResults([]);
            setErrorMessage(
                '사업장 검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectWorkspace = (place) => {
        if (place.registered && place.workspaceId) {
            navigate(`/review/write/${place.workspaceId}`, {
                state: {
                    workspace: place
                }
            });
            return;
        }

        sessionStorage.setItem(
            'selected_kakao_place',
            JSON.stringify(place)
        );

        navigate('/review/write/new');
    };

    return (
        <div style={pageStyle}>
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
                        onClick={() => setShowIntroModal(true)}
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
                    {isLoggedIn ? (
                        <>
                            <button
                                type="button"
                                style={profileButtonStyle}
                                onClick={() => navigate('/profile')}
                            >
                                <div style={profileCircleStyle}>
                                    <img
                                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                        alt="프로필"
                                        style={profileImageStyle}
                                    />
                                </div>

                                {nickname && (
                                    <span style={profileTextStyle}>
                                        {nickname}님
                                    </span>
                                )}
                            </button>

                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin')}
                                    style={adminBtnStyle}
                                >
                                    ⚙️ 관리자
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
                            onClick={handleKakaoLogin}
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

                            <span style={kakaoLoginTextStyle}>
                                카카오 로그인
                            </span>
                        </button>
                    )}
                </div>
            </header>

            <main
                style={{
                    ...mainStyle,
                    justifyContent:
                        results.length > 0 || hasSearched
                            ? 'flex-start'
                            : 'center',
                    paddingTop:
                        results.length > 0 || hasSearched
                            ? '72px'
                            : '24px'
                }}
            >
                <section style={contentSectionStyle}>
                    <div style={titleAreaStyle}>
                        <h1 style={titleStyle}>알바 후기 작성</h1>
                        <p style={subtitleStyle}>
                            후기를 남길 사업장을 검색하세요.
                        </p>
                    </div>

                    <div style={searchCardStyle}>
                        <form
                            onSubmit={handleSearch}
                            style={searchFormStyle}
                        >
                            <input
                                type="text"
                                value={keyword}
                                onChange={(event) =>
                                    setKeyword(event.target.value)
                                }
                                placeholder="사업장 이름 검색 (예: 파스쿠찌 전남대)"
                                style={searchInputStyle}
                                aria-label="후기를 작성할 사업장 이름"
                            />

                            <button
                                type="submit"
                                style={searchButtonStyle}
                                disabled={isLoading}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    style={searchIconStyle}
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M10.5 4a6.5 6.5 0 1 0 3.95 11.66l4.44 4.45 1.42-1.42-4.45-4.44A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
                                    />
                                </svg>

                                {isLoading ? '검색 중' : '검색'}
                            </button>
                        </form>
                    </div>

                    {errorMessage && (
                        <p style={errorTextStyle}>
                            {errorMessage}
                        </p>
                    )}

                    {isLoading && (
                        <div style={statusTextStyle}>
                            사업장을 검색하고 있습니다.
                        </div>
                    )}

                    {!isLoading &&
                        hasSearched &&
                        !errorMessage &&
                        results.length === 0 && (
                            <div style={emptyResultStyle}>
                                검색 결과가 없습니다.
                            </div>
                        )}

                    {!isLoading && results.length > 0 && (
                        <div style={resultAreaStyle}>
                            <div style={resultHeaderStyle}>
                                <h2 style={resultTitleStyle}>
                                    검색 결과
                                </h2>
                                <span style={resultCountStyle}>
                                    {results.length}곳
                                </span>
                            </div>

                            <div style={resultListStyle}>
                                {results.map((place) => {
                                    const isRegistered =
                                        Boolean(
                                            place.registered &&
                                            place.workspaceId
                                        );

                                    const resultKey =
                                        place.workspaceId ||
                                        place.kakaoPlaceId ||
                                        place.providerPlaceId ||
                                        `${place.name}-${place.address}`;

                                    return (
                                        <button
                                            type="button"
                                            key={resultKey}
                                            onClick={() =>
                                                handleSelectWorkspace(place)
                                            }
                                            style={resultCardStyle}
                                        >
                                            <div style={resultMainStyle}>
                                                <div style={resultNameRowStyle}>
                                                    <strong
                                                        style={placeNameStyle}
                                                    >
                                                        {place.name}
                                                    </strong>

                                                    <span
                                                        style={
                                                            isRegistered
                                                                ? registeredBadgeStyle
                                                                : newBadgeStyle
                                                        }
                                                    >
                                                        {isRegistered
                                                            ? '등록 사업장'
                                                            : '신규 장소'}
                                                    </span>
                                                </div>

                                                <div style={placeMetaStyle}>
                                                    {place.address ||
                                                        place.roadAddress ||
                                                        '주소 정보 없음'}
                                                </div>

                                                <div style={placeMetaStyle}>
                                                    {place.category ||
                                                        '업종 정보 없음'}
                                                </div>

                                                {isRegistered ? (
                                                    <div style={summaryRowStyle}>
                                                        <span>
                                                            후기{' '}
                                                            {place.reviewCount ??
                                                                0}
                                                            개
                                                        </span>
                                                        <span
                                                            style={
                                                                summaryDividerStyle
                                                            }
                                                        >
                                                            •
                                                        </span>
                                                        <span>
                                                            클린점수{' '}
                                                            {place.cleanScore ??
                                                                '미정'}
                                                            {place.cleanScore !==
                                                                null &&
                                                            place.cleanScore !==
                                                                undefined
                                                                ? '점'
                                                                : ''}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div style={newPlaceTextStyle}>
                                                        아직 등록되지 않은 장소 ·
                                                        첫 후기 작성
                                                    </div>
                                                )}
                                            </div>

                                            <span
                                                style={selectArrowStyle}
                                                aria-hidden="true"
                                            >
                                                ›
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {showIntroModal && (
                <div
                    style={modalOverlayStyle}
                    onClick={() => setShowIntroModal(false)}
                    role="presentation"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="서비스 소개"
                        style={introModalStyle}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setShowIntroModal(false)}
                            style={modalCloseButtonStyle}
                            aria-label="서비스 소개 닫기"
                        >
                            ✕
                        </button>

                        <div style={introHeaderStyle}>
                            <span style={coreValueBadgeStyle}>
                                CORE VALUE
                            </span>

                            <h2 style={introTitleStyle}>
                                안전한 알바를 위한
                                <br />
                                <span style={introTitleAccentStyle}>
                                    전남대 클린알바맵
                                </span>
                            </h2>

                            <p style={introSubtitleStyle}>
                                솔직한 후기, 공정한 평가로 더 나은 문화를
                                만듭니다.
                            </p>
                        </div>

                        <div style={introFeatureListStyle}>
                            <div style={introFeatureStyle}>
                                <div style={introFeatureIconStyle}>01</div>
                                <div>
                                    <div style={introFeatureTitleStyle}>
                                        클린 지수 시각화
                                    </div>
                                    <div style={introFeatureDescStyle}>
                                        사업장의 근로기준법 준수 여부를
                                        점수화해 컬러 핀으로 표시합니다.
                                    </div>
                                </div>
                            </div>

                            <div style={introFeatureStyle}>
                                <div style={introFeatureIconStyle}>02</div>
                                <div>
                                    <div style={introFeatureTitleStyle}>
                                        인증 기반 후기
                                    </div>
                                    <div style={introFeatureDescStyle}>
                                        실제 근로 증명 기반 후기로 신뢰도를
                                        높입니다.
                                    </div>
                                </div>
                            </div>

                            <div style={introFeatureStyle}>
                                <div style={introFeatureIconStyle}>03</div>
                                <div>
                                    <div style={introFeatureTitleStyle}>
                                        AI 후기 순화
                                    </div>
                                    <div style={introFeatureDescStyle}>
                                        위험 표현을 안전한 문장으로 변환해
                                        작성자를 보호합니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const pageStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
    minHeight: '64px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    boxSizing: 'border-box',
    zIndex: 10
};

const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
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
    color: 'red',
    borderColor: 'red',
    fontWeight: 'bold'
};

const profileButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer'
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

const profileTextStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
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

const mainStyle = {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    boxSizing: 'border-box',
    backgroundColor: '#f7f8fa',
    overflowY: 'auto'
};

const contentSectionStyle = {
    width: '100%',
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
};

const titleAreaStyle = {
    textAlign: 'center',
    marginBottom: '30px'
};

const titleStyle = {
    margin: '0 0 10px',
    color: '#202631',
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '-0.6px'
};

const subtitleStyle = {
    margin: 0,
    color: '#7c8491',
    fontSize: '14px',
    fontWeight: '500'
};

const searchCardStyle = {
    width: '100%',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #dfe3e8',
    boxSizing: 'border-box'
};

const searchFormStyle = {
    width: '100%',
    display: 'flex',
    gap: '8px'
};

const searchInputStyle = {
    flex: 1,
    minWidth: 0,
    height: '46px',
    padding: '0 16px',
    border: '1px solid #d7dce3',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#222831',
    backgroundColor: '#ffffff',
    fontSize: '14px'
};

const searchButtonStyle = {
    width: '88px',
    height: '46px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: 0,
    backgroundColor: '#4169e1',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    opacity: 1
};

const searchIconStyle = {
    width: '18px',
    height: '18px'
};

const errorTextStyle = {
    margin: '12px 2px 0',
    color: '#c43b3b',
    fontSize: '13px',
    lineHeight: '1.5'
};

const statusTextStyle = {
    marginTop: '28px',
    color: '#747c88',
    fontSize: '14px',
    textAlign: 'center'
};

const emptyResultStyle = {
    marginTop: '28px',
    padding: '28px',
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    color: '#747c88',
    fontSize: '14px',
    textAlign: 'center'
};

const resultAreaStyle = {
    width: '100%',
    marginTop: '30px'
};

const resultHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
};

const resultTitleStyle = {
    margin: 0,
    color: '#222831',
    fontSize: '17px',
    fontWeight: '800'
};

const resultCountStyle = {
    color: '#7b8490',
    fontSize: '13px',
    fontWeight: '600'
};

const resultListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const resultCardStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '18px 20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e4e9',
    textAlign: 'left',
    cursor: 'pointer',
    boxSizing: 'border-box'
};

const resultMainStyle = {
    minWidth: 0,
    flex: 1
};

const resultNameRowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '7px'
};

const placeNameStyle = {
    color: '#222831',
    fontSize: '16px',
    fontWeight: '800'
};

const registeredBadgeStyle = {
    padding: '3px 7px',
    backgroundColor: '#edf3ff',
    color: '#3459c7',
    fontSize: '11px',
    fontWeight: '800'
};

const newBadgeStyle = {
    padding: '3px 7px',
    backgroundColor: '#fff6e5',
    color: '#a56700',
    fontSize: '11px',
    fontWeight: '800'
};

const placeMetaStyle = {
    marginTop: '3px',
    color: '#717985',
    fontSize: '13px',
    lineHeight: '1.45'
};

const summaryRowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '7px',
    marginTop: '9px',
    color: '#4a5564',
    fontSize: '12px',
    fontWeight: '700'
};

const summaryDividerStyle = {
    color: '#b3bac4'
};

const newPlaceTextStyle = {
    marginTop: '9px',
    color: '#9a6500',
    fontSize: '12px',
    fontWeight: '700'
};

const selectArrowStyle = {
    flexShrink: 0,
    color: '#9aa2ad',
    fontSize: '28px',
    fontWeight: '400',
    lineHeight: 1
};

const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const introModalStyle = {
    width: '380px',
    maxWidth: 'calc(100% - 40px)',
    padding: '32px',
    boxSizing: 'border-box',
    position: 'relative',
    backgroundColor: '#ffffff',
    border: '1px solid #222',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
};

const modalCloseButtonStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '18px'
};

const introHeaderStyle = {
    textAlign: 'center',
    marginBottom: '28px',
    marginTop: '8px'
};

const coreValueBadgeStyle = {
    border: '1px solid #3b82f6',
    color: '#3b82f6',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '1px'
};

const introTitleStyle = {
    fontSize: '20px',
    color: '#111',
    margin: '16px 0 8px',
    lineHeight: '1.4'
};

const introTitleAccentStyle = {
    color: '#3b82f6'
};

const introSubtitleStyle = {
    fontSize: '13px',
    color: '#666',
    margin: 0
};

const introFeatureListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const introFeatureStyle = {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#fdfdfd',
    border: '1px solid #eaeaea'
};

const introFeatureIconStyle = {
    width: '28px',
    height: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold'
};

const introFeatureTitleStyle = {
    marginBottom: '4px',
    color: '#111',
    fontSize: '14px',
    fontWeight: 'bold'
};

const introFeatureDescStyle = {
    color: '#555',
    fontSize: '12px',
    lineHeight: '1.5',
    wordBreak: 'keep-all'
};

export default ReviewSelect;