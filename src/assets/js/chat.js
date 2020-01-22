import { getSocket } from './sockets';

/* eslint-disable operator-linebreak */
const messages = document.getElementById('jsMsg');
const sendMsg = document.getElementById('jsSendMsg');

const appendMsg = (text, nickname) => {
  const li = document.createElement('li');
  li.innerHTML = `
    <span class='author ${nickname ? 'other' : 'self'}'>${nickname ||
    '나'} : </span> ${text}
    `;
  messages.appendChild(li);
};

const handleSendMsg = (event) => {
  event.preventDefault();
  const input = sendMsg.querySelector('input');
  const { value } = input;
  input.value = '';
  getSocket().emit(window.events.sendMsg, value);
  appendMsg(value);
};

export const handleNewMessage = ({ message, nickname }) => {
  appendMsg(message, nickname);
};

export const disableChat = () => {
  sendMsg.style.display = 'none';
};

export const enableChat = () => {
  sendMsg.style.display = 'block';
};

if (sendMsg) {
  sendMsg.addEventListener('submit', handleSendMsg);
}
