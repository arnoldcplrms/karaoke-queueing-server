const http = require('http');
const socketIO = require('socket.io');
const { SOCKET_EVENTS } = require('./constants');
const { saveObjectAsJsonFile, generateRandomString } = require('./helpers');

const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A client connected');

  // Listen for the 'song-added' event from clients
  socket.on(SOCKET_EVENTS.ADD_SONG_TO_QUEUE, async (song) => {
    // Broadcast the new song to all connected clients, including the one who added it
    const { songToQueue, metaData } = song;
    const fileName = `${songToQueue.videoId}`;
    try {
      const dataToSave = {
        ...metaData,
        ...songToQueue,
      };

      delete dataToSave.addedBy;
      await saveObjectAsJsonFile(dataToSave, fileName, 'popular');
      io.emit(SOCKET_EVENTS.ADD_SONG_TO_QUEUE, songToQueue);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(SOCKET_EVENTS.SAVE_SEARCH_RESULT, async (searchData) => {
    try {
      const { searchQuery, searchResults } = searchData;
      const fileName = `${searchQuery.toLowerCase()}|${generateRandomString()}`;
      await saveObjectAsJsonFile(searchResults, fileName, 'search-results');
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(SOCKET_EVENTS.VIDEO_UNEMBEDDABLE, async (song) => {
    try {
      const fileName = generateRandomString();
      await saveObjectAsJsonFile(song, fileName, 'unembeddable');
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

const port = 3000; // Change this to any port you prefer
server.listen(port, () => {
  console.log(`Socket.IO server listening on http://localhost:${port}`);
});
