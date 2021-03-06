const socket = io()

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const $messages = document.querySelector('#messages')

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})