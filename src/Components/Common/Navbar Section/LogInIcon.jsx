import React from 'react';

const LoginIcon= ({ firstName, lastName }) => {
  if (firstName && firstName?.length > 0) {
  const getInitials = (name) => {
    const words = name.split(' ');
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    return initials.join('');
  };
const initials = getInitials(firstName) + getInitials(lastName);


  return (
    <div style={{
        display:'flex',
        alignItems:"center",
        justifyContent:"center",
        width: "3rem",
        height: "3rem",
        backgroundColor: '#e0dfdf',
        color: '#333',
        borderRadius: '50px',
        fontSize: "16px",
        marginTop:"1.6rem"
    }}>
      <span style={{fontWeight:'bold'}}>{initials}</span>
    </div>
  );
}else {
  // Props "data" is empty
  return (
    <div style={{
      display:'flex',
      alignItems:"center",
      justifyContent:"center",
      width: "3rem",
      height: "3rem",
      backgroundColor: '#e0dfdf',
      color: '#333',
      borderRadius: '50px',
      fontSize: "16px",
      marginTop:"1.6rem"
  }}>
  </div>
  );
}
};


export default LoginIcon;


// const LoginIcon: React.FC<LoginIconProps> = ({ firstName, lastName }) => {
  

 