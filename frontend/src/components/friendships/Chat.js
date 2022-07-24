import '../../styles/Chat.scss'
import {useState} from "react";
import {useCookies} from "react-cookie";
import ScrollToBottom from "react-scroll-to-bottom";
import {useSelector} from "react-redux";

const Chat = ( { id, chat_id, socket }) => {

    const [allMessages, setAllMessages] = useState([])
    const [message, setMessage] = useState('')
    const [cookies] = useCookies()
    const receiver = useSelector((state) => state.profiles.profiles.find(x => x.id === id))

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
            {(receiver) ?
            <div className={"chat_header"}>
                <img alt={'profile_picture'} src={require('../../assets/fb_profile_picture.png')} />
                <span>{receiver.first_name} {receiver.last_name}</span>
            </div> : null}
            <ScrollToBottom className={"message_body"} initialScrollBehavior={'smooth'}>
                <div>
                    {(allMessages) ? allMessages.map((x, i) => {
                        return (
                            <div className={"main_messages"} key={i}>
                                <p>{new Date(x.date).toLocaleString()}</p>
                                <div className={"message_data"} id={(x.sender_id === cookies['profile_id']) ? 'sender' : 'receiver'}>
                                    <div>{x.message}</div>
                                    {(x.sender_id !== cookies['profile_id']) ?
                                    <img alt={'profile_picture'} src={require('../../assets/fb_profile_picture.png')} />
                                    : null}
                                </div>
                            </div>
                        )
                    }) : null}
                </div>
            </ScrollToBottom>
            <div className={"chat_footer"}>
                <input type={"text"} placeholder={"Send message.."}
                       value={message}
                       onChange={(event) => setMessage(event.target.value)}
                       onKeyDown={(e) => (e.code === 'Enter') ? handleSend() : null}/>
                <img alt={'send'} src={require('../../assets/send-message.png')}
                     className={"send"} onClick={() => handleSend()}/>
            </div>
        </div>
    )
}

export default Chat