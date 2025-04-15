import React from 'react';
import Map from '../components/Map';

function MapView() {
  return (
    <div style={styles.container}>
      <Map />
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }
};

export default MapView; 