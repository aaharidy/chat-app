const socket = io()

socket.on('message', (message) => {
    console.log(message);
})

const form = document.querySelector('#chat'),
    locationButton = document.querySelector('#sent-location')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message)
})

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Sorry geolocation not suppored from you browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        socket.emit('sendLocation', {
            latitude,
            longitude
        })
    })
})