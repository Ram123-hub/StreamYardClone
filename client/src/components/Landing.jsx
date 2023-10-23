import React from 'react';
import Button from '@mui/material/Button';

const buttonContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  marginTop: '20px',
  justifyContent: 'flex-end', // Align the content to the right
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between', // Align items to the right and create space between them
  alignItems: 'center', // Align items vertically
  padding: '20px',
  backgroundColor: '#2C2C2F', // Light background color
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  
};



const landingPageStyle = {
  backgroundColor: '#2C2C2F', // Add black background color to the landing page
  minHeight: '100vh', // Ensure the background covers the entire viewport height
};

function Landing() {
  return (
    <div style={landingPageStyle}>
      <div style={headerStyle}>
        <Button  variant='contained'>Streamyard Clone</Button> {/* Add font size and color */}
        <div style={buttonContainerStyle}>
          <Button variant='contained'>Signup</Button>
          <Button variant='contained'>Login</Button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
