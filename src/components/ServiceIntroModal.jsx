import React, { useEffect } from 'react';

const FEATURES = [
    {
        number: '01',
        title: '클린 지수 시각화',
        description:
            '사업장의 근로기준법 준수 여부를 100점 만점으로 점수화해 컬러 핀으로 표시합니다.'
    },
    {
        number: '02',
        title: '인증 기반 후기',
        description:
            '실제 근로 증명 자료를 첨부해야만 후기를 작성할 수 있어 객관적이고 신뢰할 수 있습니다.'
    },
    {
        number: '03',
        title: 'AI 후기 순화',
        description:
            '명예훼손 소지가 있는 표현을 안전한 언어로 자동 변환해 작성자의 법적 리스크를 낮춥니다.'
    }
];

const ServiceIntroModal = ({
    isOpen,
    onClose
}) => {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            style={modalOverlayStyle}
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="서비스 소개"
                style={introModalStyle}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    onClick={onClose}
                    style={closeIconBtnStyle}
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
                        <span
                            style={introTitleAccentStyle}
                        >
                            전남대 클린알바맵
                        </span>
                    </h2>

                    <p style={introSubtitleStyle}>
                        솔직한 후기, 공정한 평가로 더 나은
                        문화를 만듭니다.
                    </p>
                </div>

                <div style={introFeatureListStyle}>
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.number}
                            style={introFeatureStyle}
                        >
                            <div
                                style={introFeatureIconStyle}
                            >
                                {feature.number}
                            </div>

                            <div>
                                <div
                                    style={
                                        introFeatureTitleStyle
                                    }
                                >
                                    {feature.title}
                                </div>

                                <div
                                    style={
                                        introFeatureDescStyle
                                    }
                                >
                                    {feature.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.52)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 1200
};

const introModalStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '640px',
    maxHeight: 'calc(100vh - 48px)',
    overflowY: 'auto',
    padding: '32px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 26px 60px rgba(15, 23, 42, 0.24)'
};

const closeIconBtnStyle = {
    position: 'absolute',
    top: '18px',
    right: '18px',
    width: '36px',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '999px',
    backgroundColor: '#f3f5f8',
    color: '#6b7280',
    fontSize: '16px',
    cursor: 'pointer'
};

const introHeaderStyle = {
    marginBottom: '26px'
};

const coreValueBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    height: '28px',
    padding: '0 12px',
    borderRadius: '999px',
    backgroundColor: '#eaf0ff',
    color: '#3d63f3',
    fontSize: '12px',
    fontWeight: '900',
    letterSpacing: '0.06em'
};

const introTitleStyle = {
    margin: '18px 0 12px',
    color: '#121826',
    fontSize: 'clamp(28px, 4vw, 38px)',
    fontWeight: '900',
    lineHeight: '1.18',
    letterSpacing: '-0.04em'
};

const introTitleAccentStyle = {
    color: '#3f64f4'
};

const introSubtitleStyle = {
    margin: 0,
    color: '#667085',
    fontSize: '15px',
    lineHeight: '1.7',
    fontWeight: '500'
};

const introFeatureListStyle = {
    display: 'grid',
    gap: '16px'
};

const introFeatureStyle = {
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: '56px minmax(0, 1fr)',
    gap: '18px',
    alignItems: 'flex-start',
    borderRadius: '18px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e8edf4'
};

const introFeatureIconStyle = {
    width: '56px',
    height: '56px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '18px',
    backgroundColor: '#4063ff',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '900'
};

const introFeatureTitleStyle = {
    marginBottom: '8px',
    color: '#121826',
    fontSize: '17px',
    fontWeight: '900'
};

const introFeatureDescStyle = {
    color: '#667085',
    fontSize: '14px',
    lineHeight: '1.7',
    fontWeight: '500'
};

export default ServiceIntroModal;
