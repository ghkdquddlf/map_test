import React, { useState } from 'react';
import Map from '../components/Map';

function MapView() {
  const [coordinates, setCoordinates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [area, setArea] = useState(0);
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('all');
  const [editMode, setEditMode] = useState('none');

  const handleCoordinateSelect = (coords) => {
    console.log('New coordinate selected:', coords); // 디버깅용 로그
    setCoordinates(prev => {
      let newCoordinates;
      if (coords.id) {
        // 기존 마커의 위치 업데이트
        newCoordinates = prev.map(coord => 
          coord.id === coords.id 
            ? { ...coord, lat: coords.lat, lng: coords.lng }
            : coord
        );
      } else {
        // 새로운 마커 추가
        newCoordinates = [...prev, {
          id: prev.length + 1,
          ...coords
        }];
      }
      console.log('Updated coordinates:', newCoordinates); // 디버깅용 로그
      return newCoordinates;
    });
  };

  const handleMarkerDelete = (id) => {
    setCoordinates(prev => prev.filter(coord => coord.id !== id));
  };

  const handleAreaCalculated = (calculatedArea) => {
    setArea(calculatedArea);
  };

  const handleOptimalPath = () => {
    setShowAliasModal(true);
  };

  const handleAliasSave = () => {
    if (!aliasInput.trim()) return;
    setAreas(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: aliasInput,
        coordinates,
        area
      }
    ]);
    setCoordinates([]);
    setArea(0);
    setAliasInput('');
    setShowAliasModal(false);
    setEditMode('none');
  };

  const handleAliasCancel = () => {
    setShowAliasModal(false);
    setEditMode('none');
  };

  const handleAreaSelect = (e) => {
    setSelectedAreaId(e.target.value);
  };

  let markersToShow = coordinates;
  if (selectedAreaId !== 'all') {
    const found = areas.find(a => String(a.id) === String(selectedAreaId));
    if (found) markersToShow = found.coordinates;
    else markersToShow = [];
  }

  // 면적을 적절한 단위로 변환하는 함수
  const formatArea = (areaInSquareMeters) => {
    if (areaInSquareMeters < 1) return '0 m²';
    if (areaInSquareMeters < 10000) {
      return `${areaInSquareMeters.toFixed(2)} m²`;
    } else {
      const areaInHectares = areaInSquareMeters / 10000;
      return `${areaInHectares.toFixed(2)} ha`;
    }
  };

  // editMode를 변경할 때 추가 동작 (draw 모드 진입 시 드롭박스 초기화)
  const handleSetEditMode = (mode) => {
    setEditMode(prev => {
      // 드롭박스에서 특정 영역이 선택된 상태에서 수정/삭제 시 alert
      if (selectedAreaId !== 'all' && (mode === 'edit' || mode === 'delete')) {
        alert('한번 저장된 영역은 수정이 불가능합니다. 새로운 영역을 지정해주세요.');
        return prev; // 상태 변경하지 않음
      }
      if (mode === 'draw' && prev !== 'draw') {
        setSelectedAreaId('all');
      }
      return mode;
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.mapContainer}>
        <Map 
          onCoordinateSelect={handleCoordinateSelect} 
          markers={markersToShow}
          onAreaCalculated={handleAreaCalculated}
          onMarkerDelete={handleMarkerDelete}
          areaDropdown={
            <select style={styles.areaDropdown} value={selectedAreaId} onChange={handleAreaSelect}>
              <option value="all">전체 영역 보기</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          }
          isAliasModalOpen={showAliasModal}
          editMode={editMode}
          setEditMode={handleSetEditMode}
        />
      </div>
      <div style={styles.sideMenu}>
        <div style={styles.titleSection}>
          <h3 style={styles.projectTitle}>
            {selectedAreaId !== 'all' 
              ? areas.find(a => String(a.id) === String(selectedAreaId))?.name || '(프로젝트명)'
              : '(프로젝트명)'}
          </h3>
        </div>

        <div style={styles.scrollableContent}>
          {/* 현재 그리고 있는 영역 또는 선택된 영역의 포인트 정보 */}
          {selectedAreaId !== 'all' && areas.find(a => String(a.id) === String(selectedAreaId)) ? (
            areas.find(a => String(a.id) === String(selectedAreaId)).coordinates.map((coord) => (
              <div key={coord.id} style={styles.projectBox}>
                <div style={styles.colorBox}>
                  <span style={styles.colorDot}></span>
                  <span>POINT {coord.id}</span>
                </div>
                <div style={styles.coordinateBox}>
                  <div style={styles.inputRow}>
                    <label>위도:</label>
                    <input 
                      type="text" 
                      value={coord.lat.toFixed(6)} 
                      readOnly 
                      style={styles.input} 
                    />
                  </div>
                  <div style={styles.inputRow}>
                    <label>경도:</label>
                    <input 
                      type="text" 
                      value={coord.lng.toFixed(6)} 
                      readOnly 
                      style={styles.input} 
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            // 기존: 현재 그리고 있는 영역
            <>
              {coordinates.length >= 3 && (
                <div style={styles.areaBox}>
                  <span style={styles.areaLabel}>총 면적:</span>
                  <span style={styles.areaValue}>{formatArea(area)}</span>
                </div>
              )}
              {coordinates.map((coord) => (
                <div key={coord.id} style={styles.projectBox}>
                  <div style={styles.colorBox}>
                    <span style={styles.colorDot}></span>
                    <span>POINT {coord.id}</span>
                    <button 
                      onClick={() => handleMarkerDelete(coord.id)}
                      style={styles.removeButton}
                    >
                      
                    </button>
                  </div>
                  <div style={styles.coordinateBox}>
                    <div style={styles.inputRow}>
                      <label>위도:</label>
                      <input 
                        type="text" 
                        value={coord.lat.toFixed(6)} 
                        readOnly 
                        style={styles.input} 
                      />
                    </div>
                    <div style={styles.inputRow}>
                      <label>경도:</label>
                      <input 
                        type="text" 
                        value={coord.lng.toFixed(6)} 
                        readOnly 
                        style={styles.input} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {coordinates.length >= 3 && (
          <button style={styles.optimalPathButton} onClick={handleOptimalPath}>해당 영역 최적 경로 생성하기</button>
        )}
        <div style={styles.bottomSection}>
          <h4 style={styles.settingTitle}>내보내기</h4>
          <div style={styles.settingBox}>
            <div style={styles.selectBox}>
              <label>파일형식</label>
              <select style={styles.select} defaultValue="json">
                <option value="json">JSON</option>
                <option value="kml">KML</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <button style={styles.downloadButton}>다운로드</button>
          </div>
        </div>
        {showAliasModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h4>영역 별칭을 입력하세요</h4>
              <input 
                type="text" 
                value={aliasInput} 
                onChange={e => setAliasInput(e.target.value)}
                style={styles.input}
                placeholder="예: 논동쪽, 밭A 등"
              />
              <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                <button style={styles.downloadButton} onClick={handleAliasSave}>저장</button>
                <button style={styles.downloadButton} onClick={handleAliasCancel}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    height: '90vh',
    width: '100%',
  },
  sideMenu: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '300px',
    height: '85vh',
    zIndex: 2,
    borderRadius: '20px',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  titleSection: {
    padding: '20px',
    borderBottom: '1px solid #EEEEEE',
    backgroundColor: 'white',
  },
  projectTitle: {
    margin: 0,
    fontSize: '16px',
    color: '#333',
    fontWeight: '600',
  },
  scrollableContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    paddingBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    // 스크롤바 스타일링
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#ff69b4',
      borderRadius: '4px',
      '&:hover': {
        background: '#ff4da6',
      },
    },
  },
  projectBox: {
    marginBottom: '10px',
  },
  boxTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#333'
  },
  colorBox: {
    backgroundColor: '#fff0f9',
    padding: '10px 15px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '2px solid #ff69b4',
    marginBottom: '15px'
  },
  colorDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#ff69b4',
    borderRadius: '50%'
  },
  colorNumber: {
    marginLeft: 'auto'
  },
  coordinateBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '8px',
    border: 'none',
    fontSize: '14px',
    backgroundColor: '#ffffff00',
    textAlign: 'right'
  },
  bottomSection: {
    borderTop: '1px solid #eee',
    padding: '20px',
    backgroundColor: 'white',
  },
  settingTitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    fontWeight: 'normal'
  },
  settingBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  selectBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '120px'
  },
  downloadButton: {
    backgroundColor: '#0B1C40',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '14px'
  },
  optimalPathButton: {
    backgroundColor: '#0B1C40',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: 'calc(100% - 20px)',
    fontSize: '14px',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '15px',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 5px',
    marginLeft: 'auto',
    '&:hover': {
      color: '#ff4444'
    }
  },
  areaBox: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '5px',
    border: '2px solid #ff69b4',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  areaLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginRight: '10px',
  },
  areaValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ff69b4',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px 24px',
    minWidth: '300px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  areaDropdown: {
    margin: '10px 0',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '200px',
    background: 'white',
    zIndex: 10,
  },
};

export default MapView; 