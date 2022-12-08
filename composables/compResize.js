export default function (small) {
  const smallCanvas = {
    width: "500px",
    height: "500px",
    position: "absolute",
    zIndex: "-10",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
  };
  const largeCanvas = {
    position: "absolute",
    zIndex: "-10",
    top: "0",
    left: "0",
  };
  const objStyle = {
    style: small == "true" ? smallCanvas : largeCanvas,
    width: small == "true" ? 500 : window.innerWidth,
    height: small == "true" ? 500 : window.innerHeight, 
  };

  return objStyle
}