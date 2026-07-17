import { findReviewIndicator } from '../constants/reviewIndicators';

const STRUCTURED_SOURCE_KEYS = [
    'checklistStats',
    'cleanScoreEvidence',
    'cleanScoreIndicators',
    'indicatorStats',
    'indicatorSummary',
    'complianceStats',
    'reviewStats',
    'oxStats',
    'ox_stats'
];

const numberFromValue = (value) => {
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

const pickFirstNumber = (source, keys) => {
    if (!source || typeof source !== 'object') {
        return null;
    }

    for (const key of keys) {
        const value = numberFromValue(source[key]);

        if (value !== null) {
            return value;
        }
    }

    return null;
};

const pickFirstText = (source, keys) => {
    if (!source || typeof source !== 'object') {
        return null;
    }

    for (const key of keys) {
        const value = source[key];

        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return null;
};

const percentText = (ratio) => {
    if (!Number.isFinite(ratio)) {
        return null;
    }

    if (ratio <= 1) {
        return `${Math.round(ratio * 100)}%`;
    }

    return `${Math.round(ratio)}%`;
};

const resolveStructuredSource = (workspace) => {
    for (const key of STRUCTURED_SOURCE_KEYS) {
        const candidate = workspace?.[key];

        if (candidate && typeof candidate === 'object') {
            return candidate;
        }
    }

    return null;
};

const resolveFallbackText = (workspace) => {
    const raw = workspace?.oxStats;

    if (typeof raw === 'string' && raw.trim()) {
        return raw.trim();
    }

    return null;
};

const toEntries = (source) => {
    if (!source) {
        return [];
    }

    if (Array.isArray(source)) {
        return source;
    }

    if (Array.isArray(source.items)) {
        return source.items;
    }

    if (Array.isArray(source.entries)) {
        return source.entries;
    }

    if (Array.isArray(source.stats)) {
        return source.stats;
    }

    return Object.entries(source).map(([key, value]) => ({
        key,
        value
    }));
};

const normalizeStructuredEntry = (
    entry,
    totalReviewCount
) => {
    const rawKey =
        entry?.id ||
        entry?.item ||
        entry?.code ||
        entry?.key ||
        entry?.name ||
        entry?.title ||
        entry?.label;
    const indicator = findReviewIndicator(rawKey);

    if (!indicator) {
        return null;
    }

    const nested =
        entry?.value &&
        typeof entry.value === 'object' &&
        !Array.isArray(entry.value)
            ? entry.value
            : entry;

    const primitiveValue =
        nested === entry &&
        (typeof entry?.value === 'number' ||
            typeof entry?.value === 'boolean' ||
            typeof entry?.value === 'string')
            ? entry.value
            : null;

    const primitiveNumber = numberFromValue(primitiveValue);
    const violationCount =
        pickFirstNumber(nested, [
            'violationCount',
            'violatedCount',
            'negativeCount',
            'riskCount',
            'noCount',
            'falseCount'
        ]) ??
        primitiveNumber;
    const complianceCount = pickFirstNumber(nested, [
        'complianceCount',
        'compliantCount',
        'positiveCount',
        'safeCount',
        'yesCount',
        'trueCount'
    ]);
    const violationRate = pickFirstNumber(nested, [
        'violationRate',
        'negativeRate',
        'riskRate',
        'falseRate'
    ]);
    const complianceRate = pickFirstNumber(nested, [
        'complianceRate',
        'positiveRate',
        'safeRate',
        'yesRate',
        'trueRate'
    ]);
    const totalCount =
        pickFirstNumber(nested, [
            'totalCount',
            'total',
            'responseCount',
            'responses',
            'reviewCount'
        ]) ||
        (Number.isFinite(violationCount) &&
        Number.isFinite(complianceCount)
            ? violationCount + complianceCount
            : totalReviewCount || null);

    return {
        id: indicator.id,
        label: indicator.label,
        positiveLabel: indicator.positiveLabel,
        violationCount,
        complianceCount,
        violationRate,
        complianceRate,
        totalCount,
        summary:
            pickFirstText(nested, [
                'summary',
                'description',
                'reason',
                'detail'
            ]) ||
            (typeof primitiveValue === 'string' &&
            !Number.isFinite(primitiveNumber)
                ? primitiveValue.trim()
                : null)
    };
};

const buildPositiveItem = (entry) => {
    let score = 0;
    let metric = null;
    let description = entry.summary;

    if (Number.isFinite(entry.complianceRate)) {
        const ratio =
            entry.complianceRate > 1
                ? entry.complianceRate / 100
                : entry.complianceRate;

        score = ratio;
        metric = percentText(entry.complianceRate);
        description =
            description ||
            `응답의 ${metric}가 해당 기준이 잘 지켜졌다고 평가했어요.`;
    } else if (
        Number.isFinite(entry.complianceCount) &&
        Number.isFinite(entry.totalCount) &&
        entry.totalCount > 0
    ) {
        score = entry.complianceCount / entry.totalCount;
        metric = `${entry.complianceCount}/${entry.totalCount}`;
        description =
            description ||
            `${entry.totalCount}건 중 ${entry.complianceCount}건이 준수로 집계됐어요.`;
    } else if (
        Number.isFinite(entry.violationCount) &&
        entry.violationCount === 0
    ) {
        score = 1;
        metric = '0건';
        description =
            description ||
            (entry.totalCount
                ? `총 ${entry.totalCount}건의 후기에서 관련 위반 제보가 없었어요.`
                : '현재까지 관련 위반 제보가 확인되지 않았어요.');
    } else if (
        Number.isFinite(entry.violationCount) &&
        Number.isFinite(entry.totalCount) &&
        entry.totalCount > entry.violationCount
    ) {
        const safeCount =
            entry.totalCount - entry.violationCount;

        score = safeCount / entry.totalCount;
        metric = `${safeCount}/${entry.totalCount}`;
        description =
            description ||
            `${entry.totalCount}건 중 ${safeCount}건에서 문제 없이 평가됐어요.`;
    } else {
        return null;
    }

    return {
        id: entry.id,
        label: entry.positiveLabel,
        metric,
        score,
        description
    };
};

const buildNegativeItem = (entry) => {
    if (
        Number.isFinite(entry.violationRate) &&
        entry.violationRate > 0
    ) {
        const score =
            entry.violationRate > 1
                ? entry.violationRate / 100
                : entry.violationRate;

        return {
            id: entry.id,
            label: entry.label,
            metric: percentText(entry.violationRate),
            score,
            description:
                entry.summary ||
                `응답의 ${percentText(entry.violationRate)}가 이 항목의 문제를 언급했어요.`
        };
    }

    if (
        Number.isFinite(entry.violationCount) &&
        entry.violationCount > 0
    ) {
        return {
            id: entry.id,
            label: entry.label,
            metric: `${entry.violationCount}건`,
            score: entry.violationCount,
            description:
                entry.summary ||
                (entry.totalCount
                    ? `총 ${entry.totalCount}건 중 ${entry.violationCount}건에서 이 문제가 제기됐어요.`
                    : `${entry.violationCount}건의 후기에서 이 문제가 확인됐어요.`)
        };
    }

    return null;
};

export const getWorkspaceEvidenceSummary = (workspace) => {
    const focus =
        Number(workspace?.cleanScore) >= 80
            ? 'positive'
            : 'negative';
    const structuredSource =
        resolveStructuredSource(workspace);
    const entries = toEntries(structuredSource)
        .map((entry) =>
            normalizeStructuredEntry(
                entry,
                workspace?.reviewCount
            )
        )
        .filter(Boolean);

    const items = entries
        .map((entry) =>
            focus === 'positive'
                ? buildPositiveItem(entry)
                : buildNegativeItem(entry)
        )
        .filter(Boolean)
        .sort((left, right) => right.score - left.score)
        .slice(0, 3);

    return {
        focus,
        heading:
            focus === 'positive'
                ? '잘 지켜진 항목'
                : '주의가 필요한 항목',
        items,
        fallbackText:
            resolveFallbackText(workspace) ||
            (focus === 'positive'
                ? '긍정 지표를 계산할 데이터가 아직 충분하지 않습니다.'
                : '위험 지표를 계산할 데이터가 아직 충분하지 않습니다.')
    };
};
