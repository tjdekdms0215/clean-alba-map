export const REVIEW_INDICATORS = [
    {
        id: 'NO_CONTRACT',
        label: '근로계약서 미작성',
        positiveLabel: '근로계약서 작성',
        requestKey: 'contractViolation',
        aliases: [
            '근로계약서작성',
            '계약서',
            'CONTRACT',
            'CONTRACT_VIOLATION',
            'CONTRACTVIOLATION'
        ]
    },
    {
        id: 'MINIMUM_WAGE',
        label: '최저시급 미준수',
        positiveLabel: '최저시급 준수',
        requestKey: 'minimumWageViolation',
        aliases: [
            '최저임금',
            '시급',
            'MINIMUM_WAGE',
            'MINIMUMWAGE',
            'MINIMUMWAGEVIOLATION'
        ]
    },
    {
        id: 'WEEKLY_ALLOWANCE',
        label: '주휴수당 미지급',
        positiveLabel: '주휴수당 지급',
        requestKey: 'weeklyHolidayAllowanceViolation',
        aliases: [
            '주휴수당',
            'WEEKLY_ALLOWANCE',
            'WEEKLYHOLIDAYALLOWANCE',
            'WEEKLY_HOLIDAY_ALLOWANCE',
            'WEEKLYHOLIDAYALLOWANCEVIOLATION'
        ]
    },
    {
        id: 'PAY_DELAY',
        label: '급여 지급 지연',
        positiveLabel: '급여 지급 일정 준수',
        requestKey: 'wageDelayViolation',
        aliases: [
            '임금체불',
            '급여지연',
            'WAGE_DELAY',
            'PAY_DELAY',
            'WAGEDELAYVIOLATION'
        ]
    },
    {
        id: 'OVERTIME_PAY',
        label: '초과근무 급여 미지급',
        positiveLabel: '초과근무 급여 지급',
        requestKey: 'overtimePayViolation',
        aliases: [
            '초과근무',
            '야근수당',
            'OVERTIME_PAY',
            'OVERTIMEPAY',
            'OVERTIMEPAYVIOLATION'
        ]
    }
];

export const REVIEW_FORM_INDICATORS = REVIEW_INDICATORS;

export const normalizeIndicatorKey = (value = '') =>
    String(value)
        .trim()
        .toUpperCase()
        .replace(/[^0-9A-Z가-힣]/g, '');

const isTruthyFlag = (value) =>
    value === true ||
    value === 1 ||
    value === '1' ||
    value === 'true' ||
    value === 'TRUE' ||
    value === 'Y';

export const findReviewIndicator = (value) => {
    const normalizedValue = normalizeIndicatorKey(value);

    if (!normalizedValue) {
        return null;
    }

    return (
        REVIEW_INDICATORS.find((item) => {
            const candidates = [
                item.id,
                item.label,
                item.positiveLabel,
                item.requestKey,
                ...(item.aliases || [])
            ];

            return candidates.some(
                (candidate) =>
                    normalizeIndicatorKey(candidate) ===
                    normalizedValue
            );
        }) || null
    );
};

export const getViolationIndicatorIds = (
    source = {}
) => {
    const explicitValue =
        source?.violationItems ||
        source?.indicatorIds ||
        source?.tags ||
        null;

    if (Array.isArray(explicitValue)) {
        return Array.from(
            new Set(
                explicitValue
                    .map((value) => findReviewIndicator(value)?.id)
                    .filter(Boolean)
            )
        );
    }

    if (
        typeof explicitValue === 'string' &&
        explicitValue.trim()
    ) {
        return Array.from(
            new Set(
                explicitValue
                    .split(',')
                    .map((value) => findReviewIndicator(value)?.id)
                    .filter(Boolean)
            )
        );
    }

    return REVIEW_INDICATORS.filter((indicator) =>
        isTruthyFlag(
            source?.[indicator.requestKey] ??
                source?.[`${indicator.requestKey}Boolean`]
        )
    ).map((indicator) => indicator.id);
};

export const buildReviewRequestPayload = ({
    selectedIndicatorIds = [],
    coworkerCount = null,
    content = ''
}) => {
    const selectedSet = new Set(selectedIndicatorIds);
    const payload = REVIEW_INDICATORS.reduce(
        (accumulator, indicator) => ({
            ...accumulator,
            [indicator.requestKey]:
                selectedSet.has(indicator.id)
        }),
        {}
    );

    if (Number.isInteger(coworkerCount) && coworkerCount >= 0) {
        payload.coworkerCount = coworkerCount;
    }

    if (typeof content === 'string' && content.trim()) {
        payload.content = content.trim();
    }

    return payload;
};
