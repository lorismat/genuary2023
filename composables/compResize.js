export default function (small) {
  const smallCanvas = {
    width: `${small}px`,
    height: `${small}px`,
    position: "absolute",
    zIndex: "-10",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    border: "1px solid black"
  };
  const largeCanvas = {
    position: "absolute",
    zIndex: "-10",
    top: "0",
    left: "0",
  };
  const objStyle = {
    style: small != undefined ? smallCanvas : largeCanvas,
    width: small != undefined ? small : window.innerWidth,
    height: small != undefined ? small : window.innerHeight, 
  };

  return objStyle
}