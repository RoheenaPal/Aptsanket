const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')


const User = require('./models/user');
const ContactPerson = require('./models/contactPerson');
const Doctor = require('./models/doc');

mongoose.connect('mongodb://localhost:27017/aptsanket', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")

    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const db = mongoose.connection.useDb('aptsanket');


app.set('views', [path.join(__dirname, 'views'),
path.join(__dirname, 'views/rooms/')]);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})
app.use('/public', express.static('public'));



app.get('/signup', (req, res) => {
  res.render('signup')
})

app.post('/signup', (req,res) => {
  res.redirect('/signup')
})

const rooms = {'Mainroom': { users: {} }};

app.get('/chat', (req, res) => {
  res.render('chat', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {

    return res.redirect('chat')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (req.params.room == ''){
    res.render('index')
  }
  if (req.params.room == 'form1'){
    res.render('form1')
  }
  if (req.params.room == 'signup'){
    res.render('signup')
  }
  if (req.params.room == 'login'){
    res.render('login')
  }
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  console.log(rooms);
  res.render('room', { roomName: req.params.room })
})

app.post('/', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  console.log("SAVED")
  res.redirect(`/form1`)
})

app.get('/form1',(req,res)=> {
  res.render('form1')
})

app.post('/form1', (req, res) => {
  const newcp = new ContactPerson(req.body);
  newcp.save();
  console.log("SAVED!!!")
})

app.post('/form2', (req, res) => {
  const newdoc = new Doctor(req.body);
  newdoc.save();
  console.log("SAVED!!!")
})

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const user = req.body.lemail;
  const pswd = req.body.lpassword;
  const rol = req.body.role;
  db.collection(rol).find().toArray(function(err, docs) {
    for (let i = 0; i < docs.length; i++){
      if (docs[i].username == user){
          if (docs[i].password == pswd){
            let us = docs[i];
            if (docs[i].role == 'users'){
              res.render('chk',{ us })
            }
            else{
              res.render('chat', {rooms : rooms})
            }
          }
      }
    }
    res.render('login')
  });
});



app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {

    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(3000)

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}