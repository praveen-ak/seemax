var backgroundCanvas;
var backgroundAfterCanvas;
var midgroundCanvas;
var midgroundAfterCanvas;
var foregroundCanvas;
var foregroundAfterCanvas;
var animCanvas;
var zoomCanvas;
var foregroundZoomCanvas;
var circleMask;
var circleMaskContainer
var leftOvalMask;
var leftOvalBorder;
var rightOvalMask;
var rightOvalBorder;
var leftZoomOvalMask;
var leftZoomOvalBorder;
var rightZoomOvalMask;
var rightZoomOvalBorder;
var zoomOverlay;
var preplaceText;
var preplaceTextSpan;
var infoThumb ;
var infoThumbImg;
var infoThumbGlowImg;
var infoBox;
var infoBoxImg;
var infoBoxTextHeader;
var infoBoxTextPara;
var infoBoxButton0;
var infoBoxButton1;
var infoBoxButton2;
var infoBoxButton3;
// var isTouchingInfoButton = false;
var drawerButton;
var lens1Button;
var lens2Button;
var dropdownMenu;
var selectedLens = 1;
var isVisualprefOn = true;
var isWireframeOn = true;
var visualpreControl;
var wireframeControl;
var visualprefContainer;
var input1;
var input2;
var speed = {
  1: 300,
  2: 165,
  3: 121,
  4: 100,
  5: 88,
  6: 80,
  7: 76,
  8: 73,
  9: 71,
  10: 70,
}
var diff1 = {
  0: "blur(2px)",
  1: "blur(3px)",
  2: "blur(4px)",
  3: "blur(5px)",
  4: "blur(6px)",
  5: "blur(7px)",
  6: "blur(8px)",
  7: "blur(9px)",
  8: "blur(10px)",
  9: "blur(11px)",
  10: "blur(12px)",
}

var diff2 = {
  0: "blur(10px)",
  1: "blur(10.5px)",
  2: "blur(11px)",
  3: "blur(11.5px)",
  4: "blur(12px)",
  5: "blur(12.5px)",
  6: "blur(13px)",
  7: "blur(14.5px)",
  8: "blur(15px)",
  9: "blur(15.5px)",
  10: "blur(16px)",
}
var forwardInterval;
var backwardInterval;

function handleGestureMove(event) {
  event.preventDefault();
  if (touch.getGesturePosition(event)) {
    lens.cancelPreplaceAnim();
    lens.hidePreplaceText();
    util.clearCanvases([animCanvas]);
    switch(lens.checkIfInBackground(touch.getTouchInput())) {
      default:
      case 1: { // focus on midground
        backgroundCanvas.style.bottom = "0";
        backgroundAfterCanvas.style.bottom = "0";
        midgroundCanvas.style.top = "auto";
        midgroundCanvas.style.bottom = "0px";
        midgroundAfterCanvas.style.top = "auto";
        midgroundAfterCanvas.style.bottom = "0px";
        foregroundCanvas.style.bottom = "-500px";
        foregroundAfterCanvas.style.bottom = "-500px";
        zoomCanvas.style.bottom = "0px";
        foregroundZoomCanvas.style.bottom = "-500px";
        break;
      }
      case 0: { // focus on background
        backgroundCanvas.style.bottom = "-80px";
        backgroundAfterCanvas.style.bottom = "-80px";
        midgroundCanvas.style.top = "auto";
        midgroundCanvas.style.bottom = "-80px";
        midgroundAfterCanvas.style.top = "auto";
        midgroundAfterCanvas.style.bottom = "-80px";
        foregroundCanvas.style.bottom = "-500px";
        foregroundAfterCanvas.style.bottom = "-500px";
        zoomCanvas.style.bottom = "-80px";
        foregroundZoomCanvas.style.bottom = "-500px";
        break;
      }
      case 2: { // focus on foreground
        backgroundCanvas.style.bottom = "0";
        backgroundAfterCanvas.style.bottom = "0";
        midgroundCanvas.style.top = "auto";
        midgroundCanvas.style.bottom = "0px";
        midgroundAfterCanvas.style.top = "auto";
        midgroundAfterCanvas.style.bottom = "0px";
        foregroundCanvas.style.bottom = "0px";
        foregroundAfterCanvas.style.bottom = "0px";
        zoomCanvas.style.bottom = "0px";
        foregroundZoomCanvas.style.bottom = "0px";
        break;
      }
    }
    lens.drawCircle(backgroundAfterCanvas, midgroundAfterCanvas, foregroundAfterCanvas, zoomCanvas, foregroundZoomCanvas, touch.getTouchInput());
    lens.showPostplaceMask();
    lens.movePostplaceMask(touch.getTouchInput());
    // lens.updateTouch(touch.getTouchInput());
    if (infoBox.style.display !== "flex" && selectedLens == 1) {
      info.showInfoThumb(touch.getTouchInput(), lens.desiredRadius);
      resetInfoBoxSelection();
    }
    info.moveInfoBox(touch.getTouchInput(), lens.desiredRadius)
    info.moveInfoThumb(touch.getTouchInput(), lens.desiredRadius);
    zoomOverlay.style.display = "none";
  }
}

function handleGestureStart(event) {
  // if (touch.isValidTouch(event.targetTouches[event.targetTouches.length - 1])) {
    if (touch.getGesturePosition(event)) {
      lens.cancelPreplaceAnim();
      lens.hidePreplaceText();
      util.clearCanvases([animCanvas]);
      lens.drawCircle(backgroundAfterCanvas, midgroundAfterCanvas, foregroundAfterCanvas, zoomCanvas, foregroundZoomCanvas, touch.getTouchInput());
      lens.showPostplaceMask();
      lens.movePostplaceMask(touch.getTouchInput());
      // lens.updateTouch(touch.getTouchInput());
      // lens.animPostPlaceNoLoop();
      // info.showInfoBox(touch.getTouchInput(), lens.desiredRadius);
      // console.log(info.infoBox.style.display);
      if (touch.getGesturePosition(event)) {
        if (infoBox.style.display !== "flex" && selectedLens == 1) {
          info.showInfoThumb(touch.getTouchInput(), lens.desiredRadius);
          resetInfoBoxSelection();
        }
      }
      zoomOverlay.style.display = "none";
    }
  }
// }

function handleGestureEnd(event) {
  if (event.targetTouches.length <= 2 || !touch.getGesturePosition(event)) {
    resetTouch();
  }
}

function handleGestureCancel(event) {
  if (event.targetTouches.length <= 2 || !touch.getGesturePosition(event)) {
    resetTouch();
  }
}

function resetTouch() {
  // lens.cancelPostplaceAnim();
  touch.setTouchInput(null);
  // util.clearCanvases(midgroundAfterCanvas, animCanvas);
  util.clearCanvases([backgroundAfterCanvas, midgroundAfterCanvas, foregroundAfterCanvas]);
  // lens.updateTouch(null);
  lens.animPrePlace();
  lens.showPreplaceText();
  lens.clearZoom(zoomCanvas, foregroundZoomCanvas);
  lens.hidePostplaceMask();
  info.hideInfoBox();
  info.hideInfoThumb();
  zoomOverlay.style.display = "flex";
}

function handleDockButtonTouchStart(e) {
  $(".dock-button").removeClass('active');
  $(e.target).toggleClass('active');
  lens.handleBackgroundChange(e.target.id);
  util.clearCanvases([backgroundAfterCanvas, midgroundCanvas]);
  lens.drawBgImg(backgroundCanvas, midgroundCanvas)
  if (touch.getTouchInput()) {
    lens.drawCircle(backgroundAfterCanvas, midgroundAfterCanvas, foregroundAfterCanvas, zoomCanvas, foregroundZoomCanvas, touch.getTouchInput());
  }
  info.updateEffect(e.target.id);
  resetInfoBoxSelection();
}

function resetInfoBoxSelection() {
  $(".info-box-button").removeClass('active');
  $("#info-box-button-0").toggleClass('active');
  info.updateInfo("info-box-button-0");
  resizeTextInInfoBox();
}

function handleInfoThumbTouchStart(e) {
  info.hideInfoThumb();
  // info.updateEffect("dock-button-0");
  info.showInfoBox(touch.getTouchInput(), lens.desiredRadius);
  resizeTextInInfoBox();
}

function handleInfoBoxButtonTouchStart(e) {
  // if (!isTouchingInfoButton) {
  //   isTouchingInfoButton = true;
  $(".info-box-button").removeClass('active');
  $(e.target).toggleClass('active');
  info.updateInfo(e.target.id);
  resizeTextInInfoBox()
  // }
}

function handleInfoBoxButtonTouchEnd(e) {
  // isTouchingInfoButton = false;
  $(".info-box-button").removeClass('active');
  $(e.target).toggleClass('active');
  info.updateInfo(e.target.id);
  resizeTextInInfoBox()
}

function resizeTextInInfoBox() {
  $('#info-box-text-header').textfill({
    minFontPixels: 15,
    maxFontPixels: 20,
    allowOverflow: true
  });
  $('#info-box-text-para').textfill({
    minFontPixels: 8,
    maxFontPixels: 14,
    allowOverflow: true
  });
}

function resizeOvalMasks() {
  circleMask.style.width = 2 * lens.desiredRadius + "px";
  circleMask.style.height = 2 * lens.desiredRadius + "px";
  circleMask.style.borderRadius = lens.desiredRadius + "px";

  circleMaskContainer.style.width = 2 * lens.desiredRadius + "px";
  circleMaskContainer.style.height = 2 * lens.desiredRadius + "px";
  circleMaskContainer.style.borderRadius = lens.desiredRadius + "px";

  leftOvalMask.style.width = lens.desiredRadius + "px";
  leftOvalMask.style.height = 2 * lens.desiredRadius + "px";

  leftOvalBorder.style.width = lens.desiredRadius + "px";
  leftOvalBorder.style.height = 2 * lens.desiredRadius + "px";
  
  rightOvalMask.style.width = lens.desiredRadius + "px";
  rightOvalMask.style.height = 2 * lens.desiredRadius + "px";

  rightOvalBorder.style.width = lens.desiredRadius + "px";
  rightOvalBorder.style.height = 2 * lens.desiredRadius + "px";

  leftZoomOvalMask.style.width = document.documentElement.clientWidth / 2 + "px"
  leftZoomOvalMask.style.height = document.documentElement.clientHeight + "px"

  leftZoomOvalBorder.style.width = document.documentElement.clientWidth / 2 + "px"
  leftZoomOvalBorder.style.height = document.documentElement.clientHeight + "px"

  rightZoomOvalMask.style.width = document.documentElement.clientWidth / 2 + "px"
  rightZoomOvalMask.style.height = document.documentElement.clientHeight + "px"

  rightZoomOvalBorder.style.width = document.documentElement.clientWidth / 2 + "px"
  rightZoomOvalBorder.style.height = document.documentElement.clientHeight + "px"
  
  // leftZoomOvalMask.style.width = document.documentElement.clientHeight / 2 + "px";
  // leftZoomOvalMask.style.height = document.documentElement.clientHeight / 2 + "px";
  // leftZoomOvalMask.style.borderTopRightRadius = document.documentElement.clientHeight / 2 * 7/6 + "px";
  // leftZoomOvalMask.style.borderbottomLeftRadius = document.documentElement.clientHeight / 2 + "px";
  // leftZoomOvalMask.style.marginLeft = -1 * document.documentElement.clientHeight / 8 + "px";

  // leftZoomOvalBorder.style.width = document.documentElement.clientHeight / 2 + "px";
  // leftZoomOvalBorder.style.height = document.documentElement.clientHeight / 2 + "px";
  // leftZoomOvalBorder.style.borderTopRightRadius = document.documentElement.clientHeight / 2 * 7/6 + "px";
  // leftZoomOvalBorder.style.borderbottomLeftRadius = document.documentElement.clientHeight / 2 + "px";
  // leftZoomOvalBorder.style.marginLeft = -1 * document.documentElement.clientHeight / 8 + "px";
  
  // rightZoomOvalMask.style.width = document.documentElement.clientHeight / 2 + "px";
  // rightZoomOvalMask.style.height = document.documentElement.clientHeight / 2 + "px";
  // rightZoomOvalMask.style.borderTopLeftRadius = document.documentElement.clientHeight / 2 * 7/6 + "px";
  // rightZoomOvalMask.style.borderbottomRightRadius = document.documentElement.clientHeight / 2 + "px";
  // rightZoomOvalMask.style.marginRight = -1 * document.documentElement.clientHeight / 8 + "px";

  // rightZoomOvalBorder.style.width = document.documentElement.clientHeight / 2 + "px";
  // rightZoomOvalBorder.style.height = document.documentElement.clientHeight / 2 + "px";
  // rightZoomOvalBorder.style.borderTopLeftRadius = document.documentElement.clientHeight / 2 * 7/6 + "px";
  // rightZoomOvalBorder.style.borderbottomRightRadius = document.documentElement.clientHeight / 2 + "px";
  // rightZoomOvalBorder.style.marginRight = -1 * document.documentElement.clientHeight / 8 + "px";
}

function handleDrawerButtonTouchStart(e) {
  if (dropdownMenu.style.bottom == "50%") {
    // dropdownMenu.style.bottom = "100%";
    hideDropDownMenu(e);
  } else {
    // dropdownMenu.style.bottom = "50%";
    showDropDownMenu(e);
  }
}

function showDropDownMenu(e) {
  dropdownMenu.style.bottom = "50%";
}

function hideDropDownMenu(e) {
  dropdownMenu.style.bottom = "100%";
}

function handleLens1ButtonTouchStart(e) {
  if (selectedLens == 1) {

  } else {
    selectedLens = 1;
    lens1Button.classList.add("on");
    lens2Button.classList.remove("on");
    leftZoomOvalMask.classList.add("seemax");
    leftZoomOvalBorder.classList.add("seemax");
    rightZoomOvalMask.classList.add("seemax");
    rightZoomOvalBorder.classList.add("seemax");
    leftOvalMask.classList.add("seemax");
    leftOvalBorder.classList.add("seemax");
    rightOvalMask.classList.add("seemax");
    rightOvalBorder.classList.add("seemax");

    resetThumnb();
    updateBlur(0);
    isVisualprefOn = false;
    handleVisualprefButtonTouchStart(e);
    lens.handleBackgroundChange(1);
    lens.drawCircle(backgroundAfterCanvas, midgroundAfterCanvas, foregroundAfterCanvas, zoomCanvas, foregroundZoomCanvas, touch.getTouchInput());
    if (touch.getGesturePosition(event)) {
      if (infoBox.style.display !== "flex" && selectedLens == 1) {
        info.showInfoThumb(touch.getTouchInput(), lens.desiredRadius);
        resetInfoBoxSelection();
      }
    }
  }
}

function handleLens2ButtonTouchStart(e) {
  // hideSeemaxAbbreviation();
  if (selectedLens == 1) {
    selectedLens = 2;
    lens1Button.classList.remove("on");
    lens2Button.classList.add("on");
    leftZoomOvalMask.classList.remove("seemax");
    leftZoomOvalBorder.classList.remove("seemax");
    rightZoomOvalMask.classList.remove("seemax");
    rightZoomOvalBorder.classList.remove("seemax");
    leftOvalMask.classList.remove("seemax");
    leftOvalBorder.classList.remove("seemax");
    rightOvalMask.classList.remove("seemax");
    rightOvalBorder.classList.remove("seemax");

    resetThumnb();
    updateBlur(0);
    isVisualprefOn = true;
    handleVisualprefButtonTouchStart(e);
    lens.handleBackgroundChange(2);
    lens.drawCircle(backgroundAfterCanvas, midgroundAfterCanvas, foregroundAfterCanvas, zoomCanvas, foregroundZoomCanvas, touch.getTouchInput());
    info.hideInfoThumb();
  } else {
    
  }
}

function handleVisualprefButtonTouchStart(e) {
  if (isVisualprefOn) {
    isVisualprefOn = false;
    visualpreControl.classList.remove("on");
    visualprefContainer.style.display = "none"
  } else {
    isVisualprefOn = true;
    visualpreControl.classList.add("on");
    visualprefContainer.style.display = "flex"
  }
}

function handleWireframeButtonTouchStart(e) {
  if (isWireframeOn) {
    isWireframeOn = false;
    wireframeControl.classList.remove("on");
    hideAbbreviation();
  } else {
    isWireframeOn = true;
    wireframeControl.classList.add("on");
    showAbbreviation();
  }
}

function showAbbreviation() {
  leftZoomOvalBorder.style.display = "flex";
  rightZoomOvalBorder.style.display = "flex";
}

function hideAbbreviation() {
  leftZoomOvalBorder.style.display = "none";
  rightZoomOvalBorder.style.display = "none";
}

function showSeemaxAbbreviation() {
  if (selectedLens == 1) {

  } else {
    leftZoomOvalBorder.classList.add("seemax");
    rightZoomOvalBorder.classList.add("seemax");
  }
}

function hideSeemaxAbbreviation() {
  if (selectedLens == 1) {
    leftZoomOvalBorder.classList.remove("seemax");
    rightZoomOvalBorder.classList.remove("seemax");
  } else {
    
  }
}

function handleInputTouchEnd(e) {
  if (selectedLens == 1) {
    if (parseFloat(input1.value) > parseFloat(input2.value)) {
      moveThumbForward();
    } else if (parseFloat(input1.value) < parseFloat(input2.value)) {
      moveThumbBackward();
    }
  }
}

function getDiff() {
  return Math.abs(input1.value - input2.value);
}

function moveThumbForward() {
  var index = getDiff();
  var intv = speed[index];
  clearInterval(forwardInterval);
  clearInterval(backwardInterval);
  forwardInterval = setInterval(() => {
    if (parseFloat(input1.value) > parseFloat(input2.value)) {
      input2.value = parseFloat(input2.value) + 1;
      input2.parentNode.style.setProperty(`--${input2.id}`, + input2.value);
      updateBlur(getDiff());
    } else {
      updateBlur(0);
      clearInterval(forwardInterval);
    }
  }, intv);
}

function moveThumbBackward() {
  var index = getDiff();
  var intv = speed[index];
  clearInterval(forwardInterval);
  clearInterval(backwardInterval);
  backwardInterval = setInterval(() => {
    if (parseFloat(input1.value) < parseFloat(input2.value)) {
      input2.value = parseFloat(input2.value) - 1;
      input2.parentNode.style.setProperty(`--${input2.id}`, + input2.value);
      updateBlur(getDiff());
    } else {
      updateBlur(0);
      clearInterval(backwardInterval);
    }
  }, intv);
}

function resetThumnb() {
  input1.value = 0;
  input2.value = 0;
  input1.parentNode.style.setProperty(`--${input1.id}`, + 0);
  input2.parentNode.style.setProperty(`--${input2.id}`, + 0);
}

function updateBlur(d) {
  var diff = selectedLens == 1 ? diff1[d] : diff2[d];
  leftZoomOvalMask.style.WebkitBackdropFilter = diff;
  rightZoomOvalMask.style.WebkitBackdropFilter = diff;
  leftOvalMask.style.WebkitBackdropFilter = diff;
  rightOvalMask.style.WebkitBackdropFilter = diff;
}

window.onload = function init() {
  backgroundCanvas = document.getElementById('backgroundCanvas');
  backgroundAfterCanvas = document.getElementById('backgroundAfterCanvas');
  midgroundCanvas = document.getElementById('midgroundCanvas');
  midgroundAfterCanvas = document.getElementById('midgroundAfterCanvas');
  foregroundCanvas = document.getElementById('foregroundCanvas');
  foregroundAfterCanvas = document.getElementById('foregroundAfterCanvas');
  animCanvas = document.getElementById('animCanvas');
  zoomCanvas = document.getElementById('zoomCanvas');
  foregroundZoomCanvas = document.getElementById('foregroundZoomCanvas');
  circleMask = document.getElementById('circle-mask');
  circleMaskContainer = document.getElementById('circle-mask-container');
  leftOvalMask = document.getElementById('left-oval-mask');
  leftOvalBorder = document.getElementById('left-oval-border');
  rightOvalMask = document.getElementById('right-oval-mask');
  rightOvalBorder = document.getElementById('right-oval-border');
  leftZoomOvalMask = document.getElementById('left-zoom-oval-mask');
  leftZoomOvalBorder = document.getElementById('left-zoom-oval-border');
  rightZoomOvalMask = document.getElementById('right-zoom-oval-mask');
  rightZoomOvalBorder = document.getElementById('right-zoom-oval-border');
  zoomOverlay = document.getElementById('zoom-overlay');
  preplaceTextGroup = document.getElementById('preplace-text-group');
  preplaceText = document.getElementById('preplace-text');
  infoThumb = document.getElementById("info-thumb");
  infoThumbImg = document.getElementById("info-thumb-img");
  infoThumbGlowImg = document.getElementById("info-thumb-glow-img")
  infoBox = document.getElementById("info-box");
  infoBoxImg = document.getElementById("info-box-img");
  infoBoxTextHeader = document.getElementById("info-box-text-header");
  infoBoxTextPara = document.getElementById("info-box-text-para");
  infoBoxButton0 = document.getElementById("info-box-button-0");
  infoBoxButton1 = document.getElementById("info-box-button-1");
  infoBoxButton2 = document.getElementById("info-box-button-2");
  infoBoxButton3 = document.getElementById("info-box-button-3");
  drawerButton = document.getElementById("drawer-button");
  lens1Button = document.getElementById("lens1-button")
  lens2Button = document.getElementById("lens2-button")
  dropdownMenu = document.getElementById("dropdown-menu");
  visualpreControl = document.getElementById("visualpref-control");
  wireframeControl = document.getElementById("wireframe-control")
  input1 = document.getElementById("v2")
  input2 = document.getElementById("v0")
  visualprefContainer = document.getElementById("visualpref-container")

  util.resize([backgroundCanvas, backgroundAfterCanvas, midgroundCanvas, midgroundAfterCanvas, foregroundCanvas, foregroundAfterCanvas, animCanvas, zoomCanvas, foregroundZoomCanvas]);
  lens.drawBgImg(backgroundCanvas, midgroundCanvas, foregroundCanvas, zoomCanvas, foregroundZoomCanvas)
  lens.prepLens(animCanvas, preplaceTextGroup, preplaceText, circleMask, circleMaskContainer, leftOvalMask, rightOvalMask)
  // lens.updateTouch(null);
  lens.animPrePlace();
  touch.prepTouch(lens.desiredRadius, lens.noOfLegs);
  info.prepInfo(infoThumb, infoThumbImg, infoThumbGlowImg, infoBox, infoBoxImg, infoBoxTextHeader, infoBoxTextPara, infoBoxButton0,
  infoBoxButton1, infoBoxButton2, infoBoxButton3);
  
  animCanvas.addEventListener('touchstart', this.handleGestureStart, true);
  animCanvas.addEventListener('touchmove', this.handleGestureMove, true);
  animCanvas.addEventListener('touchend', this.handleGestureEnd, true);
  animCanvas.addEventListener('touchcancel', this.handleGestureCancel, true);

  resizeTextInInfoBox();
  resizeOvalMasks();
  info.updateEffect("dock-button-0");
  
  $('.no-zoom').bind('touchend', function(e) {
    e.preventDefault();
    // Add your code here. 
    $(this).click();
    // This line still calls the standard click event, in case the user needs to interact with the element that is being clicked on, but still avoids zooming in cases of double clicking.
  })

  addEventListener('input', e => {
    var _t = e.target;
    _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value);
    updateBlur(getDiff());
  }, false);

  
}

window.onresize = function() {
  util.resize([backgroundCanvas, backgroundAfterCanvas, midgroundCanvas, midgroundAfterCanvas, foregroundCanvas, foregroundAfterCanvas, animCanvas, zoomCanvas, foregroundZoomCanvas]);
  lens.drawBgImg(backgroundCanvas, midgroundCanvas, foregroundCanvas, zoomCanvas, foregroundZoomCanvas)
}