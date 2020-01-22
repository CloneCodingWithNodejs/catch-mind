/* eslint-disable import/no-cycle */
import { handleNewUser, handleDisConnected } from './notifications';
import { handleNewMessage } from './chat';
import {
  handleBeganPath,
  handleStrokedPath,
  handleCanvasCleared,
  handleFilled
} from './canvas';
import {
  handlePlayerUpdate,
  handleGameStarted,
  handleLeaderAlarm,
  handleGameEnded,
  handleGameStarting
} from './players';

let socket = null;

export const getSocket = () => socket;

// 여기서 서버가 보낸 이벤트를 Listen할거임
export const initSocket = (aSocket) => {
  // eslint-disable-next-line no-shadow
  socket = aSocket;
  socket.on(window.events.newUser, handleNewUser);
  socket.on(window.events.disconnected, handleDisConnected);
  socket.on(window.events.newMsg, handleNewMessage);
  socket.on(window.events.beganPath, handleBeganPath);
  socket.on(window.events.strokedPath, handleStrokedPath);
  socket.on(window.events.canvasCleared, handleCanvasCleared);
  socket.on(window.events.filled, handleFilled);
  socket.on(window.events.playerUpdate, handlePlayerUpdate);
  socket.on(window.events.gameStarted, handleGameStarted);
  socket.on(window.events.leaderAlarm, handleLeaderAlarm);
  socket.on(window.events.gameEnded, handleGameEnded);
  socket.on(window.events.gameStarting, handleGameStarting);
};
