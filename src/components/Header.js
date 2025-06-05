import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <h1 style={styles.title}>자율 농작업 3D 경로 생성 지원 서비스</h1>
        <div style={styles.links}>
          {isLoggedIn ? (
            <>
              <Link to="/history" style={styles.link}>업로드 내역</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
            </>
          ) : (
            <span style={styles.guidanceText}>로그인 후 서비스 이용이 가능합니다</span>
          )}
        </div>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    padding: '1rem',
    /*position: 'fixed', -> 상단바를 고정할지 안할지 결정*/ 
    top: 0,
    left: 0,
    right: 0,
    borderBottom: '1px solid #E2E8F0',
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
    gap: '2rem',
    alignItems: 'center'
  },
  link: {
    color: '#000000',
    fontWeight: '1000',
    textDecoration: 'none'
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#000000',
    fontWeight: '1000',
    cursor: 'pointer',
    padding: 0,
    fontSize: 'inherit'
  },
  guidanceText: {
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: '500'
  }
};

export default Header; 