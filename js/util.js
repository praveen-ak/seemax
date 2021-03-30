var util = (function() {
  function resize(canvases) {
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight / 2 * 1.3;
    }
  };

  function clearCanvases(canvases) {
    for (var i = 0; i < canvases.length; i++) {
      var canvas = canvases[i];
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    resize: resize,
    clearCanvases: clearCanvases
  }
}());