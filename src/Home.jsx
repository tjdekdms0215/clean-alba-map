import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 전남대 근처 더미 가게 데이터
const DUMMY_STORES = [
    {
        id: 1,
        name: '전대 후문 맘스터치',
        cleanIndex: 98,
        lat: 35.1764,
        lng: 126.9135,
        issue: '클린 사업장!'
    },
    {
        id: 2,
        name: '정문 ㅇㅇ편의점',
        cleanIndex: 45,
        lat: 35.1750,
        lng: 126.9100,
        issue: '주휴수당 미지급 의심'
    },
    {
        id: 3,
        name: '상대 ㅁㅁ카페',
        cleanIndex: 85,
        lat: 35.1780,
        lng: 126.9080,
        issue: '근로계약서 작성 완료'
    }
];

const Home = () => {
    const navigate = useNavigate();

    // 로그인 / 권한 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // 지도 / 가게 리스트 상태
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);

    // 처음 화면이 켜질 때 로그인 상태와 가게 데이터 세팅
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const savedNickname = localStorage.getItem('user_nickname');
        const userRole = localStorage.getItem('user_role');

        if (token) {
            setIsLoggedIn(true);

            if (savedNickname) {
                setNickname(savedNickname);
            }

            if (userRole === 'ADMIN') {
                setIsAdmin(true);
            }
        }

        // 클린지수가 높은 순서대로 정렬
        const sortedStores = [...DUMMY_STORES].sort(
            (a, b) => b.cleanIndex - a.cleanIndex
        );

        setStores(sortedStores);
    }, []);

    // stores 데이터가 준비되면 카카오 지도 생성
    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) {
            console.warn('Kakao Maps SDK가 아직 로드되지 않았습니다.');
            return;
        }

        const container = document.getElementById('kakao-map');

        if (!container) return;

        const options = {
            center: new window.kakao.maps.LatLng(35.1764, 126.9135),
            level: 4
        };

        const map = new window.kakao.maps.Map(container, options);

        stores.forEach((store) => {
            const markerPosition = new window.kakao.maps.LatLng(
                store.lat,
                store.lng
            );

            const marker = new window.kakao.maps.Marker({
                position: markerPosition
            });

            marker.setMap(map);

            window.kakao.maps.event.addListener(marker, 'click', () => {
                setSelectedStore(store);
            });
        });
    }, [stores]);

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_nickname');
        localStorage.removeItem('user_role');

        setIsLoggedIn(false);
        setNickname('');
        setIsAdmin(false);

        alert('로그아웃 되었습니다.');
    };

    // 검색 기능
    const handleSearch = (e) => {
        if (e.key !== 'Enter') return;

        const keyword = searchTerm.trim();

        if (keyword === '') {
            const sortedStores = [...DUMMY_STORES].sort(
                (a, b) => b.cleanIndex - a.cleanIndex
            );
            setStores(sortedStores);
            setSelectedStore(null);
            return;
        }

        const filteredStores = DUMMY_STORES
            .filter((store) => store.name.includes(keyword))
            .sort((a, b) => b.cleanIndex - a.cleanIndex);

        setStores(filteredStores);
        setSelectedStore(null);
    };

    return (
        <div style={pageStyle}>
            {/* 상단바 */}
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        style={logoBtnStyle}
                        onClick={() => navigate('/')}
                    >
                        전남대 클린알바맵
                    </button>

                    <button style={navBtnStyle}>서비스 소개</button>
                    <button style={navBtnStyle}>근로기준법 안내</button>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="가게 이름 검색 후 엔터"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        style={searchInputStyle}
                    />

                    {isLoggedIn ? (
                        <>
                            {nickname && (
                                <span style={profileTextStyle}>
                                    👤 {nickname}님
                                </span>
                            )}

                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    style={adminBtnStyle}
                                >
                                    ⚙️ 관리자 페이지
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/profile')}
                                style={btnStyle}
                            >
                                내 프로필
                            </button>

                            <button
                                onClick={handleLogout}
                                style={btnStyle}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            style={btnStyle}
                        >
                            로그인
                        </button>
                    )}
                </div>
            </div>

            {/* 본문 영역 */}
            <div style={contentStyle}>
                {/* 왼쪽 지도 영역 */}
                <div style={mapContainerStyle}>
                    <div
                        id="kakao-map"
                        style={{ width: '100%', height: '100%' }}
                    />

                    {/* 지도 마커 클릭 시 뜨는 팝업 */}
                    {selectedStore && (
                        <div style={popupStyle}>
                            <h3 style={{ margin: '0 0 8px 0' }}>
                                {selectedStore.name}
                            </h3>

                            <p style={popupTextStyle}>
                                ✨ 클린지수:{' '}
                                <strong>{selectedStore.cleanIndex}점</strong>
                            </p>

                            <p style={issueTextStyle}>
                                🚨 이슈: {selectedStore.issue}
                            </p>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button
                                    onClick={() => navigate(`/detail/${selectedStore.id}`)}
                                    style={detailBtnStyle}
                                >
                                    자세히 보기
                                </button>

                                <button
                                    onClick={() => setSelectedStore(null)}
                                    style={closeBtnStyle}
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 후기 쓰기 버튼 */}
                    <button
                        onClick={() => navigate('/review/write')}
                        style={fabStyle}
                    >
                        후기 쓰기
                    </button>
                </div>

                {/* 오른쪽 사이드바 */}
                <div style={sidebarStyle}>
                    <h2 style={sidebarTitleStyle}>
                        🏆 클린 사업장 랭킹
                    </h2>

                    <div style={listContainerStyle}>
                        {stores.length > 0 ? (
                            stores.map((store, index) => (
                                <div
                                    key={store.id}
                                    style={listItemStyle}
                                    onClick={() => setSelectedStore(store)}
                                >
                                    <div style={storeNameStyle}>
                                        <span style={rankStyle}>
                                            {index + 1}위
                                        </span>
                                        {store.name}
                                    </div>

                                    <div style={storeInfoStyle}>
                                        클린지수 {store.cleanIndex}점 | {store.issue}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={emptyStyle}>
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 스타일 영역 ---

const pageStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    zIndex: 10
};

const logoBtnStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#333'
};

const navBtnStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px 10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#444'
};

const searchInputStyle = {
    padding: '8px 12px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none',
    width: '220px',
    fontSize: '14px'
};

const btnStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#444'
};

const adminBtnStyle = {
    ...btnStyle,
    color: 'red',
    borderColor: 'red',
    fontWeight: 'bold'
};

const profileTextStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#007AFF'
};

const contentStyle = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
};

const mapContainerStyle = {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e9ecef'
};

const sidebarStyle = {
    width: '400px',
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column'
};

const sidebarTitleStyle = {
    fontSize: '18px',
    padding: '20px',
    margin: 0,
    borderBottom: '1px solid #ddd'
};

const listContainerStyle = {
    overflowY: 'auto',
    height: 'calc(100% - 60px)'
};

const listItemStyle = {
    padding: '20px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer'
};

const storeNameStyle = {
    fontSize: '16px',
    fontWeight: 'bold'
};

const rankStyle = {
    color: '#007AFF',
    marginRight: '8px'
};

const storeInfoStyle = {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px'
};

const emptyStyle = {
    padding: '24px',
    color: '#777',
    fontSize: '14px'
};

const popupStyle = {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 20,
    width: '260px'
};

const popupTextStyle = {
    margin: '4px 0',
    fontSize: '14px'
};

const issueTextStyle = {
    margin: '4px 0',
    fontSize: '14px',
    color: '#e74c3c'
};

const detailBtnStyle = {
    flex: 1,
    padding: '8px',
    backgroundColor: '#007AFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const closeBtnStyle = {
    padding: '8px 12px',
    backgroundColor: '#eee',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const fabStyle = {
    position: 'absolute',
    top: '24px',
    left: '24px',
    width: '100px',
    height: '40px',
    backgroundColor: '#ffffff',
    color: 'black',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 15
};

export default Home;