import events from '../events';

/* eslint-disable no-param-reassign */
// Back-end에 있는 socketController에서는 프론트에서 일어나는 event를 듣고
// 프론트의 유저들에게 evnet를 발생시킴
const socketController = (socket) => {
  const broadcast = (event, data) => {
    socket.broadcast.emit(event, data);
  };

  socket.on(events.setNickname, (nickname) => {
    console.log(nickname);
    socket.nickname = nickname;
    broadcast(events.newUser, nickname);
  });
  // 누군가 접속 종료했을때
  socket.on(events.disconnect, () => {
    broadcast(events.disconnected, socket.nickname);
  });
  // 누군가 메세지를 보냈을때
  socket.on(events.sendMsg, (message) => {
    broadcast(events.newMsg, { message, nickname: socket.nickname });
  });
};

export default socketController;
