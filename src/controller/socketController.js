import events from '../events';
import { chooseWord } from '../word';

/* eslint-disable no-param-reassign */
// Back-end에 있는 socketController에서는 프론트에서 일어나는 event를 듣고
// 프론트의 유저들에게 evnet를 발생시킴

let sockets = [];
// 게임 진행상황
let inProgress = false;
let leader = null;
let word = null;
let timeout = null;

const selectLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const superBroadcast = (event, data) => io.emit(event, data);

  // 게임시작 함수
  const startGame = () => {
    if (inProgress === false && sockets.length >= 2) {
      inProgress = true;
      leader = selectLeader();
      word = chooseWord();
      superBroadcast(events.gameStarting);
      setTimeout(() => superBroadcast(events.gameStarted), 3000);
      setTimeout(
        () => io.to(leader.id).emit(events.leaderAlarm, { word }),
        3000
      );

      // eslint-disable-next-line no-use-before-define
      timeout = setTimeout(() => endGame(), 33000);
    }
  };

  // 누군가 접속했을때
  socket.on(events.setNickname, (nickname) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, point: 0, nickname });
    broadcast(events.newUser, nickname);
    superBroadcast(events.playerUpdate, { sockets });
    setTimeout(() => startGame(), 3000);
  });

  // 게임종료
  const endGame = () => {
    inProgress = false;
    if (timeout) clearTimeout(timeout);
    superBroadcast(events.gameEnded);
    setTimeout(() => startGame(), 3000);
  };

  // 누군가 접속 종료했을때
  socket.on(events.disconnect, () => {
    // 여기서 socket은 현재 접속 종료한 사람 item은 sockets 배열안의 socket들
    // 일치하지않은것만 걸러서 리턴함
    sockets = sockets.filter((item) => socket.id !== item.id);

    if (sockets.length === 1) {
      endGame();
    } else if (leader) {
      if (leader.id === socket.id) endGame();
    }

    broadcast(events.disconnected, socket.nickname);
    superBroadcast(events.playerUpdate, { sockets });
  });

  const addPoint = (id) => {
    sockets = sockets.map((socket) => {
      if (socket.id === id) {
        socket.point += 10;
      }
      return socket;
    });
    superBroadcast(events.playerUpdate, { sockets });
    clearTimeout(timeout);
  };

  // 누군가 메세지를 보냈을때
  socket.on(events.sendMsg, (message) => {
    broadcast(events.newMsg, { message, nickname: socket.nickname });
    if (message === word) {
      superBroadcast(events.newMsg, {
        message: `정답은 ${word} 입니다, 정답자는 ${socket.nickname} ! `,
        nickname: 'BOT'
      });
      addPoint(socket.id);
      endGame();
    }
  });

  // 누군가 Path를 만들때
  socket.on(events.beginPath, ({ x, y }) => {
    broadcast(events.beganPath, { x, y });
  });

  // 누군가 드래그해서 그릴때
  socket.on(events.strokePath, ({ x, y, color }) => {
    broadcast(events.strokedPath, { x, y, color });
  });

  // 캔버스 지우기
  socket.on(events.canvasClear, () => {
    broadcast(events.canvasCleared);
  });

  // 캔버스 색칠
  socket.on(events.fill, ({ color }) => {
    broadcast(events.filled, { color });
  });
};

export default socketController;
