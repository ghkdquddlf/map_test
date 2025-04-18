import React from 'react';
import Map from '../components/Map';

function MapView() {
  return (
    <div style={styles.container}>
      <div style={styles.mapContainer}>
        <Map />
      </div>
      <div style={styles.sideMenu}>
        {/* 상단 프로젝트명 타이틀 */}
        <div style={styles.titleSection}>
          <h3 style={styles.projectTitle}>(프로젝트명)</h3>
        </div>

        {/* 프로젝트 정보 영역 */}
        <div style={styles.contentSection}>
          <div style={styles.projectBox}>
            <div style={styles.colorBox}>
              <span style={styles.colorDot}></span>
              <span>FUCHSIA PINK</span>
              <span style={styles.colorNumber}>1</span>
            </div>
            <div style={styles.coordinateBox}>
              <div style={styles.inputRow}>
                <label>위도:</label>
                <input type="text" value="333.333.333" readOnly style={styles.input} />
              </div>
              <div style={styles.inputRow}>
                <label>경도:</label>
                <input type="text" value="333.333.333" readOnly style={styles.input} />
              </div>
            </div>
          </div>

          {/* 하단 설정 및 다운로드 영역 */}
          <div style={styles.bottomSection}>
            <h4 style={styles.settingTitle}>내보내기</h4>
            <div style={styles.settingBox}>
              <div style={styles.selectBox}>
                <label>파일형식</label>
                <select style={styles.select} defaultValue="json">
                  <option value="json">json</option>
                </select>
              </div>
              <button style={styles.downloadButton}>다운로드</button>
            </div>
          </div>
        </div>
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
  contentSection: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  projectBox: {
    borderRadius: '8px',
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
    paddingTop: '20px'
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
  }
};

export default MapView; 