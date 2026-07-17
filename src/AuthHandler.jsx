import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    clearStoredOauthState,
    consumePostLoginRedirectPath,
    getStoredOauthState,
    persistAuth
} from './utils/auth';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://cleanalb-map.duckdns.org';

const AuthHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const savedState = getStoredOauthState();

        const sendCodeToBackend = async () => {
            if (savedState && state && savedState !== state) {
                clearStoredOauthState();
                alert('로그인 상태 검증에 실패했습니다. 다시 시도해 주세요.');
                navigate('/');
                return;
            }

            clearStoredOauthState();

            if (code) {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/api/kakao/callback?code=${encodeURIComponent(code)}`
                    );

                    if (!response.ok) {
                        throw new Error(
                            `kakaologin failed: ${response.status}`
                        );
                    }

                    const data = await response.json();

                    persistAuth({
                        token: data.token,
                        userEmail: data.userEmail,
                        email: data.email,
                        nickname: data.nickname,
                        role: data.role,
                        userRole: data.userRole
                    });

                    const userNickname =
                        data.nickname || '사용자';
                    const redirectPath =
                        consumePostLoginRedirectPath() || '/';

                    alert(`${userNickname}님, 환영합니다.`);
                    navigate(redirectPath, { replace: true });

                } catch (error) {
                    console.error('kakaologin error', error);
                    alert('카카오 로그인에 실패했습니다.');
                    navigate('/', { replace: true });
                }
                return;
            }

            navigate('/', { replace: true });
        };

        sendCodeToBackend();
    }, [navigate]);

    return null;
};

export default AuthHandler;
