const Chat = ( { id, socket }) => {

    if (socket) {
        socket.on('receive_old_messages', (data) => {
            console.log(data)
        })
    }

    return (
        <div>
            Chat {id}
        </div>
    )
}

export default Chat