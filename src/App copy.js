import React, { useState, useEffect } from 'react';

function App() {
  const [speed, setSpeed] = useState(100); // Adjust the increment rate for smooth transition
  const [intensity, setIntensity] = useState('medium');
  const [nightLight, setNightLight] = useState(false);
  const [colorIndex, setColorIndex] = useState(0); // Use for smoothly transitioning through colors

  // Define RGB color ranges for each intensity level
  const colorRanges = {
    heavy: [[255, 0, 0], [0, 0, 255]], // Example heavy colors
    medium: [[255, 165, 0], [0, 255, 0]], // Example medium colors
    light: [[255, 222, 173], [135, 206, 235]], // Example light colors
  };

  // Function to interpolate between colors
  const interpolateColor = (colorRange, progress) => {
    const [startColor, endColor] = colorRange;
    return startColor.map((start, index) => {
      const end = endColor[index];
      return Math.round(start + (end - start) * progress);
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % 360);
    }, speed);

    return () => clearInterval(intervalId);
  }, [speed]);

  const handleSpeedChange = (delta) => {
    setSpeed((prevSpeed) => Math.max(20, Math.min(2000, prevSpeed + delta)));
  };

  const handleIntensityChange = () => {
    const nextIntensity = intensity === 'heavy' ? 'medium' : intensity === 'medium' ? 'light' : 'heavy';
    setIntensity(nextIntensity);
  };

  const toggleNightLight = () => {
    setNightLight((prev) => !prev);
  };

  // Calculate current color
  const currentColorRange = colorRanges[intensity];
  const progress = (colorIndex / 360) * (nightLight ? 0 : 1);
  const [r, g, b] = interpolateColor(currentColorRange, progress);
  const backgroundColor = `rgb(${r},${g},${b})`;

  const buttonStyle = {
    border: '1px solid white',
    color: 'white',
    backgroundColor: 'transparent',
    borderRadius: '1rem',
    padding: '10px',
    margin: '5px',
    cursor: 'pointer',
  };

  const appStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: nightLight ? 'rgb(255, 248, 220)' : backgroundColor,
    transition: 'background-color 1s ease',
    padding: '0',
    margin: '0',
  };

  return (
    <div style={appStyle}>
      <button style={buttonStyle} onClick={() => handleSpeedChange(-100)}>+</button>
      <button style={buttonStyle} onClick={() => handleSpeedChange(100)}>-</button>
      <button style={buttonStyle} onClick={handleIntensityChange}>{intensity}</button>
      <button style={buttonStyle} onClick={toggleNightLight}>Night Light</button>
    </div>
  );
}

export default App;
