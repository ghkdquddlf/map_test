import React from 'react';

function Bottom() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.links}>
          <button style={styles.button}>관리기관</button>
          <button style={styles.button}>참여기관</button>
          <button style={styles.button}>유관기관</button>
          <button style={styles.button}>관련사이트</button>
        </div>
        <div style={styles.content}>
          <img src="/keti.png" alt="KETI Logo" style={styles.logo} />
          <div style={styles.info}>
            <div style={styles.title}>한국전자기술연구원</div>
            <div style={styles.subtitle}>Korea Electronics Technology Institute</div>
            <div style={styles.contact}>
              <p>(ㅇㅇㅇㅇㅇ) ㅇㅇㅇ ㅇㅇㅇ ㅇㅇㅇ ㅇㅇㅇ</p>
              <p>대표전화 000-000-0000 (평일 09시~18시)</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#f5f5f5',
    padding: '2rem 0',
    marginTop: '2rem',
    borderTop: '1px solid #eee'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  logo: {
    height: '40px',
    marginRight: '2rem'
  },
  info: {
    color: '#666'
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  subtitle: {
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  },
  contact: {
    fontSize: '0.85rem',
    lineHeight: '1.5'
  },
  links: {
    display: 'flex',
    gap: '1rem'
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#666',
    fontSize: '0.9rem',
    ':hover': {
      backgroundColor: '#f0f0f0'
    }
  }
};

export default Bottom; 