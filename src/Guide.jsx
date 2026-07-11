import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KAKAO_REST_API_KEY =
    import.meta.env.VITE_KAKAO_REST_API_KEY;

const KAKAO_REDIRECT_URI =
    import.meta.env.VITE_KAKAO_REDIRECT_URI;

const TAB_KEYS = {
    WAGE: '2026 최저시급',
    CONTRACT: '근로계약서',
    HOLIDAY: '주휴수당',
    ARREARS: '임금체불신고'
};

const guideData = {
    [TAB_KEYS.WAGE]: {
        eyebrow: '2026년 적용 기준',
        title: '2026년 최저시급 10,320원',
        description:
            '최저임금 제도는 임금의 최저수준을 정하고, 이 수준 이상을 지급하도록 법으로 강제하는 제도입니다.',
        footerButton: '최저임금법 확인하기'
    },
    [TAB_KEYS.CONTRACT]: {
        eyebrow: '근로기준법 제17조',
        title: '함께 써요! 근로계약서!',
        description:
            '근로기준법에 따라 사업주와 근로자는 근로계약을 체결해야 합니다.',
        footerButton: '근로기준법 확인하기'
    },
    [TAB_KEYS.HOLIDAY]: {
        eyebrow: '근로기준법 제55조',
        title: '주휴수당, 알고 받으세요',
        description:
            '1주일에 15시간 이상 근무하면 하루치 유급 휴일 임금을 받을 권리가 있습니다.',
        footerButton: '근로기준법 확인하기'
    },
    [TAB_KEYS.ARREARS]: {
        eyebrow: '임금채권 대지급',
        title: '월급을 못 받았다면? 신고하세요',
        description:
            '임금체불은 명백한 범죄입니다. 3년 이하 징역 또는 3천만원 이하 벌금에 처해집니다.',
        footerButton: '근로기준법 확인하기'
    }
};

const Guide = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(TAB_KEYS.WAGE);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showIntroModal, setShowIntroModal] = useState(false);

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

    const activeGuide = useMemo(
        () => guideData[activeTab],
        [activeTab]
    );

    const handleKakaoLogin = () => {
        if (!KAKAO_REST_API_KEY || !KAKAO_REDIRECT_URI) {
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
        navigate('/');
    };

    const openLawCenter = () => {
        window.open(
            'https://www.law.go.kr',
            '_blank',
            'noopener,noreferrer'
        );
    };

    const renderFAQ = (items) => (
        <section style={faqSectionStyle}>
            <h2 style={sectionLabelStyle}>자주 묻는 질문</h2>

            <div style={faqListStyle}>
                {items.map((item) => (
                    <article key={item.question} style={faqItemStyle}>
                        <div style={faqQuestionRowStyle}>
                            <strong style={faqQuestionStyle}>
                                Q. {item.question}
                            </strong>
                            <span style={faqArrowStyle}>⌃</span>
                        </div>

                        <p style={faqAnswerStyle}>
                            A. {item.answer}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );

    const renderWageContent = () => (
        <>
            <section style={wageStatsStyle}>
                {[
                    ['시급 1시간', '10,320원'],
                    ['일급 8시간', '82,560원'],
                    ['주급 40시간', '412,800원'],
                    ['월급 209시간', '2,156,880원']
                ].map(([label, value], index) => (
                    <div
                        key={label}
                        style={{
                            ...wageStatItemStyle,
                            borderRight:
                                index === 3
                                    ? 'none'
                                    : '1px solid rgba(255,255,255,0.16)'
                        }}
                    >
                        <span style={wageStatLabelStyle}>
                            {label}
                        </span>
                        <strong style={wageStatValueStyle}>
                            {value}
                        </strong>
                    </div>
                ))}
            </section>

            <section style={softSectionStyle}>
                <div style={threeColumnGridStyle}>
                    <InfoCard
                        title="최저임금액"
                        centered
                    >
                        <p style={cardTextStyle}>
                            2026년 적용 최저임금은
                            <br />
                            시간당 10,320원입니다.
                        </p>
                        <p style={cardTextStyle}>
                            수습기간 3개월은 최저시급의
                            <br />
                            90%까지 감액 가능합니다.
                        </p>
                        <p style={cardSmallTextStyle}>
                            단, 근로계약기간이 1년 미만이거나
                            <br />
                            단순노무직 종사자에게는 최저시급을
                            감액할 수 없습니다.
                        </p>
                        <strong style={cardBottomTextStyle}>
                            적용기간: 2026.1.1 ~ 2026.12.31
                        </strong>
                    </InfoCard>

                    <InfoCard
                        title="적용 대상"
                        centered
                    >
                        <p style={cardTextStyle}>
                            근로자 1명 이상인 모든 사업장에 적용됩니다.
                            <br />
                            근로기준법상 근로자(정규직, 비정규직,
                            <br />
                            외국인 등)이면 모두 해당됩니다.
                        </p>
                        <p style={cardSmallTextStyle}>
                            단, 가사 사용인(가정부, 보모 등),
                            동거하는 친족만을 사용하는 사업장에 종사하는
                            근로자는 적용에서 제외됩니다.
                        </p>
                    </InfoCard>

                    <InfoCard
                        title="사용자의 주지의무"
                        centered
                    >
                        <p style={cardTextStyle}>
                            사용자는 최저임금을
                            <br />
                            근로자가 쉽게 볼 수 있는 장소에
                            <br />
                            게시하거나 그 외 적당한 방법으로
                            <br />
                            근로자에게 알려야 합니다.
                        </p>
                        <p style={cardSmallTextStyle}>
                            최저임금 위반 시 3년 이하의 징역 또는
                            2천만원 이하의 벌금에 처해집니다.
                            내용을 주지시키지 않을 경우에는
                            100만원 이하의 과태료가 부과됩니다.
                        </p>
                    </InfoCard>
                </div>
            </section>

            <section style={contentSectionStyle}>
                <h2 style={mainSectionTitleStyle}>
                    최저임금 확인, 이렇게 확인하세요.
                </h2>
                <p style={sectionDescriptionStyle}>
                    임금을 시급으로 환산한 금액과 최저임금 10,320원을
                    비교해보세요.
                </p>

                <div style={calculationListStyle}>
                    {[
                        {
                            badge: '시급',
                            description:
                                '1시간에 9,060원의 시간급을 받은 경우',
                            formula: '10,320원 > 시간급 9,060원'
                        },
                        {
                            badge: '일급',
                            description:
                                '1일 8시간 근로하고 일급 72,480원을 받은 경우',
                            formula:
                                '10,320원 > 72,480원 ÷ 8시간 = 9,060원'
                        },
                        {
                            badge: '주급',
                            description:
                                '1일 4시간, 1주(5일) 간 총 20시간 근로한 경우',
                            formula:
                                '10,320원 > 217,440원 ÷ 24시간 = 9,060원',
                            note:
                                '* 주 15시간 이상 근무하는 경우 주휴수당을 포함하여 계산해야 함'
                        },
                        {
                            badge: '월급',
                            description:
                                '월급 1,893,540원을 받고 1주 40시간 근무한 경우',
                            formula:
                                '10,320원 > 1,893,540원 ÷ 209시간 = 9,060원',
                            note:
                                '* 주 소정근로시간 40시간 → 월환산 기준 시간수 5+200시간'
                        }
                    ].map((row) => (
                        <div key={row.badge} style={calculationRowStyle}>
                            <span style={roundBadgeStyle}>
                                {row.badge}
                            </span>

                            <div style={calculationDescriptionStyle}>
                                {row.description}
                            </div>

                            <div style={calculationFormulaWrapStyle}>
                                <strong style={calculationFormulaStyle}>
                                    {row.formula}
                                </strong>
                                {row.note && (
                                    <span style={calculationNoteStyle}>
                                        {row.note}
                                    </span>
                                )}
                            </div>

                            <span style={violationTextStyle}>
                                ⚠ 최저임금 위반
                            </span>
                        </div>
                    ))}
                </div>

                {renderFAQ([
                    {
                        question:
                            '야간수당, 주휴수당 포함해서 최저시급 맞추면 되나요?',
                        answer:
                            '아니요. 최저시급은 기본 시급만으로 산정합니다. 야간수당, 주휴수당 등 법정 가산수당은 별도로 지급해야 합니다.'
                    },
                    {
                        question:
                            '수습기간에는 최저시급보다 적게 받아도 되나요?',
                        answer:
                            '1년 이상 계약직의 수습 3개월 동안은 최저시급의 90%까지 지급 가능합니다. 단, 1년 미만 계약이나 단순노무직은 감액 불가합니다.'
                    },
                    {
                        question:
                            '사장님이 식비, 교통비를 최저시급에 포함한다고 하는데 맞나요?',
                        answer:
                            '매월 정기적으로 지급되는 식비·교통비 중 일부는 최저임금에 산입될 수 있으나 비율에 제한이 있습니다. 자세한 사항은 고용노동부(1350)에 문의하세요.'
                    }
                ])}
            </section>
        </>
    );

    const renderContractContent = () => (
        <section style={contentSectionStyle}>
            <h2 style={mainSectionTitleStyle}>근로계약서란?</h2>

            <p style={bodyParagraphStyle}>
                근로자가 일을 하기 전에 고용주로부터 그 대가를
                지급받기로 서로 약속하고 작성하는 근로 계약 문서로,
                <br />
                임금·근로시간·휴일 등 중요 근로 조건들이 명시되어야
                하며 작성하지 않을 경우 500만원 이하의 벌금이
                부과됩니다.
            </p>

            <InfoCard title="제17조 (근로조건의 서면명시)">
                <p style={cardTextStyle}>
                    사용자는 기간제근로자 또는 단시간근로자와
                    근로계약을 체결하는 때에는 다음 각 호의 모든
                    사항을 서면으로 명시하여야 한다. 다만, 제4호는
                    단시간근로자에 한한다.
                </p>
                <p style={cardSmallTextStyle}>
                    1. 근로계약기간에 관한 사항&nbsp;&nbsp;
                    2. 근로시간·휴게에 관한 사항&nbsp;&nbsp;
                    3. 임금의 구성항목·계산방법 및 지불방법에 관한
                    사항
                    <br />
                    4. 휴일·휴가에 관한 사항&nbsp;&nbsp;
                    5. 취업의 장소와 종사하여야 할 업무에 관한
                    사항&nbsp;&nbsp;
                    6. 근로일 및 근로일별 근로시간
                </p>
            </InfoCard>

            {renderFAQ([
                {
                    question:
                        '근로계약서를 안 쓰고 일하면 어떻게 되나요?',
                    answer:
                        '계약서 미작성은 사업주의 위법입니다. 근로관계는 성립하므로 임금 청구는 가능하나 분쟁 시 증거가 없어 불리할 수 있습니다.'
                },
                {
                    question:
                        '계약 내용을 중간에 바꾸자고 하는데 거부할 수 있나요?',
                    answer:
                        '근로조건 변경은 양측 합의가 필요합니다. 사업주가 일방적으로 변경하는 것은 위법입니다.'
                },
                {
                    question:
                        '단기 알바도 근로계약서를 써야 하나요?',
                    answer:
                        '네. 근무 기간이 하루여도 근로계약서 작성 의무가 있습니다. 일용직·아르바이트 모두 해당됩니다.'
                }
            ])}
        </section>
    );

    const renderHolidayContent = () => (
        <section style={contentSectionStyle}>
            <h2 style={mainSectionTitleStyle}>주휴수당이란?</h2>

            <p style={bodyParagraphStyle}>
                1주일 동안 소정근로일을 모두 개근한 근로자에게
                1주일에 평균 1회 이상 유급휴일을 주어야 합니다.
                <br />
                이 유급휴일에 지급되는 임금을 ‘주휴수당’이라고
                합니다.
            </p>

            <div style={twoColumnGridStyle}>
                <InfoCard title="계산 방법">
                    <ul style={bulletListStyle}>
                        <li>주 5일 근무: 시급 × 8시간</li>
                        <li>
                            예) 시급 10,320원 × 8시간 = 82,560원
                            단시간 근로자의 경우
                        </li>
                        <li>
                            (1주 소정근로시간 ÷ 40시간) × 8시간 ×
                            시급&nbsp; 기가 지급
                        </li>
                    </ul>
                </InfoCard>

                <InfoCard title="주의사항">
                    <ul style={bulletListStyle}>
                        <li>
                            주 15시간 미만 근로자는 주휴수당 적용 제외
                        </li>
                        <li>
                            무단결근 시 해당 주 주휴수당 미지급 가능
                        </li>
                        <li>
                            두 곳에서 알바 시 각각 사업장에서 지급 의무
                        </li>
                        <li>
                            주휴수당 미지급은 임금체불로 신고 가능
                        </li>
                    </ul>
                </InfoCard>
            </div>

            {renderFAQ([
                {
                    question:
                        '매주 일하는 시간이 다르면 주휴수당은 어떻게 되나요?',
                    answer:
                        '주 5일 일한 총 근로시간을 평균 내어 계산합니다. 이렇게 계산한 1주 평균 근로시간이 15시간 이상이라면, 일한 시간에 비례하여 단시간 근로자 계산법으로 주휴수당을 받을 수 있습니다.'
                },
                {
                    question:
                        '주휴일이랑 공휴일이 겹치면 돈을 두 배로 받나요?',
                    answer:
                        '원칙적으로 하나의 휴일로 취급되어 주휴수당 한 번만 지급됩니다. 단, 그날 실제로 출근해서 일을 했다면 휴일 근로수당이 추가로 발생할 수 있습니다.'
                },
                {
                    question:
                        '한 주에 15시간은 어떻게 계산하나요?',
                    answer:
                        '소정근로시간(약속된 근로시간) 기준으로 계산합니다. 초과근무 시간은 포함되지 않습니다.'
                }
            ])}
        </section>
    );

    const renderArrearsContent = () => (
        <section style={contentSectionStyle}>
            <h2 style={mainSectionTitleStyle}>임금체불이란?</h2>

            <div style={bodyParagraphStyle}>
                임금을 지급일에 지급하지 않거나 일부만 지급하는
                행위입니다.
                <ul style={bulletListStyle}>
                    <li>
                        매월 1회 이상 정해진 날 전액 지급 의무 · 퇴직
                        후 14일 이내 지급 의무
                    </li>
                    <li>
                        지연 지급 시 연 20% 지연이자 청구 가능 ·
                        임금근로자 명의 계좌로 지급
                    </li>
                </ul>
            </div>

            <div style={twoColumnGridStyle}>
                <InfoCard title="신고 방법" centered>
                    <p style={cardTextStyle}>
                        1. 고용노동부 상담 전화 1350
                    </p>
                    <p style={cardTextStyle}>
                        2. 고용노동부 홈페이지 온라인 진정
                    </p>
                    <p style={cardTextStyle}>
                        3. 가까운 지방고용노동청 방문
                    </p>
                    <p style={cardTextStyle}>
                        4. 대한민국 근로장려 법률 지원 신고 시 필요
                        서류:
                        <br />
                        근로계약서, 급여 명세서, 통장내역, 출퇴근 기록
                        등
                    </p>
                </InfoCard>

                <InfoCard title="대처 순서" centered>
                    <p style={cardTextStyle}>
                        1단계: 사업주에게 서면으로 지급 요청
                    </p>
                    <p style={cardTextStyle}>
                        2단계: 내용증명 발송
                    </p>
                    <p style={cardTextStyle}>
                        3단계: 고용노동부 임금체불 진정 신고
                    </p>
                    <p style={cardTextStyle}>
                        4단계: 검찰 고소 및 민사 청구 가능
                        <br />
                        소액심판제도 활용 가능
                    </p>
                </InfoCard>
            </div>

            {renderFAQ([
                {
                    question:
                        '급여일이 지났는데 월급이 들어오지 않았어요.',
                    answer:
                        '사업주에게 지급일과 미지급 금액을 문자나 이메일로 남기고, 해결되지 않으면 고용노동부에 임금체불 진정을 제기할 수 있습니다.'
                },
                {
                    question:
                        '근로계약서가 없어도 임금체불 신고가 가능한가요?',
                    answer:
                        '가능합니다. 출퇴근 기록, 급여 입금 내역, 문자 메시지, 업무 지시 내용 등 근로 사실을 입증할 자료를 준비하세요.'
                },
                {
                    question:
                        '퇴사한 뒤에도 못 받은 급여를 청구할 수 있나요?',
                    answer:
                        '네. 퇴직 후 14일 이내에 임금과 퇴직금이 지급되지 않았다면 임금체불로 신고할 수 있습니다.'
                }
            ])}
        </section>
    );

    const renderActiveContent = () => {
        switch (activeTab) {
            case TAB_KEYS.WAGE:
                return renderWageContent();
            case TAB_KEYS.CONTRACT:
                return renderContractContent();
            case TAB_KEYS.HOLIDAY:
                return renderHolidayContent();
            case TAB_KEYS.ARREARS:
                return renderArrearsContent();
            default:
                return null;
        }
    };

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <div style={headerLeftStyle}>
                    <button
                        type="button"
                        style={logoButtonStyle}
                        onClick={() => navigate('/')}
                    >
                        전남대 클린알바맵
                    </button>

                    <button
                        type="button"
                        style={navButtonStyle}
                        onClick={() => setShowIntroModal(true)}
                    >
                        서비스 소개
                    </button>

                    <button
                        type="button"
                        style={navButtonStyle}
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
                                    style={adminButtonStyle}
                                    onClick={() => navigate('/admin')}
                                >
                                    ⚙️ 관리자
                                </button>
                            )}

                            <button
                                type="button"
                                style={plainButtonStyle}
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleKakaoLogin}
                            style={kakaoLoginButtonStyle}
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

            <main style={scrollAreaStyle}>
                <nav style={tabBarStyle}>
                    <div style={tabScrollerStyle}>
                        {Object.values(TAB_KEYS).map((tab) => {
                            const isActive = activeTab === tab;

                            return (
                                <button
                                    type="button"
                                    key={tab}
                                    style={{
                                        ...tabButtonStyle,
                                        color: isActive
                                            ? '#4169e1'
                                            : '#7d8692',
                                        fontWeight: isActive
                                            ? '800'
                                            : '500',
                                        borderBottom: isActive
                                            ? '3px solid #4169e1'
                                            : '3px solid transparent'
                                    }}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <section style={heroStyle}>
                    <p style={heroEyebrowStyle}>
                        {activeGuide.eyebrow}
                    </p>
                    <h1 style={heroTitleStyle}>
                        {activeGuide.title}
                    </h1>
                    <p style={heroDescriptionStyle}>
                        {activeGuide.description}
                    </p>
                </section>

                {renderActiveContent()}

                <footer style={footerStyle}>
                    <span style={footerTextStyle}>
                        자세한 사항은 국가법령정보센터에서 확인하실 수
                        있습니다.
                    </span>

                    <button
                        type="button"
                        style={footerButtonStyle}
                        onClick={openLawCenter}
                    >
                        {activeGuide.footerButton}
                    </button>
                </footer>
            </main>

            {showIntroModal && (
                <div
                    style={modalOverlayStyle}
                    onClick={() => setShowIntroModal(false)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="서비스 소개"
                        style={introModalStyle}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            style={modalCloseStyle}
                            onClick={() => setShowIntroModal(false)}
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
                                <span style={introAccentStyle}>
                                    전남대 클린알바맵
                                </span>
                            </h2>

                            <p style={introSubtitleStyle}>
                                솔직한 후기, 공정한 평가로 더 나은 문화를
                                만듭니다.
                            </p>
                        </div>

                        <div style={introListStyle}>
                            {[
                                [
                                    '01',
                                    '클린 지수 시각화',
                                    '사업장의 근로기준법 준수 여부를 점수화해 컬러 핀으로 표시합니다.'
                                ],
                                [
                                    '02',
                                    '인증 기반 후기',
                                    '실제 근로 증명 기반 후기로 신뢰도를 높입니다.'
                                ],
                                [
                                    '03',
                                    'AI 후기 순화',
                                    '위험 표현을 안전한 문장으로 변환해 작성자를 보호합니다.'
                                ]
                            ].map(([number, title, description]) => (
                                <div key={number} style={introItemStyle}>
                                    <span style={introNumberStyle}>
                                        {number}
                                    </span>
                                    <div>
                                        <strong style={introItemTitleStyle}>
                                            {title}
                                        </strong>
                                        <p style={introItemTextStyle}>
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

const InfoCard = ({ title, centered = false, children }) => (
    <article
        style={{
            ...infoCardStyle,
            textAlign: centered ? 'center' : 'left'
        }}
    >
        <h3 style={infoCardTitleStyle}>{title}</h3>
        <div>{children}</div>
    </article>
);

const pageStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#f5f7fa'
};

const headerStyle = {
    height: '64px',
    minHeight: '64px',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #dddddd',
    zIndex: 20
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

const logoButtonStyle = {
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#333333',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold'
};

const navButtonStyle = {
    padding: '8px 10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#444444',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500'
};

const plainButtonStyle = {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #dddddd',
    borderRadius: '6px',
    color: '#444444',
    cursor: 'pointer',
    fontSize: '14px'
};

const adminButtonStyle = {
    ...plainButtonStyle,
    borderColor: '#ef4444',
    color: '#ef4444',
    fontWeight: '700'
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
    border: '1px solid #eeeeee'
};

const profileImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const profileTextStyle = {
    color: '#333333',
    fontSize: '14px',
    fontWeight: '700'
};

const kakaoLoginButtonStyle = {
    height: '38px',
    minWidth: '154px',
    padding: '0 16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#FEE500',
    border: 'none',
    borderRadius: '10px',
    color: '#191919',
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

const scrollAreaStyle = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    backgroundColor: '#f7f8fa'
};

const tabBarStyle = {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e6e9ed'
};

const tabScrollerStyle = {
    minWidth: 'max-content',
    padding: '0 48px',
    display: 'flex',
    alignItems: 'center'
};

const tabButtonStyle = {
    minWidth: '120px',
    height: '58px',
    padding: '0 20px',
    backgroundColor: 'transparent',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    cursor: 'pointer',
    fontSize: '14px'
};

const heroStyle = {
    minHeight: '210px',
    padding: '44px 48px 36px',
    boxSizing: 'border-box',
    backgroundColor: '#4164e9',
    color: '#ffffff'
};

const heroEyebrowStyle = {
    margin: '0 0 10px',
    color: 'rgba(255,255,255,0.78)',
    fontSize: '13px',
    fontWeight: '600'
};

const heroTitleStyle = {
    margin: '0 0 12px',
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '900',
    letterSpacing: '-0.8px'
};

const heroDescriptionStyle = {
    maxWidth: '760px',
    margin: 0,
    color: 'rgba(255,255,255,0.82)',
    fontSize: '15px',
    lineHeight: '1.65'
};

const wageStatsStyle = {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))',
    overflowX: 'auto',
    backgroundColor: '#3455c2'
};

const wageStatItemStyle = {
    minWidth: '180px',
    padding: '18px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    boxSizing: 'border-box',
    color: '#ffffff'
};

const wageStatLabelStyle = {
    color: 'rgba(255,255,255,0.68)',
    fontSize: '12px'
};

const wageStatValueStyle = {
    fontSize: '18px',
    fontWeight: '900'
};

const softSectionStyle = {
    padding: '32px 48px',
    backgroundColor: '#f2f5f8'
};

const contentSectionStyle = {
    width: '100%',
    padding: '38px 48px 44px',
    boxSizing: 'border-box',
    backgroundColor: '#f7f8fa'
};

const threeColumnGridStyle = {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px'
};

const twoColumnGridStyle = {
    width: '100%',
    marginTop: '28px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '26px'
};

const infoCardStyle = {
    minHeight: '180px',
    padding: '26px 28px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    border: '1px solid #edf0f3',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(20,30,50,0.035)'
};

const infoCardTitleStyle = {
    margin: '0 0 18px',
    paddingBottom: '14px',
    color: '#222831',
    fontSize: '17px',
    fontWeight: '900',
    borderBottom: '1px solid #edf0f3'
};

const cardTextStyle = {
    margin: '0 0 12px',
    color: '#4b5563',
    fontSize: '13px',
    lineHeight: '1.65'
};

const cardSmallTextStyle = {
    margin: '0 0 12px',
    color: '#8a929d',
    fontSize: '12px',
    lineHeight: '1.65'
};

const cardBottomTextStyle = {
    display: 'block',
    color: '#4b5563',
    fontSize: '12px'
};

const mainSectionTitleStyle = {
    margin: '0 0 8px',
    color: '#222831',
    fontSize: '21px',
    fontWeight: '900',
    letterSpacing: '-0.35px'
};

const sectionDescriptionStyle = {
    margin: '0 0 24px',
    color: '#8a929d',
    fontSize: '13px'
};

const bodyParagraphStyle = {
    margin: '0 0 26px',
    color: '#414a56',
    fontSize: '14px',
    lineHeight: '1.75'
};

const bulletListStyle = {
    margin: 0,
    paddingLeft: '20px',
    color: '#596273',
    fontSize: '13px',
    lineHeight: '1.9'
};

const calculationListStyle = {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #edf0f3',
    borderBottom: '1px solid #edf0f3'
};

const calculationRowStyle = {
    minHeight: '86px',
    padding: '14px 0',
    display: 'grid',
    gridTemplateColumns: '48px minmax(220px, 1.05fr) minmax(280px, 1.5fr) 120px',
    alignItems: 'center',
    gap: '18px',
    borderBottom: '1px solid #edf0f3',
    boxSizing: 'border-box'
};

const roundBadgeStyle = {
    width: '42px',
    height: '42px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#bfc5cf',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '800'
};

const calculationDescriptionStyle = {
    color: '#7f8792',
    fontSize: '12px',
    lineHeight: '1.55'
};

const calculationFormulaWrapStyle = {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const calculationFormulaStyle = {
    color: '#222831',
    fontSize: '14px'
};

const calculationNoteStyle = {
    color: '#a1a8b1',
    fontSize: '11px'
};

const violationTextStyle = {
    justifySelf: 'end',
    color: '#ff3b30',
    fontSize: '11px',
    fontWeight: '700'
};

const faqSectionStyle = {
    marginTop: '34px'
};

const sectionLabelStyle = {
    margin: '0 0 16px',
    color: '#222831',
    fontSize: '17px',
    fontWeight: '900'
};

const faqListStyle = {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e7eaee'
};

const faqItemStyle = {
    padding: '18px 0',
    borderBottom: '1px solid #e7eaee'
};

const faqQuestionRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
};

const faqQuestionStyle = {
    color: '#303743',
    fontSize: '13px',
    lineHeight: '1.5'
};

const faqArrowStyle = {
    color: '#9da5b0',
    fontSize: '13px'
};

const faqAnswerStyle = {
    margin: '10px 0 0',
    color: '#717985',
    fontSize: '12px',
    lineHeight: '1.65'
};

const footerStyle = {
    minHeight: '88px',
    padding: '22px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e8ebef'
};

const footerTextStyle = {
    color: '#9ba2ad',
    fontSize: '12px'
};

const footerButtonStyle = {
    minWidth: '150px',
    height: '42px',
    padding: '0 18px',
    backgroundColor: '#eef0f3',
    border: 'none',
    borderRadius: '9px',
    color: '#7b8490',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700'
};

const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.42)'
};

const introModalStyle = {
    width: '380px',
    maxWidth: 'calc(100% - 40px)',
    padding: '32px',
    boxSizing: 'border-box',
    position: 'relative',
    backgroundColor: '#ffffff',
    boxShadow: '0 14px 40px rgba(0,0,0,0.18)'
};

const modalCloseStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '5px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999999',
    cursor: 'pointer'
};

const introHeaderStyle = {
    marginTop: '8px',
    marginBottom: '26px',
    textAlign: 'center'
};

const coreValueBadgeStyle = {
    padding: '4px 10px',
    border: '1px solid #3b82f6',
    color: '#3b82f6',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1px'
};

const introTitleStyle = {
    margin: '16px 0 8px',
    color: '#111111',
    fontSize: '21px',
    lineHeight: '1.4'
};

const introAccentStyle = {
    color: '#3b82f6'
};

const introSubtitleStyle = {
    margin: 0,
    color: '#666666',
    fontSize: '13px'
};

const introListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const introItemStyle = {
    padding: '15px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '13px',
    backgroundColor: '#fdfdfd',
    border: '1px solid #eaeaea'
};

const introNumberStyle = {
    width: '28px',
    height: '28px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '800'
};

const introItemTitleStyle = {
    display: 'block',
    marginBottom: '4px',
    color: '#111111',
    fontSize: '13px'
};

const introItemTextStyle = {
    margin: 0,
    color: '#606873',
    fontSize: '12px',
    lineHeight: '1.55'
};

export default Guide;