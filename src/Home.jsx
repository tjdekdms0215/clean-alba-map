import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 💡 [공부 포인트 1] 모든 색상이 테스트 되도록 데이터를 수정/추가했어!
const DUMMY_STORES = [
    { id: 1, name: '전대 후문 맘스터치', cleanIndex: 98, lat: 35.1764, lng: 126.9135, issue: '클린 사업장!', oxStats: '근로계약서 O (12건) / 주휴수당 O (12건)', reviewCount: 12, frequentJobs: ['홀 서빙'] },
    { id: 2, name: '정문 ㅇㅇ편의점', cleanIndex: 75, lat: 35.1750, lng: 126.9100, issue: '근로계약서 미교부 의심', oxStats: '근로계약서 X (2건) / 주휴수당 O (5건)', reviewCount: 7, frequentJobs: ['야간 카운터'] },
    { id: 3, name: '상대 ㅁㅁ카페', cleanIndex: 55, lat: 35.1780, lng: 126.9080, issue: '주휴수당 미지급 의심', oxStats: '근로계약서 O (5건) / 주휴수당 X (4건)', reviewCount: 9, frequentJobs: ['오픈 파트타이머'] },
    { id: 4, name: '후문 XX식당', cleanIndex: 30, lat: 35.1740, lng: 126.9150, issue: '최저임금 위반 의심', oxStats: '최저임금 X (10건)', reviewCount: 10, frequentJobs: ['주방 보조'] },
];
const REVIEWED_STORES = DUMMY_STORES.filter((store) => store.reviewCount > 0);
   

// 💡 [공부 포인트 2] 점수에 따라 색상과 라벨을 뱉어내는 마법의 자판기 함수!
const getCleanGradeInfo = (score) => {
    if (score >= 80) return { color: '#2ecc71', label: '우수' }; // 🟢 초록
    if (score >= 60) return { color: '#f1c40f', label: '보통' }; // 🟡 노랑
    if (score >= 40) return { color: '#e67e22', label: '주의' }; // 🟠 주황
    return { color: '#e74c3c', label: '위험' };                  // 🔴 빨강
};

const Home = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const savedNickname = localStorage.getItem('user_nickname');
        const userRole = localStorage.getItem('user_role');

        if (token) {
            setIsLoggedIn(true);
            if (savedNickname) setNickname(savedNickname);
            if (userRole === 'ADMIN') setIsAdmin(true);
        }

        const sortedStores = [...REVIEWED_STORES].sort((a, b) => b.cleanIndex - a.cleanIndex);
        setStores(sortedStores);
    }, []);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        const container = document.getElementById('kakao-map');
        if (!container) return;

        const options = { center: new window.kakao.maps.LatLng(35.1764, 126.9135), level: 4 };
        const map = new window.kakao.maps.Map(container, options);

        stores.forEach((store) => {
            // 💡 [공부 포인트 3] 기획안 반영: 리뷰가 0개면 지도에 핀을 그리지 않고 패스!
            if (store.reviewCount === 0) return; 

            // 점수에 따른 색상 가져오기
            const { color } = getCleanGradeInfo(store.cleanIndex);

            // 💡 카카오맵에 내가 원하는 색상의 핀을 꽂기 위한 SVG (벡터 이미지) 코드
            const svgMarker = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 24 35"><path fill="${color}" d="M12 0C5.373 0 0 5.373 0 12c0 7.747 12 23 12 23s12-15.253 12-23C24 5.373 18.627 0 12 0zm0 17c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/></svg>`;
            
            // SVG 코드를 카카오맵이 읽을 수 있는 이미지 URL로 변환!
            const markerImageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarker)}`;
            const markerImage = new window.kakao.maps.MarkerImage(markerImageUrl, new window.kakao.maps.Size(28, 40));
            const markerPosition = new window.kakao.maps.LatLng(store.lat, store.lng);
            
            const marker = new window.kakao.maps.Marker({ 
                position: markerPosition,
                image: markerImage // 기본 파란 핀 대신 커스텀 핀 적용!
            });
            marker.setMap(map);

            window.kakao.maps.event.addListener(marker, 'click', () => {
                setSelectedStore(store);
            });
        });
    }, [stores]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setNickname('');
        setIsAdmin(false);
        alert('로그아웃 되었습니다.');
    };

    const handleSearch = (e) => {
    if (e.key !== 'Enter') return;

    const keyword = searchTerm.trim();

    if (keyword === '') {
        const sortedStores = [...REVIEWED_STORES].sort(
            (a, b) => b.cleanIndex - a.cleanIndex
        );

        setStores(sortedStores);
        setSelectedStore(null);
        return;
    }

    const filteredStores = REVIEWED_STORES
        .filter((store) => store.name.includes(keyword))
        .sort((a, b) => b.cleanIndex - a.cleanIndex);

    setStores(filteredStores);
    setSelectedStore(null);
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button style={logoBtnStyle} onClick={() => navigate('/')}>
                        전남대 클린알바맵
                    </button>
                    <button style={navBtnStyle}>서비스 소개</button>
                    <button style={navBtnStyle}>근로기준법 안내</button>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                                <div style={profileCircleStyle}>
                                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                {nickname && <span style={profileTextStyle}>{nickname}님</span>}
                            </div>
                            {isAdmin && <button onClick={() => navigate('/admin')} style={adminBtnStyle}>⚙️ 관리자</button>}
                            <button onClick={handleLogout} style={btnStyle}>로그아웃</button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')} style={btnStyle}>로그인</button>
                    )}
                </div>
            </div>

            <div style={contentStyle}>
                <div style={mapContainerStyle}>
                    <div id="kakao-map" style={{ width: '100%', height: '100%' }} />
                    {selectedStore && (
                        <div style={popupStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
                                    {/* 💡 팝업창 이름 옆에도 색상 동그라미 추가 */}
                                    <span style={{...statusDotStyle, backgroundColor: getCleanGradeInfo(selectedStore.cleanIndex).color}}></span>
                                    {selectedStore.name}
                                </h3>
                                <button onClick={() => setSelectedStore(null)} style={closeIconBtnStyle}>✕</button>
                            </div>
                            <div style={infoRowStyle}>
                                <span style={infoLabelStyle}>🏆 종합 점수</span>
                                <span style={{ fontWeight: 'bold', color: getCleanGradeInfo(selectedStore.cleanIndex).color }}>
                                    {selectedStore.cleanIndex}점 ({getCleanGradeInfo(selectedStore.cleanIndex).label})
                                </span>
                            </div>
                            <div style={infoRowStyle}>
                                <span style={infoLabelStyle}>📊 산출 근거</span>
                                <span style={{ fontSize: '13px', color: '#555' }}>{selectedStore.oxStats}</span>
                            </div>
                            <div style={infoRowStyle}>
                                <span style={infoLabelStyle}>✍️ 누적 후기</span>
                                <span style={{ fontSize: '13px', color: '#555' }}>{selectedStore.reviewCount}명 참여</span>
                            </div>
                            <div style={{ ...infoRowStyle, borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                <span style={infoLabelStyle}>📢 자주 올라오는 공고</span>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                                    {selectedStore.frequentJobs.map((job, idx) => (
                                        <span key={idx} style={tagStyle}>{job}</span>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => navigate(`/detail/${selectedStore.id}`)} style={detailBtnStyle}>
                                후기 자세히 보기
                            </button>
                        </div>
                    )}
                    <button onClick={() => navigate('/review/write')} style={fabStyle}>후기 쓰기</button>
                </div>

                <div style={sidebarStyle}>
                    <div style={sidebarHeaderAreaStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                            <h2 style={{ fontSize: '18px', margin: 0 }}> 클린 사업장 리스트</h2>
                            <span style={{ fontSize: '13px', color: '#888', fontWeight: 'bold' }}>전체 {stores.length}건</span>
                        </div>
                        <input
                            type="text"
                            placeholder="사업장 이름 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            style={sidebarSearchInputStyle}
                        />
                    </div>
                    <div style={listContainerStyle}>
                        {stores.length > 0 ? (
                            stores.map((store, index) => (
                                <div key={store.id} style={listItemStyle} onClick={() => setSelectedStore(store)}>
                                    <div style={storeNameStyle}>
                                        {/* 💡 [공부 포인트 4] 리스트 가게 이름 옆에도 상태 색상 동그라미 배치! */}
                                        <span style={{...statusDotStyle, backgroundColor: getCleanGradeInfo(store.cleanIndex).color}}></span>
                                        {store.name}
                                    </div>
                                    <div style={storeInfoStyle}>
                                        클린지수 {store.cleanIndex}점 | {store.issue}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={emptyStyle}>검색 결과가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 스타일 영역 ---

const pageStyle = { width: '100vw', height: '100vh', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', padding: '0 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #ddd', zIndex: 10 };
const logoBtnStyle = { backgroundColor: 'transparent', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', color: '#333' };
const navBtnStyle = { backgroundColor: 'transparent', border: 'none', padding: '8px 10px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: '#444' };
const btnStyle = { backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '14px', color: '#444' };
const adminBtnStyle = { ...btnStyle, color: 'red', borderColor: 'red', fontWeight: 'bold' };
const profileTextStyle = { fontSize: '14px', fontWeight: 'bold', color: '#333' };
const profileCircleStyle = { width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #eee', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' };

const contentStyle = { display: 'flex', flex: 1, overflow: 'hidden' };
const mapContainerStyle = { flex: 1, position: 'relative', backgroundColor: '#e9ecef' };
const sidebarStyle = { width: '400px', backgroundColor: '#ffffff', borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column' };
const sidebarHeaderAreaStyle = { padding: '20px', borderBottom: '1px solid #ddd', backgroundColor: '#fafafa' };
const sidebarSearchInputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontSize: '14px' };
const listContainerStyle = { overflowY: 'auto', flex: 1 };
const listItemStyle = { padding: '20px', borderBottom: '1px solid #eee', cursor: 'pointer' };
const storeNameStyle = { fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center' };
const rankStyle = { color: '#007AFF', marginRight: '8px' };
const storeInfoStyle = { fontSize: '14px', color: '#666', marginTop: '4px' };
const emptyStyle = { padding: '24px', color: '#777', fontSize: '14px', textAlign: 'center' };

// 💡 가게 이름 옆에 붙는 동그란 상태 표시 점 스타일
const statusDotStyle = {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '6px'
};

const popupStyle = { position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 20, width: '320px', display: 'flex', flexDirection: 'column' };
const closeIconBtnStyle = { backgroundColor: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#999' };
const infoRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px dashed #eee' };
const infoLabelStyle = { fontSize: '13px', fontWeight: 'bold', color: '#777' };
const tagStyle = { backgroundColor: '#f0f4f8', color: '#007AFF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' };
const detailBtnStyle = { width: '100%', padding: '12px', marginTop: '16px', backgroundColor: '#007AFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const fabStyle = { position: 'absolute', top: '24px', left: '24px', width: '100px', height: '40px', backgroundColor: '#ffffff', color: 'black', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 15 };

export default Home;