import React, { useEffect, useRef, useState } from 'react';

function Map() {
  const mapElement = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [map, setMap] = useState(null);

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

  // 지도 초기화
  useEffect(() => {
    if (!isScriptLoaded || !mapElement.current || map) return;

    try {
      const { naver } = window;
      if (!naver) {
        setError('네이버 지도 API를 불러오는데 실패했습니다.');
        setIsLoading(false);
        return;
      }
      
      // KETI 위치 (예시 좌표입니다. 실제 좌표로 수정해주세요)
      const location = new naver.maps.LatLng(37.5666805, 126.9784147);
      const mapOptions = {
        center: location,
        zoom: 15,
      };

      const newMap = new naver.maps.Map(mapElement.current, mapOptions);
      
      // 마커 추가
      new naver.maps.Marker({
        position: location,
        map: newMap
      });

      setMap(newMap);
      setIsLoading(false);
    } catch (err) {
      setError('지도를 초기화하는데 실패했습니다.');
      setIsLoading(false);
    }
  }, [isScriptLoaded, map]);

  return (
    <div style={styles.container}>
      <div ref={mapElement} style={styles.map} />
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
  }
};

export default Map; 