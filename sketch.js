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

function loadDefaultLogo() {
  logo = loadImage('indexImg.png', () => {
    setupBaseLayer(logo);
  });
}

function handleFile(file) {
  if (file.type === 'image') {
    logo = loadImage(file.data, () => {
      setupBaseLayer(logo);
      frozenAreas = [];
    });
  } else {
    alert('please upload an image file :)');
  }
}

function setupBaseLayer(img) {
  baseLayer = createGraphics(windowWidth, windowHeight);
  baseLayer.background(255);

  let maxLogoW = width * 0.55;
  let maxLogoH = height * 0.6;
  let logoRatio = img.width / img.height;

  let logoW = maxLogoW;
  let logoH = logoW / logoRatio;

  if (logoH > maxLogoH) {
    logoH = maxLogoH;
    logoW = logoH * logoRatio;
  }

  baseLayer.imageMode(CENTER);
  baseLayer.image(img, width / 2, height / 2, logoW, logoH);
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

  // Hover preview
  let x = constrain(mouseX - brushSize / 2, 0, width - brushSize);
  let y = constrain(mouseY - brushSize / 2, 0, height - brushSize);

  let lens = baseLayer.get(x, y, brushSize, brushSize);
  image(lens, x, y, hoverPixelSize, hoverPixelSize);
  let tiny = get(x, y, hoverPixelSize, hoverPixelSize);
  image(tiny, x, y, brushSize, brushSize);
}

function mousePressed() {
  if (!baseLayer) return;

  let brushSize = brushSizeSlider.value();
  let pixelSize = pixelSizeSlider.value();
  let x = constrain(mouseX - brushSize / 2, 0, width - brushSize);
  let y = constrain(mouseY - brushSize / 2, 0, height - brushSize);
  let lens = baseLayer.get(x, y, brushSize, brushSize);

  // Store pixel size per frozen area
  frozenAreas.push({ img: lens, x: x, y: y, size: brushSize, pixelSize: pixelSize });
}
