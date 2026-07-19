export const REVIEW_SENTIMENT_OPTIONS = [
    {
        id: 'positive',
        apiValue: 'POSITIVE',
        label: '긍정',
        color: '#17A957',
        softColor: '#ECFAF1'
    },
    {
        id: 'neutral',
        apiValue: 'NEUTRAL',
        label: '보통',
        color: '#8A6A00',
        softColor: '#FFF8E2'
    },
    {
        id: 'negative',
        apiValue: 'NEGATIVE',
        label: '부정',
        color: '#E14A42',
        softColor: '#FFF2F1'
    }
];

const SENTIMENT_ALIASES = {
    positive: [
        'POSITIVE',
        'GOOD',
        'SATISFIED',
        'LIKE',
        '긍정',
        '좋음',
        '좋아요'
    ],
    neutral: [
        'NEUTRAL',
        'NORMAL',
        'AVERAGE',
        'MIXED',
        '보통',
        '중립',
        '무난'
    ],
    negative: [
        'NEGATIVE',
        'BAD',
        'UNSATISFIED',
        'DISLIKE',
        '부정',
        '나쁨',
        '별로'
    ]
};

const normalizeKey = (value = '') =>
    String(value)
        .trim()
        .toUpperCase()
        .replace(/[^0-9A-Z가-힣]/g, '');

export const normalizeReviewSentiment = (value) => {
    const normalizedValue = normalizeKey(value);

    if (!normalizedValue) {
        return '';
    }

    const matched = Object.entries(SENTIMENT_ALIASES).find(
        ([, aliases]) =>
            aliases.some(
                (alias) => normalizeKey(alias) === normalizedValue
            )
    );

    return matched?.[0] || '';
};

export const getReviewSentimentMeta = (sentiment) =>
    REVIEW_SENTIMENT_OPTIONS.find(
        (option) => option.id === sentiment
    ) || null;

const coerceNumber = (value) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const pickFirstNumber = (source, keys) => {
    if (!source || typeof source !== 'object') {
        return null;
    }

    for (const key of keys) {
        const value = coerceNumber(source[key]);

        if (value !== null) {
            return value;
        }
    }

    return null;
};

const pickFirstDefined = (source, keys) => {
    if (!source || typeof source !== 'object') {
        return undefined;
    }

    for (const key of keys) {
        const value = source[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ''
        ) {
            return value;
        }
    }

    return undefined;
};

const pickSentimentStatsSource = (source = {}) => {
    const candidates = [
        source?.reviewSentiment,
        source?.reviewSentimentStats,
        source?.sentimentStats,
        source?.sentimentSummary,
        source?.reviewMood,
        source?.reviewMoodStats,
        source?.moodStats,
        source?.atmosphereStats,
        source?.sentiments,
        source
    ];

    return (
        candidates.find(
            (candidate) =>
                candidate &&
                typeof candidate === 'object' &&
                !Array.isArray(candidate)
        ) || {}
    );
};

const getReviewSentimentValue = (review = {}) =>
    pickFirstDefined(review, [
        'sentiment',
        'reviewSentiment',
        'review_sentiment',
        'sentimentType',
        'sentiment_type',
        'mood',
        'reviewMood',
        'review_mood',
        'atmosphere',
        'tone'
    ]);

const normalizeRates = (rates) => {
    const total =
        rates.positive + rates.neutral + rates.negative;

    if (total <= 0) {
        return {
            positive: 0,
            neutral: 0,
            negative: 0
        };
    }

    if (total === 100) {
        return rates;
    }

    return {
        positive: Math.round((rates.positive / total) * 100),
        neutral: Math.round((rates.neutral / total) * 100),
        negative: Math.round((rates.negative / total) * 100)
    };
};

const getDominantSentiment = (rates) => {
    const values = REVIEW_SENTIMENT_OPTIONS.map((option) => ({
        id: option.id,
        rate: rates[option.id] || 0
    }));
    const maxRate = Math.max(...values.map((item) => item.rate));

    if (maxRate <= 0) {
        return '';
    }

    const winners = values.filter((item) => item.rate === maxRate);

    if (winners.length === 1) {
        return winners[0].id;
    }

    return '';
};

export const buildReviewSentimentStats = ({
    source = {},
    reviews = []
} = {}) => {
    const dominantKeys = [
        'dominantReviewSentiment',
        'dominantSentiment'
    ];
    const hasExplicitDominant = dominantKeys.some((key) =>
        Object.prototype.hasOwnProperty.call(source, key)
    );
    const explicitDominantSentiment = normalizeReviewSentiment(
        pickFirstDefined(source, dominantKeys)
    );
    const directSentiment = normalizeReviewSentiment(
        pickFirstDefined(source, [
            'reviewSentiment',
            'sentiment',
            'mood',
            'reviewMood',
            'atmosphere'
        ])
    );
    const statsSource = pickSentimentStatsSource(source);
    const counts = {
        positive:
            pickFirstNumber(statsSource, [
                'positiveCount',
                'positive_count',
                'positiveReviews',
                'positive',
                'goodCount'
            ]) ?? 0,
        neutral:
            pickFirstNumber(statsSource, [
                'neutralCount',
                'neutral_count',
                'neutralReviews',
                'neutral',
                'normalCount'
            ]) ?? 0,
        negative:
            pickFirstNumber(statsSource, [
                'negativeCount',
                'negative_count',
                'negativeReviews',
                'negative',
                'badCount'
            ]) ?? 0
    };
    const sourceRates = {
        positive:
            pickFirstNumber(statsSource, [
                'positiveRate',
                'positive_rate',
                'positivePercent',
                'positivePercentage'
            ]) ?? null,
        neutral:
            pickFirstNumber(statsSource, [
                'neutralRate',
                'neutral_rate',
                'neutralPercent',
                'neutralPercentage'
            ]) ?? null,
        negative:
            pickFirstNumber(statsSource, [
                'negativeRate',
                'negative_rate',
                'negativePercent',
                'negativePercentage'
            ]) ?? null
    };
    const totalFromCounts =
        counts.positive + counts.neutral + counts.negative;
    const hasSourceRates = Object.values(sourceRates).some(
        (value) => Number.isFinite(value)
    );

    if (totalFromCounts > 0 || hasSourceRates) {
        const rates = hasSourceRates
            ? normalizeRates({
                  positive: Math.round(sourceRates.positive || 0),
                  neutral: Math.round(sourceRates.neutral || 0),
                  negative: Math.round(sourceRates.negative || 0)
              })
            : {
                  positive: Math.round(
                      (counts.positive / totalFromCounts) * 100
                  ),
                  neutral: Math.round(
                      (counts.neutral / totalFromCounts) * 100
                  ),
                  negative: Math.round(
                      (counts.negative / totalFromCounts) * 100
                  )
              };

        return {
            counts,
            rates,
            total: totalFromCounts,
            dominant: hasExplicitDominant
                ? explicitDominantSentiment
                : getDominantSentiment(rates)
        };
    }

    const fallbackDirectSentiment = hasExplicitDominant
        ? explicitDominantSentiment
        : directSentiment;

    if (fallbackDirectSentiment) {
        return {
            counts: {
                positive:
                    fallbackDirectSentiment === 'positive' ? 1 : 0,
                neutral:
                    fallbackDirectSentiment === 'neutral' ? 1 : 0,
                negative:
                    fallbackDirectSentiment === 'negative' ? 1 : 0
            },
            rates: {
                positive:
                    fallbackDirectSentiment === 'positive' ? 100 : 0,
                neutral:
                    fallbackDirectSentiment === 'neutral' ? 100 : 0,
                negative:
                    fallbackDirectSentiment === 'negative' ? 100 : 0
            },
            total: 1,
            dominant: fallbackDirectSentiment
        };
    }

    const counted = reviews.reduce(
        (accumulator, review) => {
            const sentiment = normalizeReviewSentiment(
                getReviewSentimentValue(review)
            );

            if (sentiment) {
                accumulator[sentiment] += 1;
            }

            return accumulator;
        },
        {
            positive: 0,
            neutral: 0,
            negative: 0
        }
    );
    const total =
        counted.positive + counted.neutral + counted.negative;
    const rates =
        total > 0
            ? {
                  positive: Math.round(
                      (counted.positive / total) * 100
                  ),
                  neutral: Math.round(
                      (counted.neutral / total) * 100
                  ),
                  negative: Math.round(
                      (counted.negative / total) * 100
                  )
              }
            : {
                  positive: 0,
                  neutral: 0,
                  negative: 0
              };

    return {
        counts: counted,
        rates,
        total,
        dominant: hasExplicitDominant
            ? explicitDominantSentiment
            : getDominantSentiment(rates)
    };
};

export const formatReviewSentimentDistribution = (stats) =>
    REVIEW_SENTIMENT_OPTIONS.map(
        (option) => `${option.label} ${stats?.rates?.[option.id] || 0}%`
    ).join(' · ');
