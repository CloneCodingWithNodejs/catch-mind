const body = document.querySelector('body');

const fireNotification = (text, color) => {
  console.log('fire');
  const notification = document.createElement('div');
  notification.innerText = text;
  notification.style.background = color;
  notification.className = 'notification';

  //
  body.appendChild(notification);
};

// 누군가 참가했을때
export const handleNewUser = (nickname) => {
  fireNotification(`${nickname} 님이 참가했습니다!`, '#4dabf7');
};

// 누군가 종료했을때
export const handleDisConnected = (nickname) => {
  fireNotification(`${nickname} 님이 떠났습니다..`, '#f03e3e');
};
