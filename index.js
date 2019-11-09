const path = require('path');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const moment = require('moment');


let DataBase = require('./database');
let StatusModel = require('./StatusSchema');
let ErrorModel = require('./ErrorSchema');
let ChatModel = require('./ChatSchema');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const port = process.env.PORT || '8000';
const secret = 'secretkeyhere';
var auth = [];

server.listen(port);
console.log('Server listening on port ' + port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

/* main site page */
app.get('/', (req, res) =>{
   res.render('index', {title: "Server Status Panel"});
});

// Client sends secret, if it matches, we send back the client's id
app.post('/update/serverstatus', (req, res) => {
   let json = req.body;

   if(!(secret === json.secret)){
      return;
   }

   let status = new StatusModel({
      TotalPopulation: json.TotalPopulation,
      HumanPopulation: json.HumanPopulation,
      ZombiePopulation: json.ZombiePopulation,
      SpectatorPopulation: json.SpectatorPopulation,
      BotPopulation: json.BotPopulation,
      TotalConnects: json.TotalConnects,
      TotalDisconnects: json.TotalDisconnects,
      TotalZombieDeaths: json.TotalZombieDeaths,
      TotalHumanDeaths: json.TotalHumanDeaths,
      TotalPointsEarned: json.TotalPointsEarned,
      TotalPointsSpent: json.TotalPointsSpent,
      TotalWeaponsPurchased: json.TotalWeaponsPurchased,
      TotalAmmoPurchased: json.TotalAmmoPurchased,
      TotalNailedProps: json.TotalNailedProps,
      TotalNailsUsed: json.TotalNailsUsed,
      TotalHumanMessages: json.TotalHumanMessages,
      TotalZombieMessages: json.TotalZombieMessages,
      TotalGlobalMessages: json.TotalGlobalMessages,
      AverageWeaponTierInUse: json.AverageWeaponTierInUse,
      CurrentWave: json.CurrentWave,
      CurrentMap: json.CurrentMap
   });

   status.save()
       .then(doc => {
       })
       .catch(err => {
          console.error(err);
       });
});

app.post('/update/error', (req, res) => {
   let json = req.body;

   if(!(secret === json.secret)){
      return;
   }

   let error = new ErrorModel({
      ErrorMessage: json.ErrorMessage,
      ErrorType: json.ErrorType
   });

   error.save()
       .then(doc => {
       })
       .catch(err => {
          console.log(err);
       });
});

app.post('/update/chat', (req, res) => {
   let json = req.body;

   if(!(secret === json.secret)){
      return;
   }

   let message = new ChatModel({
      ChatMessage: json.ChatMessage,
      PlayerName: json.PlayerName,
      PlayerSteamID: json.PlayerSteamID,
      PlayerTeam: json.PlayerTeam,
      IsGlobal: json.IsGlobal
   });

   message.save()
       .then(doc => {
       })
       .catch(err => {
          console.log(err);
       });
});

/* Used by the data page to get data */
io.on('connection', function(socket){

   console.log('Client connected: ' + socket.handshake.address.address + ':' + socket.handshake.address.port)
   socket.on('request_data', (startDate, endDate, startTime, endTime, filter) => {
      console.log(startDate + ":" + endDate + ":" + startTime + ":" + endTime + ":" + filter);

      const start_str = startDate + ' ' + startTime + ':00';
      const end_str = endDate + ' ' + endTime + ':00';

      const start_moment = moment(start_str, "YYYY-MM-DD HH:mm:ss", true);
      const end_moment = moment(end_str, "YYYY-MM-DD HH:mm:ss", true);

      if(!start_moment.isValid() || !end_moment.isValid()){
         socket.emit('err_invalid_time_index');
         return;
      }

      if(end_moment.isBefore(start_moment)){
         socket.emit('err_end_before_start');
         return;
      }

      const start = new Date(start_str);
      const end = new Date(end_str);

      var filt = JSON.parse(filter);

      filt['Time'] = {'$gte': start, '$lt': end};

      console.log(JSON.stringify(filt));

      StatusModel.find(filt).then(docs => {
         console.log('sending data');
         socket.emit('send_data', docs);
      });
   });

   socket.on('db_status', () => {
      StatusModel.count({}, function(err, count){
         var StatusCount = count;
         ErrorModel.count({}, function(err, _count){
            var ErrorCount = _count;
            ChatModel.count({}, function(err, __count){
               socket.emit('send_db_status', StatusCount, __count, ErrorCount);
            });
         });
      });
   });

   socket.on('disconnect', () => {
      console.log('Client disconnected: ' + socket.handshake.address.address + ':' + socket.handshake.address.port)
   });
});