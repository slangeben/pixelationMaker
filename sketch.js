let logo;         
let baseLayer;   
let frozenAreas = [];
let fileInput;
let saveButton;

let brushSizeSlider, pixelSizeSlider;
let controlsDiv;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();

  // Controls container
  controlsDiv = createDiv().style('text-align', 'center').style('position', 'absolute').style('bottom', '10px').style('width', '100%');

  // File input
  fileInput = createFileInput(handleFile);
  fileInput.parent(controlsDiv);

  // Save button
  saveButton = createButton('save image');
  saveButton.parent(controlsDiv);
  saveButton.mousePressed(() => saveCanvas('pixellated_image', 'png'));

  // Sliders
  createSpan('brush size').parent(controlsDiv).style('margin', '0 10px');
  brushSizeSlider = createSlider(50, 400, 180, 1);
  brushSizeSlider.parent(controlsDiv);

  createSpan('pixel size').parent(controlsDiv).style('margin', '0 10px');
  pixelSizeSlider = createSlider(2, 50, 14, 1);
  pixelSizeSlider.parent(controlsDiv);

  loadDefaultLogo();
}

function draw() {
  if (!baseLayer) return;
  image(baseLayer, 0, 0);

  let brushSize = brushSizeSlider.value();
  let hoverPixelSize = pixelSizeSlider.value();

  // Draw frozen areas
  for (let area of frozenAreas) {
    image(area.img, area.x, area.y, area.pixelSize, area.pixelSize);
    let tiny = get(area.x, area.y, area.pixelSize, area.pixelSize);
    image(tiny, area.x, area.y, area.size, area.size);
  }

  // Hover preview for mouse
  if (mouseX && mouseY && !touches.length) {
    let x = constrain(mouseX - brushSize / 2, 0, width - brushSize);
    let y = constrain(mouseY - brushSize / 2, 0, height - brushSize);

    let lens = baseLayer.get(x, y, brushSize, brushSize);
    image(lens, x, y, hoverPixelSize, hoverPixelSize);
    let tiny = get(x, y, hoverPixelSize, hoverPixelSize);
    image(tiny, x, y, brushSize, brushSize);
  }

  // Hover preview for touch
  if (touches.length) {
    for (let t of touches) {
      let x = constrain(t.x - brushSize / 2, 0, width - brushSize);
      let y = constrain(t.y - brushSize / 2, 0, height - brushSize);

      let lens = baseLayer.get(x, y, brushSize, brushSize);
      image(lens, x, y, hoverPixelSize, hoverPixelSize);
      let tiny = get(x, y, hoverPixelSize, hoverPixelSize);
      image(tiny, x, y, brushSize, brushSize);
    }
  }
}

// Unified function to freeze areas
function freezeArea(x, y) {
  if (!baseLayer) return;

  let brushSize = brushSizeSlider.value();
  let pixelSize = pixelSizeSlider.value();
  x = constrain(x - brushSize / 2, 0, width - brushSize);
  y = constrain(y - brushSize / 2, 0, height - brushSize);
  let lens = baseLayer.get(x, y, brushSize, brushSize);

  frozenAreas.push({ img: lens, x: x, y: y, size: brushSize, pixelSize: pixelSize });
}

// Mouse input
function mousePressed() {
  freezeArea(mouseX, mouseY);
}

function mouseDragged() {
  freezeArea(mouseX, mouseY);
}

// Touch input
function touchStarted() {
  for (let t of touches) {
    freezeArea(t.x, t.y);
  }
  return false; // prevent scrolling
}

function touchMoved() {
  for (let t of touches) {
    freezeArea(t.x, t.y);
  }
  return false; // prevent scrolling
}
