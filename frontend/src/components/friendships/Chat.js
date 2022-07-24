import {useState} from "react";
import {useCookies} from "react-cookie";
import BasicScrollToBottom from "react-scroll-to-bottom";

const Chat = ( { id, chat_id, socket }) => {

    const [allMessages, setAllMessages] = useState([])
    const [message, setMessage] = useState('')
    const [cookies] = useCookies()

    if (socket) {
        socket.on('receive_old_messages', (data) => {
            setAllMessages(data)
        })

        socket.on('receive_message', (data) => {
            setAllMessages([...allMessages, data])
        })
    }

    const handleSend = () => {
        if (message !== '') {
            const date = new Date()
            const data = {
                id: chat_id,
                message: message,
                sender_id: cookies['profile_id'],
                date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            }

            socket.emit('send_message', {data, receiver_id: id})
            setAllMessages([...allMessages, data])
            setMessage('')
        }
    }

    return (
        <div className={"chat_room_container"}>
            <div className={"chat_header"}>
                <h2>{id} chat</h2>
            </div>
            <BasicScrollToBottom>
                <div>
                    {(allMessages) ? allMessages.map((x, i) => {
                        return (
                            <div className={"main_messages"} key={i} id={(x.sender_id === cookies['profile_id']) ? 'sender' : 'receiver'}>
                                <p>{new Date(x.date).toLocaleString()}</p>
                                <div className={"message_data"}>
                                    <div>{x.message}</div>
                                    <img alt={'profile_picture'} src={require('../../assets/fb_profile_picture.png')} />
                                </div>
                            </div>
                        )
                    }) : null}
                </div>
            </BasicScrollToBottom>
            <div className={"chat_footer"}>
                <input type={"text"} placeholder={"Send message.."} value={message} onChange={(event) => setMessage(event.target.value)}/>
                <button className={"send"} onClick={() => handleSend()}>Send</button>
            </div>
        </div>
    )
}

export default Chat