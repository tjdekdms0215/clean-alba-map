import React from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';

const PURIFY_OPTIONS = [
    {
        id: 'soft',
        title: '완곡형',
        subtitle: '부드럽고 완화된 표현으로 감정 충돌 없이 전달',
        accentColor: '#1fd19a'
    },
    {
        id: 'objective',
        title: '객관형',
        subtitle: '감정 없이 사실만 간결하게 기록한 진술체',
        accentColor: '#4a72ff'
    },
    {
        id: 'emotional',
        title: '감정유지형',
        subtitle: '원문 뉘앙스를 살리되 표현을 한층 순화',
        accentColor: '#ff7b1a'
    }
];

const ReviewPurifyModal = ({
    isOpen,
    isLoading,
    selectedTone,
    suggestions,
    onSelect,
    onApply,
    onClose
}) => {
    const isMobile = useMediaQuery('(max-width: 640px)');

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
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-label="AI 후기 순화"
                style={{
                    ...modalCardStyle,
                    ...(isMobile
                        ? mobileModalCardStyle
                        : null)
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <div style={modalHandleStyle} />

                <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>AI 후기 순화</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        style={modalCloseButtonStyle}
                        aria-label="AI 후기 순화 닫기"
                    >
                        ×
                    </button>
                </div>

                <div
                    style={{
                        ...modalBodyStyle,
                        ...(isMobile
                            ? mobileModalBodyStyle
                            : null)
                    }}
                >
                    {isLoading ? (
                        <div style={modalLoadingStyle}>
                            AI가 표현을 정리하고 있습니다.
                        </div>
                    ) : (
                        PURIFY_OPTIONS.map((option) => {
                            const isSelected =
                                selectedTone === option.id;

                            return (
                                <button
                                    type="button"
                                    key={option.id}
                                    onClick={() =>
                                        onSelect(option.id)
                                    }
                                    style={{
                                        ...toneCardStyle,
                                        ...(isMobile
                                            ? mobileToneCardStyle
                                            : null),
                                        borderColor: isSelected
                                            ? option.accentColor
                                            : '#e6e9ee',
                                        backgroundColor: isSelected
                                            ? `${option.accentColor}14`
                                            : '#ffffff'
                                    }}
                                >
                                    <div
                                        style={toneCardHeaderStyle}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    ...toneTitleStyle,
                                                    color: isSelected
                                                        ? option.accentColor
                                                        : '#1f2430'
                                                }}
                                            >
                                                {option.title}
                                            </div>
                                            <p
                                                style={{
                                                    ...toneSubtitleStyle,
                                                    color: isSelected
                                                        ? option.accentColor
                                                        : '#98a0ab'
                                                }}
                                            >
                                                {option.subtitle}
                                            </p>
                                        </div>

                                        <span
                                            style={{
                                                ...toneRadioStyle,
                                                borderColor: isSelected
                                                    ? option.accentColor
                                                    : '#d2d8e0',
                                                backgroundColor: isSelected
                                                    ? option.accentColor
                                                    : '#ffffff'
                                            }}
                                        >
                                            {isSelected ? '✓' : ''}
                                        </span>
                                    </div>

                                    <div style={toneTextStyle}>
                                        {suggestions[option.id] ||
                                            '순화 결과를 준비하고 있습니다.'}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                <div style={modalFooterStyle}>
                    <button
                        type="button"
                        onClick={onApply}
                        disabled={isLoading}
                        style={{
                            ...applyButtonStyle,
                            ...(isMobile
                                ? mobileApplyButtonStyle
                                : null),
                            opacity: isLoading ? 0.6 : 1
                        }}
                    >
                        이 버전으로 적용하기
                        <span aria-hidden="true">›</span>
                    </button>
                </div>
            </section>
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.48)'
};

const mobileModalOverlayStyle = {
    alignItems: 'flex-end',
    padding: '12px'
};

const modalCardStyle = {
    width: 'min(100%, 370px)',
    maxHeight: 'min(80dvh, 620px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 20px 56px rgba(0, 0, 0, 0.24)',
    overflow: 'hidden'
};

const mobileModalCardStyle = {
    width: '100%',
    maxHeight: 'min(88dvh, 760px)',
    borderRadius: '16px 16px 0 0'
};

const modalHandleStyle = {
    width: '34px',
    height: '4px',
    margin: '8px auto 0',
    borderRadius: '999px',
    backgroundColor: '#e5e8ed'
};

const modalHeaderStyle = {
    minHeight: '48px',
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eff2f6'
};

const modalTitleStyle = {
    margin: 0,
    color: '#121826',
    fontSize: '14px',
    fontWeight: '900'
};

const modalCloseButtonStyle = {
    width: '24px',
    height: '24px',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6f9',
    border: 'none',
    borderRadius: '999px',
    color: '#a0a8b3',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1
};

const modalBodyStyle = {
    padding: '14px 12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto'
};

const mobileModalBodyStyle = {
    padding: '12px 10px 8px'
};

const modalLoadingStyle = {
    padding: '48px 18px',
    color: '#798391',
    fontSize: '13px',
    textAlign: 'center'
};

const toneCardStyle = {
    width: '100%',
    padding: '14px 14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1.5px solid',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    textAlign: 'left',
    cursor: 'pointer'
};

const mobileToneCardStyle = {
    padding: '12px'
};

const toneCardHeaderStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '10px'
};

const toneTitleStyle = {
    fontSize: '12px',
    fontWeight: '900'
};

const toneSubtitleStyle = {
    margin: '4px 0 0',
    fontSize: '10px',
    fontWeight: '600',
    lineHeight: '1.5'
};

const toneRadioStyle = {
    width: '18px',
    height: '18px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderRadius: '999px',
    fontSize: '10px',
    color: '#ffffff',
    lineHeight: 1,
    flexShrink: 0
};

const toneTextStyle = {
    color: '#3d4654',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap'
};

const modalFooterStyle = {
    padding: '0 12px 12px'
};

const applyButtonStyle = {
    width: '100%',
    height: '42px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: '#4668ec',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '800'
};

const mobileApplyButtonStyle = {
    height: '44px'
};

export default ReviewPurifyModal;
