import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <h1 style={styles.title}>자율 농작업 3D 경로 생성 지원 서비스</h1>
        <div style={styles.links}>
          <Link to="/upload" style={styles.link}>파일 업로드</Link>
          <Link to="/history" style={styles.link}>업로드 내역</Link>
          <Link to="/map" style={styles.link}>지도</Link>
        </div>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1rem',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333'
  },
  links: {
    display: 'flex',
    gap: '2rem'
  },
  link: {
    textDecoration: 'none',
    color: '#666',
    fontWeight: '500',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f0f0f0'
    }
  }
};

export default Header; 