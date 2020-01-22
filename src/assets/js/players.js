// eslint-disable-next-line import/no-cycle
import {
  disableCanvas,
  hideControls,
  showControls,
  enableCanvas,
  canvasClear
} from './canvas';
// eslint-disable-next-line import/no-cycle
import { enableChat, disableChat } from './chat';

const board = document.getElementById('jsPBoard');
const notifs = document.getElementById('jsNotifs');
const seconds = document.getElementById('jsTimer');

let timer = null;

const addPlayers = (players) => {
  board.innerHTML = '';
  players.forEach((player) => {
    const playerElement = document.createElement('span');
    playerElement.innerText = `${player.nickname} : ${player.point}`;
    board.appendChild(playerElement);
  });
};

const setNotifs = (text) => {
  if (text !== null) notifs.innerText = text;
};

const setSeconds = (second) => {
  seconds.innerText = second;
};
export const handlePlayerUpdate = ({ sockets }) => {
  addPlayers(sockets);
};
export const handleGameStarted = () => {
  setNotifs('');
  setNotifs('게임 시작되었습니다. 그림을 보고 정답을 맞춰보세요');
  canvasClear();
  // 캔버스에 그림을 그리지 못하게함
  disableCanvas();
  // 캔버스 컨트롤창도 가림
  hideControls();
  setSeconds(30);

  timer = setInterval(() => {
    setSeconds(Number(seconds.innerText) - 1);
  }, 1000);
};

export const handleLeaderAlarm = ({ word }) => {
  enableCanvas();
  showControls();
  disableChat();
  setNotifs('');
  setNotifs(`당신이 그릴 차례입니다 문제 : ${word}`);
  canvasClear();
};

export const handleGameEnded = () => {
  setNotifs(
    '게임이 종료되었습니다,  유저가 두명이상이라면 곧 게임이 시작합니다'
  );
  enableCanvas();
  showControls();
  canvasClear();
  enableChat();

  if (timer) clearInterval(timer);
  setSeconds(30);
};

export const handleGameStarting = () => {
  setNotifs('게임이 3초 후에 시작됩니다!');
};
