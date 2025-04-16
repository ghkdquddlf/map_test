import React from 'react';
import Bottom from '../components/Bottom';

function FileUpload() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <div style={styles.container}>
          <h2>File Upload</h2>
          <div style={styles.uploadArea}>
            <p>Upload your file here</p>
          </div>
        </div>
      </div>
      <Bottom />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
  container: {
    padding: '6rem 2rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  uploadArea: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#f8f8f8'
  }
};

export default FileUpload; 