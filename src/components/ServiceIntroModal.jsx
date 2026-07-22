import React, { useEffect } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';

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
    const isMobile = useMediaQuery('(max-width: 640px)');

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
            style={{
                ...modalOverlayStyle,
                ...(isMobile
                    ? mobileModalOverlayStyle
                    : null)
            }}
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="서비스 소개"
                style={{
                    ...introModalStyle,
                    ...(isMobile
                        ? mobileIntroModalStyle
                        : null)
                }}
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

                <div
                    style={{
                        ...introHeaderStyle,
                        ...(isMobile
                            ? mobileIntroHeaderStyle
                            : null)
                    }}
                >
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
                            style={{
                                ...introFeatureStyle,
                                ...(isMobile
                                    ? mobileIntroFeatureStyle
                                    : null)
                            }}
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
    width: '100%',
    height: '100dvh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
};

const mobileModalOverlayStyle = {
    alignItems: 'center',
    padding: '12px',
    boxSizing: 'border-box'
};

const introModalStyle = {
    backgroundColor: '#fff',
    width: '380px',
    maxWidth: 'calc(100% - 40px)',
    padding: '32px',
    boxSizing: 'border-box',
    position: 'relative',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    borderRadius: 0,
    border: '1px solid #222',
    maxHeight: 'calc(100dvh - 24px)',
    overflowY: 'auto'
};

const mobileIntroModalStyle = {
    width: '100%',
    maxWidth: '100%',
    padding: '24px 18px 20px'
};

const closeIconBtnStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer'
};

const introHeaderStyle = {
    textAlign: 'center',
    marginBottom: '28px',
    marginTop: '8px'
};

const mobileIntroHeaderStyle = {
    marginBottom: '20px'
};

const coreValueBadgeStyle = {
    border: '1px solid #3b82f6',
    color: '#3b82f6',
    padding: '4px 10px',
    borderRadius: 0,
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
    margin: 0,
    fontSize: '13px',
    color: '#666'
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
    borderRadius: 0,
    border: '1px solid #eaeaea'
};

const mobileIntroFeatureStyle = {
    padding: '14px 12px',
    gap: '10px'
};

const introFeatureIconStyle = {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    width: '28px',
    height: '28px',
    borderRadius: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0
};

const introFeatureTitleStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '4px'
};

const introFeatureDescStyle = {
    fontSize: '12px',
    color: '#555',
    lineHeight: '1.5',
    wordBreak: 'keep-all'
};

export default ServiceIntroModal;
