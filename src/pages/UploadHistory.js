import React from 'react';
import Bottom from '../components/Bottom';

function UploadHistory() {
  // 실제 데이터는 나중에 백엔드에서 받아올 예정
  const mockData = [
    {
      id: 1,
      projectName: '데모 프로젝트',
      description: '데모용 인쇄물 파일',
      date: '2025/03/21',
      fileName: '32645787_20250321.pcd'
    },
    {
      id: 2,
      projectName: '데모 프로젝트',
      description: '데모용 인쇄물 파일',
      date: '2025/03/21',
      fileName: '32645787_20250321.pcd'
    },
    // ... 더 많은 mock 데이터를 추가할 수 있습니다
  ];

  return (
    <>
      <div style={styles.container}>
        <h2>업로드 내역</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  <input type="checkbox" />
                </th>
                <th style={styles.th}>프로젝트명</th>
                <th style={styles.th}>프로젝트 설명</th>
                <th style={styles.th}>날짜</th>
                <th style={styles.th}>파일명</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>
                    <input type="checkbox" />
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
      <Bottom />
    </>
  );
}

const styles = {
  container: {
    padding: '6rem 2rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#333'
  },
  tr: {
    borderBottom: '1px solid #eee',
    ':hover': {
      backgroundColor: '#f8f9fa'
    }
  },
  td: {
    padding: '1rem',
    color: '#666'
  }
};

export default UploadHistory; 