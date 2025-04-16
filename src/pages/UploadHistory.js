import React, { useState } from 'react';
import Bottom from '../components/Bottom';
import { FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

function UploadHistory() {
  const [selectedItems, setSelectedItems] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

  // 체크박스 상태 관리 함수
  const handleCheckboxChange = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 실제 데이터는 나중에 백엔드에서 받아올 예정
  const mockData = [
    {
      id: 1,
      projectName: '데모 프로젝트',
      description: '데모용 전광판 hdmap 작업',
      date: '2025/03/21',
      fileName: '32645787_20250321.pcd'
    },
    {
      id: 2,
      projectName: '데모 프로젝트',
      description: '데모용 전광판 hdmap 작업',
      date: '2025/03/21',
      fileName: '32645787_20250321.pcd'
    },
    {
      id: 3,
      projectName: '데모 프로젝트',
      description: '데모용 전광판 hdmap 작업',
      date: '2025/03/21',
      fileName: '32645787_20250321.pcd'
    }
  ];

  return (
    <div style={styles.wrapper}>
      <main style={styles.main}>
        <div style={styles.dashboardHeader}>
          <div style={styles.titleWrapper}>
            <h1 style={styles.dashboardTitle}>내역 대시보드</h1>
            <FaQuestionCircle 
              style={styles.questionIcon} 
              data-tooltip-id="upload-history-tooltip"
            />
            <Tooltip 
              id="upload-history-tooltip"
              place="right"
              content="올려서 작업 내역의 지도를 확인할 수 있습니다."
              style={styles.tooltip}
            />
          </div>
        </div>
        <div style={styles.uploadHistorySection}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              업로드 내역
            </h2>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{...styles.th, ...styles.thFirst}}></th>
                  <th style={styles.th}>프로젝트명</th>
                  <th style={styles.th}>프로젝트 설명</th>
                  <th style={styles.th}>날짜</th>
                  <th style={{...styles.th, ...styles.thLast}}>파일명</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item) => (
                  <tr 
                    key={item.id} 
                    style={{
                      ...styles.tr,
                      ...(hoveredRow === item.id ? styles.trHovered : {})
                    }}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={selectedItems[item.id] || false}
                        onChange={() => handleCheckboxChange(item.id)}
                        style={styles.checkbox}
                      />
                    </td>
                    <td style={styles.td}>{item.projectName}</td>
                    <td style={styles.td}>{item.description}</td>
                    <td style={styles.td}>{item.date}</td>
                    <td style={styles.td}>{item.fileName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Bottom />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F8FAFC',
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '4.3rem',
    display: 'flex',
    flexDirection: 'column',
  },
  uploadHistorySection: {
    backgroundColor: '#F3F8FB',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    minHeight: 'calc(100vh - 21rem)', // 상단 여백, 패딩, 하단 바 높이 등을 고려한 값
  },
  header: {
    padding: '1.3rem',
    marginLeft: '4rem',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1E293B',
  },
  dashboardHeader: {
    marginBottom: '1rem',
    padding: '0.5rem 0',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  dashboardTitle: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#14274E',
  },
  questionIcon: {
    color: '#64748B',
    fontSize: '1.25rem',
  },
  tableContainer: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '1rem 0',
  },
  table: {
    width: '100%',
    minWidth: '800px',
    borderCollapse: 'separate',
    borderSpacing: '0',
    padding: '0 2rem',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
   /* fontWeight: '500',*/
    color: '#64748B',
    backgroundColor: '#FFFFFF',
    whiteSpace: 'nowrap',
     borderBottom: '1px solid #E2E8F0',
    position: 'relative',
  },
  thFirst: {
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
  },
  thLast: {
    borderTopRightRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  tr: {
    borderBottom: '1px solid #E2E8F0',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    textAlign: 'center',
  },
  trHovered: {
    backgroundColor: '#DAE5EB'
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: '#334155',
    whiteSpace: 'nowrap',
  },
  checkboxCell: {
    padding: '0.75rem 1rem',
    width: '40px',
    textAlign: 'center'
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px'
  },
  tooltip: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '0.875rem',
    zIndex: 1000,
  },
};

export default UploadHistory; 