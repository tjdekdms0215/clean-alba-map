import api from './axios'; // 앞서 만든 axios 인터셉터 파일

/**
 * 사업장 목록 및 핀 데이터 조회
 * @param {string} status - 상태 필터 (EXCELLENT, NORMAL, CAUTION, DANGER) / null이면 전체
 * @param {string} keyword - 검색어 (이름, 주소 등)
 * @returns {Promise<Array>} 사업장 데이터 배열
 */
export const getWorkspaces = async (status = null, keyword = null) => {
    try {
        const params = {};
        if (status) params.status = status;
        if (keyword) params.keyword = keyword;

        const response = await api.get('/workspaces', { params });
        return response.data;
    } catch (error) {
        if (error.response?.status === 400) {
            console.error('잘못된 status 값이 전달되었습니다.');
        } else {
            console.error('사업장 데이터를 불러오는 중 오류가 발생했습니다.', error);
        }
        throw error;
    }
};

import api from './axios';

// (기존) 사업장 목록 및 핀 데이터 조회
export const getWorkspaces = async (status = null, keyword = null) => {
    // ... 기존 코드 유지
};

// 👇 [추가] 후기 작성용 사업장 검색 (카카오 검색 포함)
export const searchReviewTargets = async (keyword) => {
    const response = await api.get('/workspaces/search', {
        params: { keyword }
    });
    return response.data;
};

// 👇 [추가] 미등록 카카오 장소 Resolve (DB 등록 후 ID 반환)
export const resolveWorkspace = async (placeData) => {
    const response = await api.post('/workspaces/resolve', placeData);
    return response.data;
};