import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaPencilAlt, FaTrash, FaEdit } from 'react-icons/fa';

function Map({ onCoordinateSelect, markers = [], onAreaCalculated, onMarkerDelete, areaDropdown, isAliasModalOpen, editMode, setEditMode }) {
  const mapElement = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const markersRef = useRef({});
  const polygonRef = useRef(null);
  const [mapType, setMapType] = useState('normal'); // 'normal' or 'satellite'

  // 스크립트 로드
  useEffect(() => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    if (!clientId) {
      setError('네이버 클라이언트 ID가 설정되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    // 이미 로드된 경우
    if (window.naver && window.naver.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    script.onerror = (error) => {
      setError('네이버 지도 API를 불러오는데 실패했습니다.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []); // 스크립트 로드는 한 번만

  // 면적 계산 함수를 useCallback으로 메모이제이션
  const calculateArea = useCallback((points) => {
    if (points.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].lat * points[j].lng;
      area -= points[j].lat * points[i].lng;
    }
    area = Math.abs(area) * 111000 * 111000 / 2;
    return area;
  }, []);

  // 폴리곤 업데이트 함수를 useCallback으로 메모이제이션
  const updatePolygon = useCallback((coords) => {
    if (!map || !window.naver || coords.length < 2) return;

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    const paths = coords.map(coord => new window.naver.maps.LatLng(coord.lat, coord.lng));
    
    if (coords.length >= 3) {
      paths.push(paths[0]);
    }

    polygonRef.current = new window.naver.maps.Polygon({
      map: map,
      paths: paths,
      fillColor: '#ff69b4',
      fillOpacity: 0.3,
      strokeColor: '#ff69b4',
      strokeOpacity: 0.6,
      strokeWeight: 3
    });

    if (coords.length >= 3) {
      const area = calculateArea(coords);
      if (onAreaCalculated) {
        onAreaCalculated(area);
      }
    }
  }, [map, calculateArea, onAreaCalculated]);

  // 지도 클릭 이벤트 핸들러를 useCallback으로 메모이제이션
  const handleMapClick = useCallback((e) => {
    console.log('Map clicked', editMode);
    if (editMode === 'draw') {
      if (onCoordinateSelect) {
        onCoordinateSelect({
          lat: e.coord.lat(),
          lng: e.coord.lng()
        });
      }
    }
  }, [editMode, onCoordinateSelect]);

  // 마커 클릭 이벤트 핸들러를 useCallback으로 메모이제이션
  const handleMarkerClick = useCallback((markerId) => {
    if (editMode === 'delete') {
      if (onMarkerDelete) {
        onMarkerDelete(markerId);
      }
    }
  }, [editMode, onMarkerDelete]);

  // 지도 초기화 useEffect
  useEffect(() => {
    if (!isScriptLoaded || !mapElement.current || map) return;

    try {
      const { naver } = window;
      if (!naver) {
        setError('네이버 지도 API를 불러오는데 실패했습니다.');
        setIsLoading(false);
        return;
      }
      
      const location = new naver.maps.LatLng(37.5666805, 126.9784147);
      const mapOptions = {
        center: location,
        zoom: 15,
      };

      const newMap = new naver.maps.Map(mapElement.current, mapOptions);
      setMap(newMap);
      setIsLoading(false);
    } catch (err) {
      setError('지도를 초기화하는데 실패했습니다.');
      setIsLoading(false);
    }
  }, [isScriptLoaded, map]);

  // 클릭 이벤트 리스너 설정 useEffect
  useEffect(() => {
    if (!map || !window.naver) return;

    const clickListener = window.naver.maps.Event.addListener(map, 'click', handleMapClick);

    return () => {
      window.naver.maps.Event.removeListener(clickListener);
    };
  }, [map, handleMapClick]);

  // 마커 관리 및 폴리곤 업데이트 useEffect
  useEffect(() => {
    if (!map || !window.naver) return;

    // 기존 마커들 제거
    Object.values(markersRef.current).forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = {};

    // 폴리곤 제거: markers가 빈 배열이면 폴리곤도 제거
    if (polygonRef.current && (!markers || markers.length < 1)) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    // 새로운 마커들 생성
    markers.forEach(coord => {
      const position = new window.naver.maps.LatLng(coord.lat, coord.lng);
      const marker = new window.naver.maps.Marker({
        position,
        map,
        title: `Point ${coord.id}`,
        icon: {
          content: `<div style="background-color: #ff69b4; color: white; padding: 5px 8px; border-radius: 50%; font-size: 12px;">${coord.id}</div>`,
          anchor: new window.naver.maps.Point(15, 15)
        },
        draggable: editMode === 'edit'
      });

      window.naver.maps.Event.addListener(marker, 'click', () => handleMarkerClick(coord.id));
      
      if (editMode === 'edit') {
        window.naver.maps.Event.addListener(marker, 'dragend', (e) => {
          const newPosition = e.overlay.getPosition();
          if (onCoordinateSelect) {
            onCoordinateSelect({
              id: coord.id,
              lat: newPosition.lat(),
              lng: newPosition.lng()
            });
          }
        });
      }
      
      markersRef.current[coord.id] = marker;
    });

    updatePolygon(markers);
  }, [markers, map, editMode, handleMarkerClick, onCoordinateSelect, updatePolygon]);

  // 지도 유형 변경 함수
  const changeMapType = (type) => {
    if (!map || !window.naver) return;

    const { naver } = window;
    if (type === 'satellite') {
      map.setMapTypeId(naver.maps.MapTypeId.HYBRID); // HYBRID: 위성+오버레이
      setMapType('satellite');
    } else {
      map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
      setMapType('normal');
    }
  };

  return (
    <div style={styles.container}>
      <div ref={mapElement} style={styles.map} />
      
      {/* 지도 타입 컨트롤 */}
      <div style={styles.mapTypeControl}>
        <button
          onClick={() => changeMapType('normal')}
          style={{
            ...styles.typeButton,
            backgroundColor: mapType === 'normal' ? '#0B1C40' : '#ffffff',
            color: mapType === 'normal' ? '#ffffff' : '#0B1C40',
          }}
        >
          일반지도
        </button>
        <button
          onClick={() => changeMapType('satellite')}
          style={{
            ...styles.typeButton,
            backgroundColor: mapType === 'satellite' ? '#0B1C40' : '#ffffff',
            color: mapType === 'satellite' ? '#ffffff' : '#0B1C40',
          }}
        >
          위성지도
        </button>
      </div>
      {/* 드롭박스: 지도 종류 토글 바로 아래 */}
      {areaDropdown && (
        <div style={{ position: 'absolute', top: 60, right: 10, zIndex: 3 }}>
          {areaDropdown}
        </div>
      )}
      {/* 편집 도구 컨트롤 */}
      <div style={styles.editTools}>
        <button
          onClick={() => setEditMode(editMode === 'draw' ? 'none' : 'draw')}
          style={{
            ...styles.toolButton,
            backgroundColor: editMode === 'draw' ? '#0B1C40' : '#ffffff',
            color: editMode === 'draw' ? '#ffffff' : '#0B1C40',
          }}
          title="면적 그리기"
          disabled={isAliasModalOpen}
        >
          <FaPencilAlt />
        </button>
        <button
          onClick={() => setEditMode(editMode === 'edit' ? 'none' : 'edit')}
          style={{
            ...styles.toolButton,
            backgroundColor: editMode === 'edit' ? '#0B1C40' : '#ffffff',
            color: editMode === 'edit' ? '#ffffff' : '#0B1C40',
          }}
          title="포인트 수정"
          disabled={isAliasModalOpen}
        >
          <FaEdit />
        </button>
        <button
          onClick={() => setEditMode(editMode === 'delete' ? 'none' : 'delete')}
          style={{
            ...styles.toolButton,
            backgroundColor: editMode === 'delete' ? '#0B1C40' : '#ffffff',
            color: editMode === 'delete' ? '#ffffff' : '#0B1C40',
          }}
          title="포인트 삭제"
          disabled={isAliasModalOpen}
        >
          <FaTrash />
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <p style={styles.errorDetail}>
            {process.env.REACT_APP_NAVER_CLIENT_ID ? '클라이언트 ID가 설정됨' : '클라이언트 ID가 설정되지 않음'}
          </p>
        </div>
      )}
      {isLoading && !error && (
        <div style={styles.loading}>
          <p>지도를 불러오는 중...</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '90vh',
  },
  loading: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    bottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
  },
  error: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    bottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 243, 243, 0.9)',
    color: '#ff4444',
  },
  errorDetail: {
    fontSize: '0.8rem',
    marginTop: '10px',
    color: '#666'
  },
  mapTypeControl: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 2,
    display: 'flex',
    gap: '5px',
  },
  typeButton: {
    padding: '8px 12px',
    border: '1px solid #0B1C40',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    },
  },
  editTools: {
    position: 'absolute',
    bottom: '20px',
    right: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  toolButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #0B1C40',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    },
  },
};

export default Map; 