const socket = io()

socket.on('message', (message) => {
    console.log(message);
})

const form = document.querySelector('#chat'),
    locationButton = document.querySelector('#sent-location')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message,
        button = e.target.querySelector('button')
    // Disable
    button.setAttribute('disabled', 'disabled')

    socket.emit('sendMessage', message.value, (error) => {
        // Enable
        button.removeAttribute('disabled', 'disabled')
        message.value = ''
        message.focus()
        if (error) {
            return console.log(error);
        }

        console.log('Message Deliverd!');
    })
})

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Sorry geolocation not suppored from you browser')
    }

    // Disable
    locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        socket.emit('sendLocation', {
            latitude,
            longitude
        }, () => {
            // Enable
            locationButton.removeAttribute('disabled', 'disabled')
            console.log('Location shared!')
        })
    })
})