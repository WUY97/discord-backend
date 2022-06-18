const authSocket = require('./middleware/authSocket');
const newConnectionHandler = require('./socketHandlers/newConnectionHandler');
const disconnectHandler = require('./socketHandlers/disconnectSocketHandler');
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");
const serverStore = require('./serverStore');
const roomLeaveHandler = require("./socketHandlers/roomLeaveHandler");
const roomInitializeConnectionHandler = require("./socketHandlers/roomInitializeConnectionHandler");
const roomSignalingDataHandler = require("./socketHandlers/roomSignalingDataHandler");

const registerSocketServer = (server) => {
    const { Server } = require('socket.io');
    const io = new Server(server,{
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    serverStore.setSocketServerInstance(io);

    io.use((socket,next) => {
        authSocket(socket,next);
    });

    const emitOnlineUsers = () => {
        const onlineUsers = serverStore.getOnlineUsers();
        io.emit('online-users', { onlineUsers });
    };

    io.on('connection', (socket) => {
        console.log('user connected');
        console.log(socket.id);
        
        newConnectionHandler(socket, io);
        emitOnlineUsers();
        
        socket.on("direct-message", (data) => {
            directMessageHandler(socket, data);
        });

        socket.on('direct-chat-history', (data) => {
            directChatHistoryHandler(socket, data);
        });

        socket.on('room-create', () => {
            roomCreateHandler(socket);
        });

        socket.on('room-join', (data) => {
            roomJoinHandler(socket, data);
        });

        socket.on('room-leave', (data) => {
            roomLeaveHandler(socket, data);
        });

        socket.on('conn-init', (data) => {
            roomInitializeConnectionHandler(socket, data);
        })

        socket.on('disconnect', () =>{
            disconnectHandler(socket);
        });

        socket.on('conn-signal', (data => {
            roomSignalingDataHandler(socket, data);
        }));

    });

    setInterval(()=>{
        emitOnlineUsers();
    }, [1000 * 4]);
};

module.exports = {
    registerSocketServer,
}