const Player = require("../models/user.m");

module.exports = function (io) {
//   io.on("connection", (client) => {
//     client.on("player-has-online", async (username) => {
//       console.log("Update");
//       await Player.addOnlineList(username);
//       const playerOnlineList = Player.getPlayerOnlineList();
//       const playerInfoList = playerOnlineList.map((playerName) => {
//         return Player.getAccount(playerName);
//       });
//       io.emit("update-player-online-list", playerInfoList);
//     });

//     client.on("general-chatting", (data) => {
//       const player = Player.getAccount(data.username);
//       data.name = player.name;
//       console.log(data);
//       io.emit("general-chatting", data);
//     });

//     client.on("onquit", async () => {
//       await Player.clearUserOnlineList();
//     });
//   });
  const playerController = {
    homePage: (req, res, next) => {
      res.render('homegame', {
        layout: 'game',
        showHeader: true,
        username: req.cookies.username,
    });
    },
  };
  return playerController;
};
