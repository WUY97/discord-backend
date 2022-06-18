const roomSignalingDataHandler = (socket, data) => {
    const { connUserSocketId, signal } = data;

    const signalingdata = { signal, connUserSocketId: socket.id };
    socket.to(connUserSocketId).emit('conn-signal', signalingdata);
};

module.exports = roomSignalingDataHandler;