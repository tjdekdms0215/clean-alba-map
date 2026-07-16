import api from './axios';

/**
 * 사업장 목록 및 지도 핀 데이터 조회
 *
 * @param {string|null} status
 * @param {string|null} keyword
 * @returns {Promise<Array>}
 */
export const getWorkspaces = async (
    status = null,
    keyword = null
) => {
    try {
        const params = {};

        if (status) {
            params.status = status;
        }

        if (keyword) {
            params.keyword = keyword;
        }

        const response = await api.get('/workspaces', {
            params
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 400) {
            console.error(
                '잘못된 사업장 검색 조건이 전달되었습니다.'
            );
        } else {
            console.error(
                '사업장 데이터를 불러오는 중 오류가 발생했습니다.',
                error
            );
        }

        throw error;
    }
};

/**
 * 후기 작성 대상 사업장 검색
 * 내부 DB 사업장과 카카오 장소 검색 결과를 조회합니다.
 *
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
export const searchReviewTargets = async (keyword) => {
    const response = await api.get(
        '/workspaces/search',
        {
            params: {
                keyword
            }
        }
    );

    return response.data;
};

/**
 * 미등록 카카오 장소를 내부 사업장으로 등록합니다.
 *
 * @param {object} placeData
 * @returns {Promise<object>}
 */
export const resolveWorkspace = async (placeData) => {
    const response = await api.post(
        '/workspaces/resolve',
        placeData
    );

    return response.data;
};