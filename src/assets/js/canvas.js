/* eslint-disable import/no-cycle */
import { getSocket } from './sockets';

const canvas = document.getElementById('jsCanvas');
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName('jsColor');
const clear = document.getElementById('jsClear');
const brushSize = document.getElementById('jsSize');
const mode = document.getElementById('jsMode');
const controls = document.getElementById('controls');

const BRUSH_DEFAULT = 4;
const INITIAL_COLOR = '#2c2c2c';

// css 스타일 말고 실제 canvas의 pixel 사이즈를 정해주어야함
canvas.width = 700;
canvas.height = 700;

// 선의 색깔
ctx.strokeStyle = INITIAL_COLOR;
// 채우기의 색깔
ctx.fillStyle = INITIAL_COLOR;

// 선의 굵기
ctx.lineWidth = BRUSH_DEFAULT;
// eslint-disable-next-line no-unused-vars
let painting = false;
let filling = false;

const stopPainting = () => {
  painting = false;
};

const startPainting = () => {
  painting = true;
};

const beginPath = (x, y) => {
  ctx.beginPath();
};

const strokePath = (x, y, color) => {
  // 현재 색상을 임시저장
  const currentColor = ctx.strokeStyle;
  // 다른 사용자가 그렸던  색상으로 바꾸어서  그림을 그림
  ctx.strokeStyle = color;
  ctx.lineTo(x, y);
  ctx.stroke();

  // 그 후에 내 색상으로 다시 바꿈
  ctx.strokeStyle = currentColor;
};

const onMouseMove = (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  if (!painting) {
    // path를 계속 생성함 (클릭될때까지 )
    beginPath(x, y);
    getSocket().emit(window.events.beginPath, { x, y });
  } else {
    // path의 시작점과 현재의 위치를 연결함
    strokePath(x, y);
    getSocket().emit(window.events.strokePath, {
      x,
      y,
      color: ctx.strokeStyle
    });
  }
};

const changeColor = (e) => {
  const color = e.target.style.backgroundColor;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

export const canvasClear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const handleClear = () => {
  canvasClear();
  getSocket().emit(window.events.canvasClear);
};

const handleModeClick = () => {
  if (filling === true) {
    filling = false;
    mode.innerText = 'Fill';
  } else {
    filling = true;
    mode.innerText = 'Paint';
  }
};

const fill = (color) => {
  const currentColor = ctx.fillStyle;
  ctx.fillStyle = color;
  console.log(color);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = currentColor;
};

const handleCanvasClick = () => {
  if (filling === true) {
    fill();
    getSocket().emit(window.events.fill, { color: ctx.fillStyle });
  }
};

const handleBrushSize = (e) => {
  const size = e.target.value;
  ctx.lineWidth = BRUSH_DEFAULT * size;
};

export const handleBeganPath = ({ x, y }) => beginPath(x, y);
export const handleStrokedPath = ({ x, y, color }) => strokePath(x, y, color);
export const handleCanvasCleared = () => canvasClear();
export const handleFilled = ({ color }) => fill(color);
// 리더를 제외한 다른 유저들은 캔버스에 그림을 그리지못함
export const disableCanvas = () => {
  canvas.removeEventListener('mousemove', onMouseMove);
  canvas.removeEventListener('mousedown', startPainting);
  canvas.removeEventListener('mouseup', stopPainting);
  canvas.removeEventListener('mouseleave', stopPainting);
  clear.removeEventListener('click', handleClear);
  brushSize.removeEventListener('mouseup', handleBrushSize);
  mode.removeEventListener('click', handleModeClick);
  canvas.removeEventListener('click', handleCanvasClick);

  Array.from(colors).forEach((color) => {
    color.removeEventListener('click', changeColor);
  });
};

export const enableCanvas = () => {
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', startPainting);
  canvas.addEventListener('mouseup', stopPainting);
  canvas.addEventListener('mouseleave', stopPainting);
  clear.addEventListener('click', handleClear);
  brushSize.addEventListener('mouseup', handleBrushSize);
  mode.addEventListener('click', handleModeClick);
  canvas.addEventListener('click', handleCanvasClick);

  Array.from(colors).forEach((color) => {
    color.addEventListener('click', changeColor);
  });
};

export const hideControls = () => {
  controls.style.opacity = 0;
};

export const showControls = () => {
  controls.style.opacity = 1;
};

if (canvas) {
  enableCanvas();
}
