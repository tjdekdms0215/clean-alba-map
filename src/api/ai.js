import api from './axios';

const RECOMMENDER_ENDPOINTS = [
    '/ai/alba-recommender',
    '/recommendations/alba',
    '/workspaces/recommend'
];

const CONTRACT_ANALYZER_ENDPOINTS = [
    '/ai/contract-analyzer',
    '/contracts/analyze',
    '/contract/analyze'
];

const shouldFallback = (error) =>
    [404, 405, 422, 501].includes(
        error?.response?.status
    );

const coerceNumber = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string') {
        const match = value.match(/-?\d+(\.\d+)?/);

        if (match) {
            return Number(match[0]);
        }
    }

    return null;
};

const pickFirstText = (source, keys) => {
    if (!source || typeof source !== 'object') {
        return '';
    }

    for (const key of keys) {
        const value = source[key];

        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return '';
};

const normalizeRecommendation = (item) => ({
    workspaceId:
        item?.workspaceId ||
        item?.id ||
        item?.workspace_id ||
        null,
    name:
        item?.name ||
        item?.workspaceName ||
        item?.placeName ||
        item?.title ||
        '이름 없음',
    district:
        item?.district ||
        item?.region ||
        item?.address ||
        '지역 정보 없음',
    category:
        item?.category ||
        item?.categoryName ||
        item?.type ||
        '업종 정보 없음',
    cleanScore:
        coerceNumber(
            item?.cleanScore || item?.score
        ) || 0,
    reviewCount:
        coerceNumber(item?.reviewCount) || 0,
    reason:
        pickFirstText(item, [
            'reason',
            'summary',
            'description',
            'comment'
        ]) || '조건에 맞는 추천 결과입니다.'
});

const normalizeRecommendationResponse = (
    payload,
    query,
    candidates
) => {
    const raw = payload?.data || payload?.result || payload;
    const collection = Array.isArray(raw)
        ? raw
        : raw?.recommendations ||
          raw?.items ||
          raw?.results ||
          [];
    const recommendations = collection
        .map(normalizeRecommendation)
        .filter((item) => item.workspaceId || item.name)
        .slice(0, 4);

    if (!recommendations.length) {
        return buildFallbackRecommendations(
            query,
            candidates
        );
    }

    return {
        source: 'remote',
        message:
            pickFirstText(raw, [
                'message',
                'summary',
                'description'
            ]) || 'AI가 조건에 맞는 알바 자리를 추천했어요.',
        recommendations
    };
};

const buildReason = ({
    candidate,
    minScore,
    matchedCategory,
    matchedLocation
}) => {
    const pieces = [];

    if (
        Number.isFinite(minScore) &&
        candidate.cleanScore >= minScore
    ) {
        pieces.push(
            `클린점수 ${candidate.cleanScore}점`
        );
    }

    if (matchedCategory) {
        pieces.push(
            `${matchedCategory} 업종 조건과 맞아요`
        );
    }

    if (matchedLocation) {
        pieces.push(
            `${matchedLocation} 근처 후보예요`
        );
    }

    if (!pieces.length) {
        pieces.push('점수와 후기 수를 함께 고려한 추천이에요');
    }

    return pieces.join(' · ');
};

const buildFallbackRecommendations = (
    query,
    candidates = []
) => {
    const trimmedQuery = query.trim();
    const normalizedQuery =
        trimmedQuery.toLowerCase();
    const minScoreMatch =
        trimmedQuery.match(/(\d+)\s*점/);
    const minScore = minScoreMatch
        ? Number(minScoreMatch[1])
        : null;
    const categoryKeywords = [
        '카페',
        '편의점',
        '베이커리',
        '식당',
        '주점',
        '패스트푸드',
        '마트'
    ];
    const matchedCategory = categoryKeywords.find((keyword) =>
        normalizedQuery.includes(keyword.toLowerCase())
    );
    const filtered = candidates
        .filter((candidate) => {
            const score =
                coerceNumber(candidate?.cleanScore) || 0;
            const category = String(
                candidate?.category || ''
            ).toLowerCase();
            const district = String(
                candidate?.district ||
                    candidate?.region ||
                    candidate?.address ||
                    ''
            ).toLowerCase();

            if (
                Number.isFinite(minScore) &&
                score < minScore
            ) {
                return false;
            }

            if (
                matchedCategory &&
                !category.includes(
                    matchedCategory.toLowerCase()
                )
            ) {
                return false;
            }

            if (
                normalizedQuery.includes('전남대') &&
                !district.includes('전남대')
            ) {
                return false;
            }

            return true;
        })
        .sort((left, right) => {
            const scoreGap =
                (right.cleanScore || 0) -
                (left.cleanScore || 0);

            if (scoreGap !== 0) {
                return scoreGap;
            }

            return (
                (right.reviewCount || 0) -
                (left.reviewCount || 0)
            );
        })
        .slice(0, 4)
        .map((candidate) => ({
            workspaceId: candidate.workspaceId,
            name: candidate.name || '이름 없음',
            district:
                candidate.district ||
                candidate.region ||
                candidate.address ||
                '지역 정보 없음',
            category:
                candidate.category || '업종 정보 없음',
            cleanScore:
                coerceNumber(candidate.cleanScore) || 0,
            reviewCount:
                coerceNumber(candidate.reviewCount) || 0,
            reason: buildReason({
                candidate,
                minScore,
                matchedCategory,
                matchedLocation:
                    normalizedQuery.includes('전남대')
                        ? '전남대'
                        : ''
            })
        }));

    return {
        source: 'fallback',
        message: filtered.length
            ? `현재 데이터 기준으로 "${trimmedQuery}" 조건에 맞는 후보를 추려봤어요.`
            : `현재 데이터에서는 "${trimmedQuery}"에 꼭 맞는 후보를 찾지 못해 점수가 높은 사업장을 먼저 보여드려요.`,
        recommendations:
            filtered.length > 0
                ? filtered
                : candidates
                      .slice()
                      .sort(
                          (left, right) =>
                              (right.cleanScore || 0) -
                              (left.cleanScore || 0)
                      )
                      .slice(0, 4)
                      .map((candidate) => ({
                          workspaceId:
                              candidate.workspaceId,
                          name:
                              candidate.name ||
                              '이름 없음',
                          district:
                              candidate.district ||
                              candidate.region ||
                              candidate.address ||
                              '지역 정보 없음',
                          category:
                              candidate.category ||
                              '업종 정보 없음',
                          cleanScore:
                              coerceNumber(
                                  candidate.cleanScore
                              ) || 0,
                          reviewCount:
                              coerceNumber(
                                  candidate.reviewCount
                              ) || 0,
                          reason:
                              '조건과 가까운 상위 점수 사업장이에요.'
                      }))
    };
};

export const recommendAlba = async (
    query,
    candidates = []
) => {
    const lightweightCandidates = candidates
        .slice(0, 60)
        .map((candidate) => ({
            workspaceId: candidate.workspaceId,
            name: candidate.name,
            district:
                candidate.district ||
                candidate.region ||
                candidate.address,
            category: candidate.category,
            cleanScore: candidate.cleanScore,
            reviewCount: candidate.reviewCount
        }));
    let lastError = null;

    for (const endpoint of RECOMMENDER_ENDPOINTS) {
        try {
            const response = await api.post(endpoint, {
                query,
                candidates: lightweightCandidates
            });

            return normalizeRecommendationResponse(
                response.data,
                query,
                candidates
            );
        } catch (error) {
            lastError = error;

            if (!shouldFallback(error)) {
                break;
            }
        }
    }

    if (lastError) {
        console.warn(
            '알바 추천 API 응답을 받지 못해 로컬 추천을 사용합니다.',
            lastError
        );
    }

    return buildFallbackRecommendations(
        query,
        candidates
    );
};

const normalizeContractCheck = (item) => ({
    title:
        item?.title ||
        item?.name ||
        item?.label ||
        '확인 항목',
    status:
        item?.status ||
        item?.result ||
        item?.level ||
        'warning',
    detail:
        item?.detail ||
        item?.description ||
        item?.summary ||
        'AI가 이 항목을 확인 중입니다.'
});

const normalizeContractResponse = (
    payload,
    file
) => {
    const raw = payload?.data || payload?.result || payload;
    const checks = (
        raw?.checks ||
        raw?.items ||
        raw?.sections ||
        []
    )
        .map(normalizeContractCheck)
        .filter((item) => item.title);

    if (!checks.length) {
        return buildFallbackContractResult(file);
    }

    return {
        source: 'remote',
        summary:
            pickFirstText(raw, [
                'summary',
                'message',
                'description'
            ]) ||
            `${file.name} 계약서의 주요 조항을 분석했어요.`,
        checks,
        alerts:
            raw?.alerts ||
            raw?.warnings ||
            [],
        nextSteps:
            raw?.nextSteps ||
            raw?.recommendations ||
            []
    };
};

const buildFallbackContractResult = (file) => ({
    source: 'fallback',
    summary:
        `${file.name} 업로드는 완료됐어요. AI 응답이 지연되어 기본 체크리스트를 먼저 보여드릴게요.`,
    checks: [
        {
            title: '근로계약 기간',
            status: 'warning',
            detail:
                '계약 시작일과 종료일, 수습 기간 여부가 명확히 적혀 있는지 확인해 주세요.'
        },
        {
            title: '임금 및 지급 방식',
            status: 'success',
            detail:
                '시급 또는 월급, 지급일, 지급 방법이 빠지지 않았는지 우선 점검하는 것이 좋아요.'
        },
        {
            title: '근로시간과 휴게시간',
            status: 'warning',
            detail:
                '출근·퇴근 시간, 휴게시간, 주당 근무시간이 빠지면 분쟁 시 불리할 수 있어요.'
        },
        {
            title: '주휴수당·초과근무 문구',
            status: 'danger',
            detail:
                '주휴수당, 연장·야간·휴일근로 수당 관련 설명이 없다면 별도 확인이 필요합니다.'
        }
    ],
    alerts: [
        '서명 전에는 공란이 없는지 확인해 주세요.',
        '계약서 사본 또는 사진을 본인이 보관하는 것이 좋습니다.'
    ],
    nextSteps: [
        '임금, 근로시간, 휴게시간이 누락되지 않았는지 사업주와 다시 확인해 보세요.',
        '애매한 조항은 근로기준법 안내 페이지와 함께 비교해 보는 것을 권장합니다.'
    ]
});

export const analyzeContract = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    let lastError = null;

    for (const endpoint of CONTRACT_ANALYZER_ENDPOINTS) {
        try {
            const response = await api.post(
                endpoint,
                formData
            );

            return normalizeContractResponse(
                response.data,
                file
            );
        } catch (error) {
            lastError = error;

            if (!shouldFallback(error)) {
                break;
            }
        }
    }

    if (lastError) {
        console.warn(
            '계약서 분석 API 응답을 받지 못해 기본 체크리스트를 사용합니다.',
            lastError
        );
    }

    return buildFallbackContractResult(file);
};
