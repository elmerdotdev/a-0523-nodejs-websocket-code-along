document.addEventListener('DOMContentLoaded', function() {
  const socket = io()
  const form = document.querySelector('#form')
  const input = document.querySelector('#input')
  const messages = document.querySelector('#messages')
  const username = document.querySelector('#username')
  const roomSelect = document.querySelector('#room')
  let currentRoom = ''

  input.disabled = true,
  form.querySelector('button').disabled = true,

  roomSelect.addEventListener('change', function() {
    if (this.value) {
      input.disabled = false
      form.querySelector('button').disabled = false
      joinRoom(this.value)
    } else {
      input.disabled = true,
      form.querySelector('button').disabled = true,
      leaveRoom()
    }
  })

  function joinRoom(newRoom) {
    currentRoom = newRoom
    socket.emit('join room', { room: newRoom, user: username.value })
    messages.innerHTML = ''
  }

  function leaveRoom() {
    if (currentRoom) {
      socket.emit('leave room', currentRoom)
      currentRoom = ''
      messages.innerHTML = ''
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault()
    if (input.value && username.value) {
      socket.emit('chat message', { msg: input.value, user: username.value, room: currentRoom })
      input.value = ''
    }
  })

  // data.msg data.user data.room
  socket.on('chat message', function(data) {
    if (data.room === currentRoom) {
      const item = document.createElement('li')
      item.textContent = `${data.user}: ${data.msg}`
      messages.appendChild(item)
    }
  })  
})