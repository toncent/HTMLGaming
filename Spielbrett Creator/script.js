document.addEventListener('DOMContentLoaded', init);

function init() {
  document.getElementById("blue_space").style.background = "url('./assets/bluespace.png') no-repeat scroll";
  document.getElementById("red_space").style.background = "url('./assets/redspace.png') no-repeat scroll";
  document.getElementById("canvas").addEventListener("mousemove", handleMouseMove(e));
}

function handleMouseMove(evt) {
  //TODO
}