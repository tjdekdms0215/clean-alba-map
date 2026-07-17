const TOKEN_KEY = 'jwt_token';
const EMAIL_KEY = 'user_email';
const NICKNAME_KEY = 'user_nickname';
const ROLE_KEY = 'user_role';
const REDIRECT_KEY = 'post_login_redirect_path';
const OAUTH_STATE_KEY = 'kakao_oauth_state';

const KAKAO_REST_API_KEY =
    import.meta.env.VITE_KAKAO_REST_API_KEY;

const KAKAO_REDIRECT_URI =
    import.meta.env.VITE_KAKAO_REDIRECT_URI;

export const getStoredAuth = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const nickname = localStorage.getItem(NICKNAME_KEY) || '';
    const role = localStorage.getItem(ROLE_KEY) || '';

    return {
        token,
        nickname,
        role,
        isLoggedIn: Boolean(token),
        isAdmin: role === 'ADMIN'
    };
};

export const isAuthenticated = () =>
    Boolean(localStorage.getItem(TOKEN_KEY));

export const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NICKNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
};

export const persistAuth = ({
    token,
    userEmail,
    email,
    nickname,
    userRole,
    role
}) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    const resolvedEmail = userEmail || email;
    const resolvedRole = userRole || role;

    if (resolvedEmail) {
        localStorage.setItem(EMAIL_KEY, resolvedEmail);
    }

    if (nickname) {
        localStorage.setItem(NICKNAME_KEY, nickname);
    }

    if (resolvedRole) {
        localStorage.setItem(ROLE_KEY, resolvedRole);
    }
};

export const setPostLoginRedirectPath = (path) => {
    if (path) {
        sessionStorage.setItem(REDIRECT_KEY, path);
    }
};

export const consumePostLoginRedirectPath = () => {
    const path = sessionStorage.getItem(REDIRECT_KEY);

    sessionStorage.removeItem(REDIRECT_KEY);

    return path;
};

export const getStoredOauthState = () =>
    sessionStorage.getItem(OAUTH_STATE_KEY);

export const clearStoredOauthState = () => {
    sessionStorage.removeItem(OAUTH_STATE_KEY);
};

export const beginKakaoLogin = () => {
    if (!KAKAO_REST_API_KEY || !KAKAO_REDIRECT_URI) {
        return false;
    }

    const state = window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

    sessionStorage.setItem(OAUTH_STATE_KEY, state);

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        state
    });

    window.location.assign(
        `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
    );

    return true;
};
