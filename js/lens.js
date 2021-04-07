var lens = (function() {

  var animCanvas;
  var preplaceTextGroup;
  var preplaceText;
  var postplaceCircleMask;
  var postplaceLeftOvalMask;
  var postplaceRightOvalMask;

  var backgroundImg = new Image();
  var midgroundImg = new Image();
  var foregroundImg = new Image();
  backgroundImg.src = "images/bg/img_background_bad.jpg";
  midgroundImg.src = "images/bg/img_midground_bad.jpg";
  foregroundImg.src = "images/bg/img_foreground_bad.png";
  var backgroundAfterImg = new Image();
  var midgroundAfterImgSeemax = new Image();
  var middlegroundAfterImgStandard = new Image();
  var foregroundAfterImg = new Image();
  backgroundAfterImg.src = "images/bg/img_background_good.jpg";
  midgroundAfterImgSeemax.src = "images/bg/img_midground_good.png";
  middlegroundAfterImgStandard.src = "images/bg/img_midground_standard_good.png"
  foregroundAfterImg.src = "images/bg/img_foreground_good.png";
  var midgroundAfterImg = midgroundAfterImgSeemax;

  var desiredRadius = 170;
  // var desiredRadius = 208;
  var noOfLegs = 3;
  
  var preplaceImages = {};
  var preplaceImgPath = "images/animations/pre_placement";
  var preplaceTotalFrames = 74;
  var preplaceDuration = 2150;
  var preplaceTimePerFrame = preplaceDuration / preplaceTotalFrames;
  var timeWhenLastUpdatePreplace;
  var timeFromLastUpdatePreplace;
  var preplaceFrameNo = 0;
  var preplaceId;
  var currentPosition = 1; // 0=background, 1=middleground, 2=foreground
  var offset = document.documentElement.clientHeight / 2;
  // var zoom = offset / desiredRadius / 1.3 * 0.90;
  var zoom = offset / desiredRadius /  1.3  * 0.9;
  // var texture = canvasGL.texture(midgroundAfterImg);
  // var tiltedImage = new Image();

  function handleBackgroundChange(selectedLens) {
    switch(selectedLens) {
      default:
      case 1: {
        midgroundAfterImg =  midgroundAfterImgSeemax;
        break;
      }
      case 2: {
        midgroundAfterImg =  middlegroundAfterImgStandard;
        break;
      }
    }
  }

  function scaleToFillImage(canvas, img){
    var context = canvas.getContext('2d');
    // get the scale
    var scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    var x = (canvas.width / 2) - (img.width / 2) * scale;
    var y = (canvas.height / 2) - (img.height / 2) * scale;
    // context.filter = `blur(30px) opacity(5%)`;
    // context.filter = "url('#svgBlur')"
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
    // context.drawImage(img, 100, 100, img.width * scale, img.height * scale);
  }

  function clearZoom(zoomCanvas, foregroundZoomCanvas) {
    let touchInput = {
      center: {
        x: document.documentElement.clientWidth * 1 / 2,
        y: document.documentElement.clientHeight * 3 / 4
      }
    }
    foregroundZoomCanvas.getContext('2d').clearRect(0, 0, foregroundZoomCanvas.width, foregroundZoomCanvas.height);
    var zoomContext = zoomCanvas.getContext('2d');
    zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomContext.setTransform(zoom, 
      0, 
      0, 
      zoom, 
      (zoomCanvas.width / 2 - touchInput.center.x) * zoom - zoomCanvas.width / 2 * (zoom - 1), 
      (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - 0.3/ 1.3 * zoomCanvas.height / 2 * zoom)
      // (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset * 0.95) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - zoomCanvas.height * 0.3 / 1.3)
      
    drawBgImgAfter(zoomCanvas, midgroundImg);
  }

  function shouldRenderZoom(touchInput) {
    return touchInput.center.x < document.documentElement.clientWidth * 0.7
    && touchInput.center.x > document.documentElement.clientWidth * 0.25
    && touchInput.center.y > document.documentElement.clientWidth * 0.65
  }

  function drawCircle(backgroundAfterCanvas, midgroundAfterCanvas, foregroundAfterCanvas, zoomCanvas, foregroundZoomCanvas, touchInput) {
    if (touchInput !== null && typeof(touchInput) !== "undefined") {
      // var backgroundContext = backgroundAfterCanvas.getContext('2d');
      // backgroundContext.clearRect(0, 0, backgroundAfterCanvas.width, backgroundAfterCanvas.height);
      var midgroundContext = midgroundAfterCanvas.getContext('2d');
      midgroundContext.clearRect(0, 0, midgroundAfterCanvas.width, midgroundAfterCanvas.height);
      var foregroundContext = foregroundAfterCanvas.getContext('2d');
      foregroundContext.clearRect(0, 0, foregroundAfterCanvas.width, foregroundAfterCanvas.height);
      // var zoomCanvasCenterX = document.documentElement.clientWidth / 2;
      // var zoomCanvasCenterY = document.documentElement.clientHeight / 4;
      var zoomContext = zoomCanvas.getContext('2d');
      var foregroundZoomContext = foregroundZoomCanvas.getContext('2d');
      foregroundZoomContext.clearRect(0, 0, foregroundZoomCanvas.width, foregroundZoomCanvas.height);
      // var zoom = 1;
      // var zoomOffset = offset * 0.95
      if (currentPosition == 0) { // background
        midgroundContext.save();
        midgroundContext.beginPath();
        midgroundContext.arc(touchInput.center.x, touchInput.center.y + midgroundAfterCanvas.height * 0.3 / 1.3 - 80 - offset, desiredRadius, 0, Math.PI * 2);
        midgroundContext.closePath();
        midgroundContext.clip();

        // midgroundContext.setTransform(1.1, 0, 0, 1.1, midgroundAfterCanvas.width * -0.05, midgroundAfterCanvas.height * -0.075);
        drawBgImgAfter(midgroundAfterCanvas, midgroundAfterImg);
        midgroundContext.restore();

        if (shouldRenderZoom(touchInput)) {
          zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
          zoomContext.setTransform(zoom, 
            0, 
            0, 
            zoom, 
            (zoomCanvas.width / 2 - touchInput.center.x) * zoom - zoomCanvas.width / 2 * (zoom - 1), 
            (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - (0.3/ 1.3 * zoomCanvas.height / 2 - 80)* zoom)
            // (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset * 1.05) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - zoomCanvas.height * 0.3 / 1.3)
          drawBgImgAfter(zoomCanvas, midgroundAfterImg);
        }
      } else if (currentPosition == 1) { // middleground
        midgroundContext.save();
        midgroundContext.beginPath();
        midgroundContext.arc(touchInput.center.x, touchInput.center.y + midgroundAfterCanvas.height * 0.3 / 1.3 - offset, desiredRadius, 0, Math.PI * 2);
        midgroundContext.closePath();
        midgroundContext.clip();

        // midgroundContext.setTransform(1.1, 0, 0, 1.1, midgroundAfterCanvas.width * -0.05, midgroundAfterCanvas.height * -0.075);        
        drawBgImgAfter(midgroundAfterCanvas, midgroundAfterImg);
        midgroundContext.restore();

        if (shouldRenderZoom(touchInput)) {
          zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
          zoomContext.setTransform(zoom, 
            0, 
            0, 
            zoom, 
            (zoomCanvas.width / 2 - touchInput.center.x) * zoom - zoomCanvas.width / 2 * (zoom - 1), 
            (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - 0.3/ 1.3 * zoomCanvas.height / 2 * zoom)
            // (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset * 0.95) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - zoomCanvas.height * 0.3 / 1.3)
          drawBgImgAfter(zoomCanvas, midgroundAfterImg);
        }
        
      } else { // foreground
        foregroundContext.save();
        foregroundContext.beginPath();
        foregroundContext.arc(touchInput.center.x, touchInput.center.y + foregroundAfterCanvas.height * 0.3 / 1.3 - offset, desiredRadius, 0, Math.PI * 2);
        foregroundContext.closePath();
        foregroundContext.clip();

        // foregroundContext.setTransform(1.1, 0, 0, 1.1, midgroundAfterCanvas.width * -0.05, midgroundAfterCanvas.height * -0.075);
        drawBgImgAfter(foregroundAfterCanvas, foregroundAfterImg);
        foregroundContext.restore();

        if (shouldRenderZoom(touchInput)) {
          zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
          zoomContext.setTransform(zoom, 
            0, 
            0, 
            zoom, 
            (zoomCanvas.width / 2 - touchInput.center.x) * zoom - zoomCanvas.width / 2 * (zoom - 1), 
            (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - 0.3/ 1.3 * zoomCanvas.height / 2 * zoom)
            // (1 / 1.3 * zoomCanvas.height / 2 - touchInput.center.y + offset * 0.95) * zoom - 1 / 1.3 * zoomCanvas.height / 2 * (zoom - 1) - zoomCanvas.height * 0.3 / 1.3)
          drawBgImgAfter(zoomCanvas, midgroundAfterImg);
  
          foregroundZoomContext.setTransform(zoom, 
            0, 
            0, 
            zoom, 
            (foregroundZoomCanvas.width / 2 - touchInput.center.x) * zoom - foregroundZoomCanvas.width / 2 * (zoom - 1), 
            (1 / 1.3 * foregroundZoomCanvas.height / 2 - touchInput.center.y + offset * 1) * zoom - 1 / 1.3 * foregroundZoomCanvas.height / 2 * (zoom - 1) - foregroundZoomCanvas.height * 0.3 / 1.3)
          drawBgImgAfter(foregroundZoomCanvas, foregroundAfterImg);
        }
      }
    }
  }

  function drawBgImg(backgroundCanvas, middlegroundCanvas, foregroundCanvas, zoomCanvas, foregroundZoomCanvas) {
    // scaleToFillImage(backgroundCanvas, backgroundImg);
    scaleToFillImage(middlegroundCanvas, midgroundImg);
    scaleToFillImage(foregroundCanvas, foregroundImg);
    clearZoom(zoomCanvas, foregroundZoomCanvas);
  }

  function drawBgImgAfter(canvas, bgImg) {
    scaleToFillImage(canvas, bgImg)
  }

  function clearAnimation() {
    var context = animCanvas.getContext('2d');
    context.clearRect(0, 0, animCanvas.width, animCanvas.height);
    requestAnimationFrame(clearAnimation)
  }

  function animPrePlace(startTime) {
    var context = animCanvas.getContext('2d');
    var preplaceImg = preplaceImages[preplaceFrameNo];
    if (!timeWhenLastUpdatePreplace) timeWhenLastUpdatePreplace = startTime;
    timeFromLastUpdatePreplace = startTime - timeWhenLastUpdatePreplace;
    if (timeFromLastUpdatePreplace > preplaceTimePerFrame) {
      timeWhenLastUpdatePreplace = startTime;
      if (preplaceFrameNo >= preplaceTotalFrames) {
        preplaceFrameNo = 0
      } else {
        preplaceFrameNo = preplaceFrameNo + 1
      }
    }
    
    var scale = Math.max(desiredRadius * 2.0 / preplaceImg.width, desiredRadius * 2.0 / preplaceImg.height);
    var x = (animCanvas.width / 2.0) - (preplaceImg.width / 2.0) * scale;
    var y = (animCanvas.height / 2.0 ) - (preplaceImg.height / 2.0) * scale + animCanvas.height * 0.3 / 1.3  / 2;
    context.clearRect(x, y, desiredRadius * 2, desiredRadius * 2);
    context.drawImage(preplaceImg, x, y, preplaceImg.width * scale, preplaceImg.height * scale);
    preplaceId = requestAnimationFrame(animPrePlace);
  }

  function prepLens(canvas, textGroup, text, circleMask, circleMaskContainer, leftOvalMask, rightOvalMask) {
    animCanvas = canvas;
    preplaceTextGroup = textGroup;
    preplaceText = text;
    for (var i = 0; i <= preplaceTotalFrames; i++) {
      var img = new Image();
      img.src = preplaceImgPath + "/preplace_00000_000" + (("0" + i).slice(-2)) + ".png";
      preplaceImages[i] = img
    }
    postplaceCircleMask = circleMask;
    postplaceLeftOvalMask = leftOvalMask;
    postplaceRightOvalMask = rightOvalMask;
  }

  function cancelPreplaceAnim() {
    if (preplaceId !== null) {
      cancelAnimationFrame(preplaceId);
      clearAnimation()
      preplaceId = null;
    }
  }

  // function cancelPostplaceAnim() {
  //   cancelAnimationFrame(postplaceId);
  // }

  function showPreplaceText() {
    preplaceTextGroup.style.display = "flex";
  }

  function hidePreplaceText() { 
    preplaceTextGroup.style.display = "none";
  }

  function checkIfInBackground(touchInput) {
    if (touchInput.center.y < document.documentElement.clientHeight * 0.7) {
      currentPosition = 0;
      postplaceCircleMask.classList.add('background');
      postplaceCircleMask.classList.remove('midground');
      postplaceCircleMask.classList.remove('foreground');
    } else if (touchInput.center.y > document.documentElement.clientHeight * 0.8 && (touchInput.center.x > document.documentElement.clientWidth * 0.3 && touchInput.center.x < document.documentElement.clientWidth * 0.7)) {
      currentPosition = 2;
      postplaceCircleMask.classList.remove('background');
      postplaceCircleMask.classList.remove('midground');
      postplaceCircleMask.classList.add('foreground');
    } else {
      currentPosition = 1;
      postplaceCircleMask.classList.remove('background');
      postplaceCircleMask.classList.add('midground');
      postplaceCircleMask.classList.remove('foreground');
    }
    return currentPosition
  }

  function showPostplaceMask() {
    postplaceCircleMask.style.display = "flex";
    // postplaceLeftOvalMask.style.display = "flex";
    // postplaceRightOvalMask.style.display = "flex";
  }

  function hidePostplaceMask() {
    postplaceCircleMask.style.display = "none";
    // postplaceLeftOvalMask.style.display = "none";
    // postplaceRightOvalMask.style.display = "none";
  }

  function movePostplaceMask(touchInput) {
    postplaceCircleMask.style.left = (touchInput.center.x - desiredRadius) + "px";
    postplaceCircleMask.style.top = (touchInput.center.y - desiredRadius) + "px";
    // postplaceLeftOvalMask.style.left = (touchInput.center.x - desiredRadius) - 20 + "px";
    // postplaceLeftOvalMask.style.top = touchInput.center.y - 80 + "px";
    // postplaceRightOvalMask.style.left = (touchInput.center.x) +20 + "px";
    // postplaceRightOvalMask.style.top = touchInput.center.y - 80 + "px";
  }

  return {
    prepLens: prepLens,
    noOfLegs: noOfLegs,
    // updateTouch: updateTouch,
    desiredRadius: desiredRadius,
    scaleToFillImage: scaleToFillImage,
    drawCircle: drawCircle,
    drawBgImg: drawBgImg,
    drawBgImgAfter: drawBgImgAfter,
    animPrePlace: animPrePlace,
    // animPostPlaceNoLoop: animPostPlaceNoLoop,
    // animPostPlace: animPostPlace,
    cancelPreplaceAnim: cancelPreplaceAnim,
    // cancelPostplaceAnim: cancelPostplaceAnim,
    handleBackgroundChange: handleBackgroundChange,
    showPreplaceText: showPreplaceText,
    hidePreplaceText: hidePreplaceText,
    checkIfInBackground: checkIfInBackground,
    showPostplaceMask: showPostplaceMask,
    hidePostplaceMask: hidePostplaceMask,
    movePostplaceMask: movePostplaceMask,
    clearZoom: clearZoom,
  }

}());

