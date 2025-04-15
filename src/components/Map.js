import React, { useEffect, useRef, useState } from 'react';

function Map() {
  const mapElement = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      try {
        const { naver } = window;
        if (!mapElement.current || !naver) {
          setError('네이버 지도 API를 불러오는데 실패했습니다.');
          return;
        }

        // KETI 위치 (예시 좌표입니다. 실제 좌표로 수정해주세요)
        const location = new naver.maps.LatLng(37.5666805, 126.9784147);
        const mapOptions = {
          center: location,
          zoom: 15,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);
        
        // 마커 추가
        new naver.maps.Marker({
          position: location,
          map: map
        });

        setIsLoading(false);
      } catch (err) {
        setError('지도를 초기화하는데 실패했습니다.');
        console.error('Map initialization error:', err);
      }
    };

    // 환경 변수 확인
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    if (!clientId) {
      setError('네이버 클라이언트 ID가 설정되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    // 스크립트 동적 로드
    const loadNaverMaps = () => {
      try {
        // 이미 로드된 경우 처리
        if (window.naver && window.naver.maps) {
          initializeMap();
          return;
        }

        // 이미 스크립트가 추가된 경우 중복 추가 방지
        const existingScript = document.querySelector('script[src*="maps.js"]');
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        
        script.onload = () => {
          if (window.naver && window.naver.maps) {
            initializeMap();
          } else {
            setError('네이버 지도 API 로드 후에도 maps 객체를 찾을 수 없습니다.');
            setIsLoading(false);
          }
        };
        
        script.onerror = () => {
          setError('네이버 지도 API를 불러오는데 실패했습니다.');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        setError('스크립트 로딩 중 오류가 발생했습니다.');
        setIsLoading(false);
        console.error('Script loading error:', err);
      }
    };

    loadNaverMaps();

    // cleanup
    return () => {
      const script = document.querySelector('script[src*="maps.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <div style={styles.error}>
        <p>{error}</p>
        <p style={styles.errorDetail}>
          {process.env.REACT_APP_NAVER_CLIENT_ID ? '클라이언트 ID가 설정됨' : '클라이언트 ID가 설정되지 않음'}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <p>지도를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div ref={mapElement} style={styles.map}></div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    padding: '20px',
  },
  map: {
    width: '100%',
    height: '500px',
  },
  loading: {
    width: '100%',
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  error: {
    width: '100%',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3f3',
    color: '#ff4444',
  },
  errorDetail: {
    fontSize: '0.8rem',
    marginTop: '10px',
    color: '#666'
  }
};

export default Map; 