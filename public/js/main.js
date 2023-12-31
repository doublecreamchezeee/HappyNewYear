import { io } from 'socket.io-client'

const socket = io("http://localhost:21575");

socket.on("connect", () => {
    console.log('you connected with id: ${socket.id}');
})