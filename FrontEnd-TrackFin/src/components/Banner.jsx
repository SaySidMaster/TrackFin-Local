function Banner({ title, actionBanner, actionBanner2, callToAction }) {
  
  const style = {
    display: "flex", 
    width: "100%", 
    height: "100px", 
    padding: "0 20px", 
    justifyContent: "space-between", 
    alignItems:"center",
    backgroundColor: "white",
    borderRadius: "20px",
  };

  return <div style={style}>
    <h1>{title}</h1>
    <div style={{display: "flex", gap: "20px", alignItems: "center"}}>
        {actionBanner && actionBanner}
        {actionBanner2 && actionBanner2}
        {callToAction && callToAction}
    </div>
    
  </div>
}

export default Banner