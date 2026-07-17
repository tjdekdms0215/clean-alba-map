const DEFAULT_API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://cleanalb-map.duckdns.org';

const shouldUseSameOriginProxy = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.location.hostname.endsWith(
        'vercel.app'
    );
};

export const API_BASE_URL =
    shouldUseSameOriginProxy()
        ? '/backend'
        : DEFAULT_API_BASE_URL;
