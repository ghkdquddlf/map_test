import React, { useState } from 'react';
import Map from '../components/Map';
import InputModal from '../components/InputModal';
import ConfirmModal from '../components/ConfirmModal';

function MapView() {
  const [coordinates, setCoordinates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [area, setArea] = useState(0);
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('all');
  const [editMode, setEditMode] = useState('none');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCoordinateSelect = (coords) => {
    console.log('New coordinate selected:', coords);
    if (selectedAreaId === 'all') {
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
        console.log('Updated coordinates:', newCoordinates);
        return newCoordinates;
      });
    } else {
      // 저장된 영역의 마커 수정
      setAreas(prev => prev.map(area => {
        if (String(area.id) === String(selectedAreaId)) {
          if (coords.id) {
            // 기존 마커의 위치 업데이트
            return {
              ...area,
              coordinates: area.coordinates.map(coord =>
                coord.id === coords.id
                  ? { ...coord, lat: coords.lat, lng: coords.lng }
                  : coord
              )
            };
          } else {
            // 새로운 마커 추가
            return {
              ...area,
              coordinates: [...area.coordinates, {
                id: area.coordinates.length + 1,
                ...coords
              }]
            };
          }
        }
        return area;
      }));
    }
  };

  const handleMarkerDelete = (id) => {
    if (selectedAreaId === 'all') {
      setCoordinates(prev => prev.filter(coord => coord.id !== id));
    } else {
      // 저장된 영역의 마커 삭제
      setAreas(prev => prev.map(area => {
        if (String(area.id) === String(selectedAreaId)) {
          return {
            ...area,
            coordinates: area.coordinates.filter(coord => coord.id !== id)
          };
        }
        return area;
      }));
    }
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
        area: `${area.toFixed(2)} m²`
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

  const handleDownload = () => {
    const selectedArea = areas.find(a => String(a.id) === String(selectedAreaId));
    if (!selectedArea) return;

    // Convert coordinates array to POINT format
    const pointData = {};
    selectedArea.coordinates.forEach((coord, index) => {
      pointData[`POINT${index + 1}`] = {
        lat: coord.lat,
        lng: coord.lng
      };
    });

    const data = {
      name: selectedArea.name,
      "주행가능한영역": {
        ...pointData,
        area: selectedArea.area
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedArea.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAreaSelect = (e) => {
    setSelectedAreaId(e.target.value);
  };

  const handleAddClick = () => {
    if (selectedAreaId !== 'all') {
      setShowAddModal(true);
    } else {
      setSelectedAreaId('all');
    }
  };

  const handleAddModalConfirm = () => {
    setSelectedAreaId('all');
    setEditMode('draw');
    setShowAddModal(false);
  };

  const handleAddModalCancel = () => {
    setShowAddModal(false);
  };

  let markersToShow = coordinates;
  if (selectedAreaId !== 'all') {
    const found = areas.find(a => String(a.id) === String(selectedAreaId));
    if (found) markersToShow = found.coordinates;
    else markersToShow = [];
  }

  // 면적을 m² 단위로 변환하는 함수
  const formatArea = (areaInSquareMeters) => {
    return `${areaInSquareMeters.toFixed(2)} m²`;
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
              <option value="all">새로운 영역 생성</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          }
          isAliasModalOpen={showAliasModal}
          editMode={editMode}
          setEditMode={setEditMode}
          onAddClick={handleAddClick}
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
            <button style={styles.downloadButton} onClick={handleDownload}>다운로드</button>
          </div>
        </div>
        {showAliasModal && (
          <InputModal
            isOpen={showAliasModal}
            title="영역 별칭을 입력하세요"
            inputValue={aliasInput}
            onInputChange={e => setAliasInput(e.target.value)}
            onConfirm={handleAliasSave}
            onCancel={handleAliasCancel}
            placeholder="예: 논동쪽, 밭A 등"
            styles={styles}
          />
        )}
        {showAddModal && (
          <ConfirmModal
            isOpen={showAddModal}
            title="새로운 영역을 생성하시겠습니까?"
            onConfirm={handleAddModalConfirm}
            onCancel={handleAddModalCancel}
            styles={styles}
          />
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
    height: '88vh',
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