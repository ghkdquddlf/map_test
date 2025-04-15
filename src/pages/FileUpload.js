import React from 'react';
import Bottom from '../components/Bottom';

function FileUpload() {
  return (
    <>
      <div style={styles.container}>
        <h2>File Upload</h2>
        <div style={styles.uploadArea}>
          <p>Upload your file here</p>
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
  uploadArea: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#f8f8f8'
  }
};

export default FileUpload; 