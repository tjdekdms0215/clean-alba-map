import React, { useState } from 'react';
import { recommendAlba } from '../../api/ai';

const EXAMPLE_PROMPTS = [
    '클린점수 80점 넘는 카페 추천해줘',
    '전남대 근처에서 후기 많은 알바 찾아줘',
    '주휴수당 잘 챙겨주는 베이커리 있어?'
];

const AlbaRecommendationPanel = ({
    candidateStores,
    onFocusWorkspace,
    onApplyQuery
}) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const runRecommendation = async (nextQuery) => {
        const trimmedQuery = nextQuery.trim();

        if (!trimmedQuery) {
            setErrorMessage(
                '추천을 받으려면 원하는 조건을 자연어로 적어주세요.'
            );
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await recommendAlba(
                trimmedQuery,
                candidateStores
            );

            setResult(response);
        } catch (error) {
            console.error(
                'AI 알바 추천에 실패했습니다.',
                error
            );
            setErrorMessage(
                '추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        runRecommendation(query);
    };

    return (
        <section style={panelStyle}>
            <div style={headerStyle}>
                <div>
                    <strong style={titleStyle}>
                        AI 알바 추천
                    </strong>
                    <p style={captionStyle}>
                        자연어로 조건을 적으면 AI가 후보를 골라드려요.
                    </p>
                </div>

                <span style={badgeStyle}>beta</span>
            </div>

            <form
                onSubmit={handleSubmit}
                style={formStyle}
            >
                <textarea
                    value={query}
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                    placeholder="예: 클린점수 70점 넘는 카페 중 전남대 가까운 곳 추천해줘"
                    style={textareaStyle}
                />

                <div style={actionRowStyle}>
                    <button
                        type="submit"
                        style={submitButtonStyle}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? '추천 중...'
                            : '추천 받기'}
                    </button>

                    <button
                        type="button"
                        style={ghostButtonStyle}
                        onClick={() => {
                            onApplyQuery(query);
                            runRecommendation(query);
                        }}
                        disabled={isLoading}
                    >
                        목록에도 반영
                    </button>
                </div>
            </form>

            <div style={chipListStyle}>
                {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                        type="button"
                        key={prompt}
                        onClick={() => {
                            setQuery(prompt);
                            runRecommendation(prompt);
                        }}
                        style={chipStyle}
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {errorMessage && (
                <p style={errorTextStyle}>
                    {errorMessage}
                </p>
            )}

            {result && (
                <div style={resultBoxStyle}>
                    <div style={resultMessageStyle}>
                        {result.message}
                        {result.source === 'fallback' ? (
                            <span style={fallbackTagStyle}>
                                로컬 추천
                            </span>
                        ) : null}
                    </div>

                    <div style={cardListStyle}>
                        {result.recommendations.map(
                            (item) => (
                                <article
                                    key={`${item.workspaceId}-${item.name}`}
                                    style={cardStyle}
                                >
                                    <div
                                        style={
                                            cardTopStyle
                                        }
                                    >
                                        <strong
                                            style={
                                                cardTitleStyle
                                            }
                                        >
                                            {item.name}
                                        </strong>
                                        <span
                                            style={
                                                scoreStyle
                                            }
                                        >
                                            {item.cleanScore}
                                            점
                                        </span>
                                    </div>

                                    <div
                                        style={
                                            metaStyle
                                        }
                                    >
                                        {item.district}
                                        {' · '}
                                        {item.category}
                                        {' · '}
                                        후기{' '}
                                        {item.reviewCount}
                                        개
                                    </div>

                                    <p
                                        style={
                                            reasonStyle
                                        }
                                    >
                                        {item.reason}
                                    </p>

                                    <button
                                        type="button"
                                        style={
                                            focusButtonStyle
                                        }
                                        onClick={() =>
                                            onFocusWorkspace(
                                                item
                                            )
                                        }
                                    >
                                        이 사업장 보기
                                    </button>
                                </article>
                            )
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

const panelStyle = {
    marginTop: '14px',
    padding: '14px',
    border: '1px solid #E4E8F0',
    borderRadius: '14px',
    background:
        'linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 100%)'
};

const headerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '12px'
};

const titleStyle = {
    color: '#1C2434',
    fontSize: '15px',
    fontWeight: '900'
};

const captionStyle = {
    margin: '4px 0 0',
    color: '#8B93A1',
    fontSize: '12px',
    lineHeight: '1.5'
};

const badgeStyle = {
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#EAF0FF',
    color: '#4668EC',
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const textareaStyle = {
    width: '100%',
    minHeight: '82px',
    padding: '12px 13px',
    border: '1px solid #DCE2EB',
    borderRadius: '12px',
    boxSizing: 'border-box',
    resize: 'vertical',
    outline: 'none',
    color: '#2B3340',
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: 'inherit'
};

const actionRowStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
};

const submitButtonStyle = {
    flex: 1,
    minWidth: '120px',
    height: '38px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#4668EC',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '800'
};

const ghostButtonStyle = {
    minWidth: '112px',
    height: '38px',
    padding: '0 12px',
    border: '1px solid #DCE2EB',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    color: '#556071',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700'
};

const chipListStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px'
};

const chipStyle = {
    padding: '7px 10px',
    border: '1px solid #E2E6EE',
    borderRadius: '999px',
    backgroundColor: '#FFFFFF',
    color: '#677180',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700'
};

const errorTextStyle = {
    margin: '10px 0 0',
    color: '#D74F4F',
    fontSize: '12px'
};

const resultBoxStyle = {
    marginTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const resultMessageStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    color: '#4F5A6C',
    fontSize: '12px',
    lineHeight: '1.5'
};

const fallbackTagStyle = {
    padding: '3px 8px',
    borderRadius: '999px',
    backgroundColor: '#FFF2DD',
    color: '#C67608',
    fontSize: '10px',
    fontWeight: '800'
};

const cardListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const cardStyle = {
    padding: '12px',
    border: '1px solid #E5E9F0',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF'
};

const cardTopStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
};

const cardTitleStyle = {
    color: '#1F2735',
    fontSize: '14px',
    fontWeight: '800'
};

const scoreStyle = {
    color: '#1FA84F',
    fontSize: '13px',
    fontWeight: '800'
};

const metaStyle = {
    marginTop: '6px',
    color: '#9098A4',
    fontSize: '11px',
    fontWeight: '600'
};

const reasonStyle = {
    margin: '8px 0 0',
    color: '#556071',
    fontSize: '12px',
    lineHeight: '1.6'
};

const focusButtonStyle = {
    marginTop: '10px',
    height: '32px',
    padding: '0 12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#EDF2FF',
    color: '#4668EC',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '800'
};

export default AlbaRecommendationPanel;
