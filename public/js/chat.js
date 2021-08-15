const socket = io()

socket.on('countUpdated', (count) => {
    console.log('The count has been updated', count);
})

const icrementButton = document.querySelector('#increment')

icrementButton.addEventListener('click', () => {
    socket.emit('increment')
})