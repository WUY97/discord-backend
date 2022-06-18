const serverStore  = require('../serverStore');
const friendsUpdates = require('../socketHandlers/updates/friends');
const roomsUpdate = require('./updates/rooms');
const newConenctionHandler = async(socket, io) => {
    const userDetails = socket.user;

    serverStore.addNewConnectedUser({
        socketId: socket.id,
        userId: userDetails.userId,
    });

    // update pending friends invitations list
    friendsUpdates.updateFriendsPendingInvitations(userDetails.userId);

    // update friends list
    friendsUpdates.updateFriends(userDetails.userId);

    setTimeout(() => {
        roomsUpdate.updateRooms(socket.id);
    },[500]);
};

module.exports = newConenctionHandler;