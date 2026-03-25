function CallToAction1({ title, iconSrc, action }) {
  
  const style = {
    display: "flex", 
    height: "40px", 
    padding: "0 17px", 
    justifyContent: "center", 
    alignItems:"center",
    backgroundColor: "#1E1E1E",
    borderRadius: "20px",
    border: 'none',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    gap: '15px',
  };

  return <button style={style} onClick={action}>
    <p>{title}</p>
    <img
        src={iconSrc}
        alt='Ajouter'
        style={{width: '20px', height: '20px', objectFit: 'contain',}}
    />
  </button>
}

export default CallToAction1