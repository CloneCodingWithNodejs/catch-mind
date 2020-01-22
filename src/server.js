/* eslint-disable comma-dangle */
import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import morgan from 'morgan';

import globalRouter from './routers/globalRouter';
import socketController from './controller/socketController';

const PORT = 4000;
const app = express();
app.use(morgan('dev'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));

app.use(globalRouter);

const handleListening = () => {
  console.log('************** Server Statrted ^오^ ****************');
};

const server = app.listen(PORT, handleListening);

const io = socketIO.listen(server);

//  이벤트를 발생시킴
io.on('connection', (socket) => {
  socketController(socket, io);
});
