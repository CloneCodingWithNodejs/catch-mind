import { handleNewUser, handleDisConnected } from './notifications';
import { handleNewMessage } from './chat';

let socket = null;

export const getSocket = () => socket;

export const updateSocket = (aSocket) => {
  socket = aSocket;
};

export const initSocket = (aSocket) => {
  // eslint-disable-next-line no-shadow
  updateSocket(aSocket);
  aSocket.on(window.events.newUser, handleNewUser);
  aSocket.on(window.events.disconnected, handleDisConnected);
  aSocket.on(window.events.newMsg, handleNewMessage);
};
