import React, { useState } from 'react';
import Bottom from '../components/Bottom';
import PageContainer from '../components/PageContainer';

function FileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  // 파일 업로드 처리 함수
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setIsUploading(true);
    setIsUploadComplete(false);
    setUploadStatus('파일 업로드 중...');

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('file', file);

    // XMLHttpRequest를 사용한 업로드
    const xhr = new XMLHttpRequest();
    
    // 업로드 진행률 추적
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
        
        // 예상 남은 시간 계산 (선택적)
        const uploadSpeed = event.loaded / (Date.now() - startTime); // bytes per ms
        const remainingBytes = event.total - event.loaded;
        const remainingTime = remainingBytes / uploadSpeed / 1000; // seconds
        
        setUploadStatus(`파일 업로드 중... 약 ${Math.round(remainingTime)}초 남음`);
      }
    };

    // 업로드 완료 처리
    xhr.onload = () => {
      if (xhr.status === 200) {
        setIsUploading(false);
        setIsUploadComplete(true);
        setUploadStatus('파일 업로드가 완료되었습니다.');
      } else {
        setIsUploading(false);
        setUploadStatus('업로드 중 오류가 발생했습니다.');
      }
    };

    // 업로드 에러 처리
    xhr.onerror = () => {
      setIsUploading(false);
      setUploadStatus('업로드 중 오류가 발생했습니다.');
    };

    // 시작 시간 기록
    const startTime = Date.now();

    // 테스트를 위한 가상 업로드 (실제 구현 시 제거)
    simulateSlowUpload(file.size);
  };

  // 파일 크기에 따른 가상 업로드 시뮬레이션 (테스트용)
  const simulateSlowUpload = (fileSize) => {
    const totalChunks = 100;
    const chunkSize = fileSize / totalChunks;
    let uploadedSize = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      uploadedSize += chunkSize;
      const progress = Math.min(Math.round((uploadedSize / fileSize) * 100), 100);
      setUploadProgress(progress);

      // 예상 남은 시간 계산
      const elapsedTime = Date.now() - startTime;
      const uploadSpeed = uploadedSize / elapsedTime; // bytes per ms
      const remainingBytes = fileSize - uploadedSize;
      const remainingTime = remainingBytes / uploadSpeed / 1000; // seconds

      if (progress < 100) {
        setUploadStatus(`파일 업로드 중... 약 ${Math.round(remainingTime)}초 남음`);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setIsUploadComplete(true);
        setUploadStatus('파일 업로드가 완료되었습니다.');
      }
    }, Math.max(50, Math.min(fileSize / 1000000, 200)));
  };

  const handleViewMap = () => {
    // 지도 보기 기능 구현
    console.log('지도 보기 클릭');
  };

  return (
    <>
      <PageContainer
        title="HD MAP 파일 업로드"
        tooltipContent="HD맵 생성을 위한 파일을 업로드할 수 있습니다."
      >
        <div style={styles.uploadSection}>
          <div style={styles.uploadArea}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>*프로젝트명</label>
              <input 
                type="text" 
                placeholder="프로젝트 명을 입력해주세요."
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>*프로젝트 설명</label>
              <input 
                type="text" 
                placeholder="프로젝트에 대한 설명을 입력해주세요."
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>*열람 권한 설정</label>
              <input 
                type="text" 
                placeholder="열람 권한을 설정해주세요."
                style={styles.input}
              />
            </div>
            <div style={styles.fileInfoSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>업로드 파일</label>
                <div style={styles.fileInfo}>
                  {selectedFile ? (
                    <span style={styles.fileName}>{selectedFile.name}</span>
                  ) : (
                    <span style={styles.noFile}>선택된 파일이 없습니다.</span>
                  )}
                </div>
              </div>
            </div>
            {!isUploading && !isUploadComplete && (
              <div style={styles.dropZone}>
                <p style={styles.dropZoneText}>파일을 드래그하여 업로드하거나</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={styles.fileInput}
                  accept=".pcd"
                  id="fileInput"
                />
                <button 
                  style={styles.uploadButton}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  파일 선택하기
                </button>
                <p style={styles.fileTypeText}>.pcd 파일만 업로드 가능합니다.</p>
              </div>
            )}
            {(isUploading || isUploadComplete) && (
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
                <div style={styles.progressText}>
                  <span>{uploadProgress}%</span>
                  <span>{uploadStatus}</span>
                </div>
              </div>
            )}
            {isUploadComplete && (
              <div style={styles.viewMapContainer}>
                <button 
                  style={{...styles.uploadButton, marginTop: '1rem'}}
                  onClick={handleViewMap}
                >
                  지도 보기
                </button>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
      <Bottom />
    </>
  );
}

const styles = {
  uploadSection: {
    padding: '2rem 4rem',
  },
  uploadArea: {
    borderRadius: '12px',
    padding: '2rem',
  },
  inputGroup: {
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#000000',
    width: '120px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    maxWidth: '400px',
  },
  dropZone: {
    border: '2px dashed #E2E8F0',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    marginTop: '2rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  },
  dropZoneText: {
    margin: '0 0 1rem 0',
    color: '#64748B',
    fontSize: '0.9rem',
  },
  uploadButton: {
    backgroundColor: '#0B1C40',
    color: '#FFFFFF',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  fileTypeText: {
    margin: '1rem 0 0 0',
    color: '#94A3B8',
    fontSize: '0.8rem',
  },
  fileInput: {
    display: 'none',
  },
  progressContainer: {
    marginTop: '2rem',
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E2E8F0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
    color: '#64748B',
    fontSize: '0.9rem',
  },
  fileInfoSection: {
    marginBottom: '1.5rem',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '1.5rem',
  },
  fileInfo: {
    flex: 1,
    padding: '0.75rem 1rem',
    backgroundColor: '#F8FAFC',
    borderRadius: '6px',
    fontSize: '0.9rem',
    maxWidth: '400px',
  },
  fileName: {
    color: '#1E293B',
  },
  noFile: {
    color: '#94A3B8',
  },
  viewMapContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
};

export default FileUpload; 