// assume 3 x 3 matrix
const multiplyByPixelMatrix = (src, pos, line, matrix) => (
  matrix[0][0] * src[pos - line - 4]  + matrix[0][1] * src[pos - line] + matrix[0][2] * src[pos - line + 4] +
  matrix[1][0] * src[pos - 4]         + matrix[1][1] * src[pos]        + matrix[1][2] * src[pos + 4]        +
  matrix[2][0] * src[pos + line - 4]  + matrix[2][1] * src[pos + line] + matrix[2][2] * src[pos + line + 4]
);

// assume 3 x 3 matrix
const multiplyByColorMatrix = ([r, g, b], matrix) => [
  matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b,
  matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b,
  matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b,
];

// assume 3 x 3 matrix
const multiplyByTransformationMatrix = ([x, y], w, h, matrix) => [
  (w + matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * 1) % w , // x prim
  (h + matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * 1) % h , // y prim
  matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * 1,
];

const applyPixelMatrix = (matrix, cData) => {
  const len = 200; // 4 channels / px * 200px
  const lenMinus1 = 199;
  const line = 800;
  let pos;
  let data = new Uint8ClampedArray(cData); // copy
  for (let i = 1; i < lenMinus1; i++) {
    for (let j = 1; j < lenMinus1; j++) {
      pos = (i * len + j) * 4; // red channel
      cData[pos] = multiplyByPixelMatrix(data, pos, line, matrix);
      cData[pos + 1] = multiplyByPixelMatrix(data, pos + 1, line, matrix);
      cData[pos + 2] = multiplyByPixelMatrix(data, pos + 2, line, matrix);
    }
  }
  context.putImageData(new ImageData(cData, 200, 200), 0, 0);
}

const applyTransformationMatrix = (matrix, cData) => {
  const len = 200; // 4 channels / px * 200px
  let pos, posPrim;
  let data = new Uint8ClampedArray(cData); // copy
  for (let y = 0; y < len; y++) {
    for (let x = 0; x < len; x++) {
      pos = (y * len + x) * 4;
      const [x1, y1] = multiplyByTransformationMatrix([x, y], len, len, matrix);
      posPrim = (Math.ceil(y1) * len + Math.ceil(x1)) * 4;
      cData[posPrim] = data[pos] ?? 0;
      cData[posPrim + 1] = data[pos + 1] ?? 255;
      cData[posPrim + 2] = data[pos + 2] ?? 0;
    }
  }
  context.putImageData(new ImageData(cData, 200, 200), 0, 0);
}

const applyColorMatrix = (matrix, data) => {
  const len = 200; // 4 channels / px * 200px
  let pos;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      pos = (i * len + j) * 4; // red channel
      const [r, g, b] = multiplyByColorMatrix(
        [cData[pos], cData[pos + 1], cData[pos + 2]],
        matrix,
      );
      cData[pos] = r;
      cData[pos + 1] = g;
      cData[pos + 2] = b;
    }
  }
  context.putImageData(new ImageData(cData, 200, 200), 0, 0);
}

const partition = (arr, chunkSize) => {
  const result = [];
  let tmpArr = [];
  for (let i = 0; i < arr.length; i++) {
    tmpArr.push(arr[i]);
    if (tmpArr.length >= chunkSize) {
      result.push(tmpArr);
      tmpArr = [];
    }
  }
  if (tmpArr.length > 0) {
    result.push(tmpArr);
  }

  return result;
}

const matrixMultiplication = (m1, m2) => {
  const result = [[],[],[]];
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          result[i][j] = m1[i][0] * m2[0][j]
              + m1[i][1] * m2[1][j]
              + m1[i][2] * m2[2][j] 
      }
  }
  return result;
}

const vectorMultiplication = (m1, m2) => {
  const result = [[],[],[]];
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          result[i][j] = m1[i][j] * m2[i][j];
      }
  }
  return result;
}
