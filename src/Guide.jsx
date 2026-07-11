import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Guide = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('2026 최저시급');
    
    // 💡 메인 페이지와 동일한 로그인 상태 로직 추가
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const savedNickname = localStorage.getItem('user_nickname');
        const userRole = localStorage.getItem('user_role');
        if (token) {
            setIsLoggedIn(true);
            if (savedNickname) setNickname(savedNickname);
            if (userRole === 'ADMIN') setIsAdmin(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setNickname('');
        setIsAdmin(false);
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    const tabs = ['2026 최저시급', '근로계약서', '주휴수당', '임금체불신고'];

    const renderContent = () => {
        switch (activeTab) {
            case '2026 최저시급':
                return (
                    <>
                        <div style={{ ...fullWidthWrapperStyle, backgroundColor: '#4063ff', color: '#fff' }}>
                            <div style={{ ...innerContainerStyle, paddingTop: '48px' }}>
                                <p style={heroSubStyle}>2026년 적용 기준</p>
                                <h1 style={heroTitleStyle}>2026년 최저시급 10,320원</h1>
                                <p style={heroDescStyle}>최저임금 제도는 임금의 최저수준을 정하고, 이 수준 이상을 지급하도록 법으로 강제하는 제도입니다.</p>
                                <div style={heroStatsGridStyle}>
                                    <div style={heroStatItemStyle}><div style={heroStatLabelStyle}>시급 1시간</div><div style={heroStatValueStyle}>10,320원</div></div>
                                    <div style={heroStatItemStyle}><div style={heroStatLabelStyle}>일급 8시간</div><div style={heroStatValueStyle}>82,560원</div></div>
                                    <div style={heroStatItemStyle}><div style={heroStatLabelStyle}>주급 40시간</div><div style={heroStatValueStyle}>412,800원</div></div>
                                    <div style={{ ...heroStatItemStyle, borderRight: 'none' }}><div style={heroStatLabelStyle}>월급 209시간</div><div style={heroStatValueStyle}>2,156,880원</div></div>
                                </div>
                            </div>
                        </div>
                        <div style={{ ...fullWidthWrapperStyle, flex: 1 }}>
                            <div style={{ ...innerContainerStyle, padding: '56px 32px 80px 32px' }}>
                                <div style={threeColGridStyle}>
                                    <div style={cardStyle}><h3 style={cardTitleStyle}>최저임금액</h3><p style={cardTextStyle}>2026년 적용 최저임금은 시간당 10,320원입니다.</p><p style={cardSmallTextStyle}>단, 근로계약기간이 1년 미만이거나 단순노무직은 감액 불가.</p></div>
                                    <div style={cardStyle}><h3 style={cardTitleStyle}>적용 대상</h3><p style={cardTextStyle}>근로자 1명 이상인 모든 사업장(정규직, 비정규직, 외국인 등)에 적용됩니다.</p></div>
                                    <div style={cardStyle}><h3 style={cardTitleStyle}>사용자의 주지의무</h3><p style={cardTextStyle}>사용자는 최저임금을 근로자가 쉽게 볼 수 있는 장소에 게시해야 합니다.</p></div>
                                </div>
                                {renderFAQ(faqData.wage)}
                            </div>
                        </div>
                    </>
                );
            case '근로계약서':
                return (
                    <>
                        <div style={{ ...fullWidthWrapperStyle, backgroundColor: '#4063ff', color: '#fff' }}>
                            <div style={{ ...innerContainerStyle, paddingTop: '48px', paddingBottom: '32px' }}>
                                <p style={heroSubStyle}>근로기준법 제17조</p>
                                <h1 style={heroTitleStyle}>함께 써요! 근로계약서!</h1>
                            </div>
                        </div>
                        <div style={{ ...fullWidthWrapperStyle, flex: 1 }}>
                            <div style={{ ...innerContainerStyle, padding: '56px 32px 80px 32px' }}>
                                <h2 style={sectionTitleStyle}>근로계약서란?</h2>
                                <p style={paragraphStyle}>근로자가 일을 하기 전에 고용주로부터 그 대가를 지급받기로 서로 약속하고 작성하는 근로 계약 문서입니다.</p>
                                {renderFAQ(faqData.contract)}
                            </div>
                        </div>
                    </>
                );
            // 주휴수당, 임금체불신고 탭도 동일한 방식으로 적용
            default:
                return <div style={{...innerContainerStyle, padding: '50px'}}>준비 중인 페이지입니다.</div>;
        }
    };

    const renderFAQ = (faqs) => (
        <div style={faqSectionStyle}>
            <h3 style={faqHeaderStyle}>자주 묻는 질문</h3>
            {faqs.map((faq, idx) => (
                <div style={faqItemStyle} key={idx}>
                    <div style={faqQuestionStyle}><span>{faq.q}</span><span>^</span></div>
                    <div style={faqAnswerStyle}>{faq.a}</div>
                </div>
            ))}
        </div>
    );

    return (
        <div style={pageWrapperStyle}>
            {/* 💡 헤더 (메인과 동일한 구성) */}
            <div style={{ ...fullWidthWrapperStyle, borderBottom: '1px solid #eee' }}>
                <div style={{ ...innerContainerStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                    <div style={logoBtnStyle} onClick={() => navigate('/')}>전남대 클린알바맵</div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button style={navBtnStyle} onClick={() => navigate('/guide')}>📖 근로기준법 안내</button>
                        {isLoggedIn ? (
                            <>
                                <div style={profileContainerStyle} onClick={() => navigate('/profile')}>
                                    <div style={profileCircleStyle}><img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" style={{ width: '100%' }}/></div>
                                    <span style={profileTextStyle}>{nickname}님</span>
                                </div>
                                {isAdmin && <button onClick={() => navigate('/admin')} style={adminBtnStyle}>⚙️ 관리자</button>}
                                <button onClick={handleLogout} style={btnStyle}>로그아웃</button>
                            </>
                        ) : (
                            <button onClick={() => navigate('/login')} style={btnStyle}>로그인</button>
                        )}
                    </div>
                </div>
            </div>

            <div style={tabsContainerStyle}>
                <div style={tabsInnerStyle}>
                    {tabs.map((tab) => (
                        <div key={tab} style={tab === activeTab ? activeTabStyle : inactiveTabStyle} onClick={() => setActiveTab(tab)}>{tab}</div>
                    ))}
                </div>
            </div>

            {renderContent()}

            <div style={footerStyle}>
                <div style={footerInnerStyle}>
                    <span style={{ color: '#888', fontSize: '13px' }}>자세한 사항은 국가법령정보센터에서 확인하실 수 있습니다.</span>
                    <button style={footerBtnStyle}>{activeTab === '2026 최저시급' ? '최저임금법 확인하기' : '근로기준법 확인하기'}</button>
                </div>
            </div>
        </div>
    );
};

// --- 스타일 (메인과 동일하게 사용) ---
const pageWrapperStyle = { width: '100%', minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 };
const fullWidthWrapperStyle = { width: '100%', display: 'flex', justifyContent: 'center' };
const innerContainerStyle = { width: '100%', maxWidth: '960px', padding: '0 24px', boxSizing: 'border-box' };

const logoBtnStyle = { backgroundColor: 'transparent', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', color: '#333' };
const navBtnStyle = { background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' };
const btnStyle = { backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '14px', color: '#444' };
const adminBtnStyle = { ...btnStyle, color: 'red', borderColor: 'red', fontWeight: 'bold' };
const profileContainerStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
const profileCircleStyle = { width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #eee' };
const profileTextStyle = { fontSize: '14px', fontWeight: 'bold', color: '#333' };

const tabsContainerStyle = { display: 'flex', borderBottom: '1px solid #eee' };
const tabsInnerStyle = { display: 'flex', padding: '0 6vw', width: '100%', maxWidth: '960px', margin: '0 auto' };
const tabBaseStyle = { padding: '20px 24px', fontSize: '15px', cursor: 'pointer' };
const activeTabStyle = { ...tabBaseStyle, color: '#4063ff', fontWeight: 'bold', borderBottom: '3px solid #4063ff' };
const inactiveTabStyle = { ...tabBaseStyle, color: '#888' };

const heroStyle = { backgroundColor: '#4063ff', color: '#fff', width: '100%' };
const heroInnerContentStyle = { padding: '48px 32px 32px 32px', maxWidth: '960px', margin: '0 auto' };
const heroSubStyle = { fontSize: '14px', opacity: 0.8, marginBottom: '10px' };
const heroTitleStyle = { fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0' };
const heroDescStyle = { fontSize: '16px', lineHeight: '1.6', opacity: 0.9, margin: 0 };
const heroStatsGridStyle = { display: 'flex', borderTop: '1px solid rgba(255,255,255,0.2)', maxWidth: '960px', margin: '0 auto' };
const heroStatItemStyle = { flex: 1, padding: '28px 0', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' };
const heroStatLabelStyle = { fontSize: '14px', opacity: 0.8, marginBottom: '8px' };
const heroStatValueStyle = { fontSize: '22px', fontWeight: 'bold' };

const contentAreaStyle = { padding: '48px 32px', maxWidth: '960px', margin: '0 auto' };
const sectionTitleStyle = { fontSize: '22px', fontWeight: 'bold', color: '#111', margin: '0 0 20px 0' };
const paragraphStyle = { fontSize: '15px', color: '#444', lineHeight: '1.7', margin: '0 0 32px 0' };
const threeColGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' };
const twoColGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '40px' };
const cardStyle = { backgroundColor: '#fafafa', padding: '32px 24px', textAlign: 'center', border: '1px solid #f0f0f0' };
const cardTitleStyle = { fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 16px 0' };
const cardTextStyle = { fontSize: '13px', color: '#333', lineHeight: '1.5', margin: '0 0 12px 0' };
const cardSmallTextStyle = { fontSize: '11px', color: '#888', lineHeight: '1.5', margin: 0 };
const faqSectionStyle = { marginTop: '48px' };
const faqHeaderStyle = { fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#111' };
const faqItemStyle = { borderBottom: '1px solid #eee', padding: '24px 0' };
const faqQuestionStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold', color: '#333', marginBottom: '12px' };
const faqAnswerStyle = { fontSize: '14px', color: '#666', lineHeight: '1.6' };
const footerStyle = { borderTop: '1px solid #eee', backgroundColor: '#fff', width: '100%' };
const footerInnerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', maxWidth: '960px', margin: '0 auto' };
const footerBtnStyle = { backgroundColor: '#f1f5f9', color: '#555', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' };

const faqData = {
    wage: [
        { q: 'Q. 야간수당, 주휴수당 포함해서 최저시급 맞추면 되나요?', a: 'A. 아니요. 최저시급은 기본 시급만으로 산정합니다.' },
        { q: 'Q. 수습기간에는 최저시급보다 적게 받아도 되나요?', a: 'A. 1년 이상 계약직의 수습 3개월 동안은 최저시급의 90%까지 지급 가능합니다.' }
    ],
    contract: [{ q: 'Q. 근로계약서를 안 쓰고 일하면 어떻게 되나요?', a: 'A. 계약서 미작성은 사업주의 위법입니다.' }],
    holiday: [{ q: 'Q. 매주 일하는 시간이 다르면 주휴수당은 어떻게 되나요?', a: 'A. 4주 동안 일한 총 근로시간을 평균 내어 계산합니다.' }]
};

export default Guide;