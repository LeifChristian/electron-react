import React, { useState, useEffect } from 'react';

// import { ipcRenderer } from 'electron';

function App() {
  const [speed, setSpeed] = useState(100); // Adjust the increment rate for smooth transition
  const [intensity, setIntensity] = useState('medium');
  const [nightLight, setNightLight] = useState(false);
  const [colorIndex, setColorIndex] = useState(0); // Used for transitioning through colors
  const [sliderValue, setSliderValue] = useState(0)

  // Define a color cycle for each intensity level that ends where it starts for smooth looping
  const colorCycles = {
    heavy: [[255, 0, 0], [0, 0, 255], [255, 0, 0]], // Loop back to start for smooth transition
    medium: [[255, 165, 0], [0, 255, 0], [255, 165, 0]],
    light: [[255, 222, 173], [135, 206, 235], [255, 222, 173]],
  };

  const exitApp = () => {
    ipcRenderer.send('quit-app');
  };

  // Function to interpolate between colors
  const interpolateColor = (colorCycle, progress) => {
    // Determine which two colors to interpolate based on progress
    const cycleLength = colorCycle.length;
    const scale = progress * (cycleLength - 1);
    const firstColorIndex = Math.floor(scale);
    const secondColorIndex = (firstColorIndex + 1) % cycleLength;
    const localProgress = scale - firstColorIndex;

    const startColor = colorCycle[firstColorIndex];
    const endColor = colorCycle[secondColorIndex];
    return startColor.map((start, index) => {
      const end = endColor[index];
      return Math.round(start + (end - start) * localProgress);
    });
  };

  useEffect(() => {
    const intervalDuration = 3600 / speed; // Inverse relationship for intuitive control
    const intervalId = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % 360);
    }, intervalDuration);

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
  const currentColorCycle = colorCycles[intensity];
  const progress = colorIndex / 360;
  const [r, g, b] = interpolateColor(currentColorCycle, progress);
  const backgroundColor = `rgb(${r},${g},${b})`;

  const buttonStyle = {
    border: '1px solid white',
    color: 'white',
    backgroundColor: 'transparent',
    borderRadius: '1rem',
    opacity: "0.4",
    padding: '10px',
    margin: '5px',
    marginBottom: '80vh',
    cursor: 'pointer',
  };

  const exitButtonStyle = {
    border: '1px solid white',
    color: 'white',
    backgroundColor: 'transparent',
    position: 'absolute',
    borderRadius: '1rem',
    opacity: "0.4",
    left: "93vw",
    top: "90vh",
    fontSize: '2.2rem',
    padding: "8px",
    cursor: 'pointer',
  };

  const nightLightOnStyle = {
    border: '1px solid black',
    opacity: '0.2',
    color: 'black',
    backgroundColor: 'transparent',
    borderRadius: '1rem',
    padding: '10px',
    margin: '5px',
    marginBottom: '80vh',
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
    backgroundColor: nightLight ? 'rgb(254, 250, 234)' : backgroundColor,
    padding: '0',
    margin: '0',
  };

  const sliderStyle = {

    right: '100px', // Keep it on the right side
    top: '10vh', // Start a bit from the top to leave space for any header or padding
    height: '80vh', // Make the slider cover most of the vertical space
    width: '2px', // Slider thickness, adjust as needed
    opacity: '0.7',
    backgroundColor: 'lightgray', // Slider track color
    // No need for rotation; adjust the orientation through height and width
  };

  const robert = sliderValue;
  
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div style={appStyle}>
       <input
      type="range"
      min="0"
      max="100"
      value={sliderValue}
      onChange={handleSliderChange}
      style={sliderStyle}
    />
  <div style={{background: "black", opacity: robert, width: '100vw', height: '100vh', position: "absolute"}}></div>
      <button style={buttonStyle} onClick={() => handleSpeedChange(-10)}>Slower</button>
      <button style={buttonStyle} onClick={() => handleSpeedChange(10)}>Faster</button>
      <button style={buttonStyle} onClick={handleIntensityChange}>{intensity}</button>
      <button style={ !nightLight ? buttonStyle : nightLightOnStyle} onClick={toggleNightLight}>Night Light</button>
      <button style={exitButtonStyle} onClick={() => window.electronAPI.exitApp()} >
    X
      </button>


    </div>
  );
}

export default App
