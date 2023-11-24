const express = require('express')
const path = require('path')

const app = express()
const TOKEN = 3000 || process.env.PORT;
//criando requisição http para socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
//indicando que as paginas irão ficar na pasta public
app.set('views', path.join(__dirname, 'public'))
//definindo engine como ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html')
})


let messages = [];


io.on('connection', socket => {
    console.log(`Socket ${socket.id} conectado`)
    
    //emitindo mensagens no array para o index.html
    socket.emit('previousMessages', messages);
    
    //recebendo objeto emitido pelo index.html
    socket.on('sendMessage', data => {
        messages.push(data);
        //passando historico de mensagens com broadcast
        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(TOKEN, () => {
    console.log('Server Runing...')
})