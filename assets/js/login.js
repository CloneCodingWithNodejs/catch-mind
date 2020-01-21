import { initSocket } from './sockets';

const body = document.querySelector('body');
const loginForm = document.getElementById('jsLogin');
const nickname = localStorage.getItem('nickname');

const LOGGED_OUT = 'loggedOut';
const LOGGED_IN = 'loggedIn';
const NICKNAME = 'nickname';

// eslint-disable-next-line no-shadow
const login = (nickname) => {
  // eslint-disable-next-line no-undef
  const socket = io('/');
  socket.emit(window.events.setNickname, nickname); // socketController가 듣고있음
  initSocket(socket); // 프론트단에서 사용할 소켓 초기화
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const input = loginForm.querySelector('input');
  const { value } = input;
  input.value = '';
  localStorage.setItem(NICKNAME, value);
  login(value); // 로그인 함수 실행
  body.className = LOGGED_IN;
};

if (nickname === null) {
  body.className = LOGGED_OUT;
} else {
  body.className = LOGGED_IN;
  login(nickname);
}

if (loginForm) {
  loginForm.addEventListener('submit', handleFormSubmit);
}
