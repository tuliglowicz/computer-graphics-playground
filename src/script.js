const changeEvent = new Event('change'); // to reuse stuff
const clickEvent = new Event('click'); // to reuse stuff

const colorContainer = document.getElementById('colorMatrix');
const pixelContainer = document.getElementById('pixelMatrix');
const transformContainer = document.getElementById('transformMatrix');

const colorInputs = [...colorContainer.querySelectorAll('input')];
const pixelInputs = [...pixelContainer.querySelectorAll('input')];
const transformInputs = [...transformContainer.querySelectorAll('input')];

const img = document.querySelector('img');
const LIST_SIZE = img.width * img.height * 4; // rgba = 4 * 8bits

const memCanvas = document.createElement('canvas'); // canvas not to be 

memCanvas.width = img.width;
memCanvas.height = img.height;
const memContext = memCanvas.getContext('2d');
memContext.drawImage(img, 0, 0);

const imgData = memContext.getImageData(0, 0, img.width, img.height);
const { data } = imgData;


const canvas = document.querySelector('canvas');
canvas.width = img.width;
canvas.height = img.height;
const context = canvas.getContext('2d');
context.putImageData(imgData, 0, 0);

let cData = new Uint8ClampedArray(data);

colorContainer.addEventListener('change', () => {
  const matrix = partition(colorInputs.map(inp => inp.value), 3);
  applyColorMatrix(matrix, cData);
});
document.getElementById('transformMatrixSubmit').addEventListener('click', () => {
  const matrix = partition(transformInputs.map(inp => inp.value), 3);
  applyTransformationMatrix(matrix, cData);
});
pixelContainer.addEventListener('change', () => {
  const matrix = partition(pixelInputs.map(inp => inp.value), 3);
  applyPixelMatrix(matrix, cData);
});

// RESETS
const resetCanvas = () => {
  context.putImageData(imgData, 0, 0);
  cData = new Uint8ClampedArray(data);
}
const resetColors = () => {
  colorInputs.forEach(inp => inp.value = 0);
  colorInputs[0].value = 1;
  colorInputs[4].value = 1;
  colorInputs[8].value = 1;
  resetCanvas();
};
const resetTrans = () => {
  transformInputs.forEach(inp => inp.value = 0);
  transformInputs[0].value = 1;
  transformInputs[4].value = 1;
  transformInputs[8].value = 1;
  resetCanvas();
};
const resetPixel = () => {
  pixelInputs.forEach(inp => inp.value = 0);
  pixelInputs[0].value = 0;
  pixelInputs[4].value = 1;
  pixelInputs[8].value = 0;
  resetCanvas();
};
const resetAll = () => {
  resetPixel();
  resetColors();
  resetPixel();
  resetCanvas();
}

document.getElementById('resetColor').addEventListener('click', resetColors);
document.getElementById('resetTransform').addEventListener('click', resetTrans);
document.getElementById('resetPixel').addEventListener('click', resetPixel);
document.getElementById('resetAll').addEventListener('click', resetAll);
// EO RESETS

const transparent = document.getElementById('transparent');
const invert = document.getElementById('invert');

const setMatrix = (matrix3x3, inputList) => {
  matrixMultiplication(matrix3x3, partition(inputList.map(inp => inp.value), 3))
    .flat().forEach((item, idx) => inputList[idx].value = item);
}
const setMatrix2 = (matrix3x3, inputList) => {
  matrix3x3
    .flat().forEach((item, idx) => inputList[idx].value = item);
}
const setPixelMatrix = matrix => setMatrix2(matrix, pixelInputs)
const setTransformationMatrix = matrix => setMatrix(matrix, transformInputs)
const setColorMatrix = matrix => setMatrix(matrix, colorInputs)

let isTransparentActive = false;
transparent.addEventListener('click', () => {
  for (let i = 3; i < LIST_SIZE; i += 4) {
    cData[i] = isTransparentActive ? 255 : 200;
  }
  isTransparentActive = !isTransparentActive;
  context.putImageData(new ImageData(cData, 200, 200), 0, 0);
});
invert.addEventListener('click', () => {
  for (let i = 0; i < LIST_SIZE; i += 4) {
    cData[i]     = 255 - cData[i];
    cData[i + 1] = 255 - cData[i + 1];
    cData[i + 2] = 255 - cData[i + 2];
  }
  context.putImageData(new ImageData(cData, 200, 200), 0, 0);
});

const flipXMatrix = [
  [-1,0,0],
  [0,1,0],
  [0,0,1],
];
document.getElementById('flipX').addEventListener('click', () => {
  setTransformationMatrix(flipXMatrix);
  // applyTransformationMatrix(flipXMatrix, cData);
});

const flipYMatrix = [
  [1,0,0],
  [0,-1,0],
  [0,0,1],
];
document.getElementById('flipY').addEventListener('click', () => {
  setTransformationMatrix(flipYMatrix);
  // applyTransformationMatrix(flipYMatrix, cData);
});

const rotateMatrix = [
  [0,1,0],
  [-1,0,0],
  [0,0,1],
];
document.getElementById('rotate').addEventListener('click', () => {
  setTransformationMatrix(rotateMatrix);
  // applyTransformationMatrix(rotateMatrix, cData);
});

const scaleMatrix = [
  [0.5,0,0],
  [0,0.5,0],
  [0,0,1],
];
document.getElementById('scale').addEventListener('click', () => {
  setTransformationMatrix(scaleMatrix);
  // applyTransformationMatrix(scaleMatrix, cData);
});

const moveMatrix = [
  [1,0,10],
  [0,1,10],
  [0,0,1],
];
document.getElementById('move').addEventListener('click', () => {
  setTransformationMatrix(moveMatrix);
  // applyTransformationMatrix(moveMatrix, cData);
});

const sepiaMatrix = [
  [0.39, 0.769, 0.189],
  [0.349, 0.686, 0.168],
  [0.272, 0.534, 0.131]
];
document.getElementById('sepia').addEventListener('click', () => {
  setColorMatrix(sepiaMatrix);
  // applyColorMatrix(sepiaMatrix)
});

const desaturateMatrix = [
  [.666666, .166666, .166666],
  [.166666, .666666, .166666],
  [.166666, .166666, .666666],
];
document.getElementById('desaturate').addEventListener('click', () => {
  setColorMatrix(desaturateMatrix);
  // applyColorMatrix(desaturateMatrix)
});

const saturateMatrix = [
  [1.33333, -.16666, -.16666],
  [-.16666, 1.33333, -.16666],
  [-.16666, -.16666, 1.33333],
];
document.getElementById('saturate').addEventListener('click', () => {
  setColorMatrix(saturateMatrix);
  // applyColorMatrix(saturateMatrix)
});

const grayscaleMatrix = [
  [.333333, .333333, .333333],
  [.333333, .333333, .333333],
  [.333333, .333333, .333333],
];
document.getElementById('grayscale').addEventListener('click', () => {
  setColorMatrix(grayscaleMatrix);
  // applyColorMatrix(grayscaleMatrix)
});

const blurMatrix = [
  [1/9, 1/9, 1/9],
  [1/9, 1/9, 1/9],
  [1/9, 1/9, 1/9]
];
document.getElementById('blur').addEventListener('click', () => {
  setPixelMatrix(blurMatrix);
  // applyPixelMatrix(blurMatrix, cData)
});

const gaussianMatrix = [
  [1/16, 1/8, 1/16],
  [1/8,  1/4, 1/8 ],
  [1/16, 1/8, 1/16]
];
document.getElementById('gaussianBlur').addEventListener('click', () => {
  setPixelMatrix(gaussianMatrix);
  // applyPixelMatrix(gaussianMatrix, cData)
});

const sharpenMatrix = [
  [0, -.5, 0],
  [-.5, 3, -.5],
  [0, -.5, 0]
];
document.getElementById('sharpen').addEventListener('click', () => {
  setPixelMatrix(sharpenMatrix);
  // applyPixelMatrix(sharpenMatrix, cData)
});

const edgeMatrix = [
  [-1, -1, -1],
  [-1,  8, -1],
  [-1, -1, -1]
];
document.getElementById('edge').addEventListener('click', () => {
  setPixelMatrix(edgeMatrix);
  // applyPixelMatrix(edgeMatrix, cData)
});

const embossMatrix = [
  [-2, 0, 0],
  [0, 1, 0],
  [0, 0, 2]
];
document.getElementById('emboss').addEventListener('click', () => {
  setPixelMatrix(embossMatrix);
  // applyPixelMatrix(embossMatrix, cData)
});

const brightenMatrix = [
  [0, 0, 0],
  [0, 1.05, 0],
  [0, 0, 0]
];
document.getElementById('brighten').addEventListener('click', () => {
  setPixelMatrix(brightenMatrix);
  // applyPixelMatrix(brightenMatrix, cData)
});

const darkenMatrix = [
  [0, 0, 0],
  [0, .95, 0],
  [0, 0, 0]
];
document.getElementById('darken').addEventListener('click', () => {
  setPixelMatrix(darkenMatrix);
  // applyPixelMatrix(darkenMatrix, cData)
});

const redMatrix = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
document.getElementById('r').addEventListener('click', () => {
  setColorMatrix(redMatrix);
  // applyColorMatrix(redMatrix)
});

const greenMatrix = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
document.getElementById('g').addEventListener('click', () => {
  setColorMatrix(greenMatrix);
  // applyColorMatrix(greenMatrix)
});

const blueMatrix = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
];
document.getElementById('b').addEventListener('click', () => {
  setColorMatrix(blueMatrix);
  // applyColorMatrix(blueMatrix)
});
