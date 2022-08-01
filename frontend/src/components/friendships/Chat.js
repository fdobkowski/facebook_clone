import '../../styles/Chat.scss'
import {useState} from "react";
import {useCookies} from "react-cookie";
import ScrollToBottom from "react-scroll-to-bottom";
import {useSelector} from "react-redux";

const Chat = ( { id, chat_id, socket, disableChat, container }) => {

    const [allMessages, setAllMessages] = useState([])
    const [message, setMessage] = useState('')
    const [cookies] = useCookies()
    const receiver = useSelector((state) => state.profiles.profiles.find(x => x.id === id))

    if (socket) {
        socket.on('receive_old_messages', (data) => {
            if (data.chat_id === chat_id) setAllMessages(data.data)
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

    // Check if both dates are up to 2 hours apart

    const checkDateDiff = (date1, date2) => {
        const diff = Math.abs(date1.getTime() - date2.getTime()) / 3600000
        return diff < 2
    }

    return (
        <div className={"chat_room_container"} id={`container_${container}`}>
            {(receiver) ?
            <div className={"chat_header"}>
                <div><img alt={'profile_picture'} src={receiver.image} /></div>
                <span>{receiver.first_name} {receiver.last_name}</span>
                <img className={'close_button'}
                     alt={'close'} src={require('../../assets/close.png')}
                     onClick={() => disableChat(id)}/>
            </div> : null}
            <ScrollToBottom className={"message_body"} initialScrollBehavior={'smooth'}>
                <div>
                    {(allMessages) ? allMessages.map((x, i) => {
                        return (
                            <div className={"main_messages"} key={i}>
                                {(i !== 0 && allMessages[i].sender_id === allMessages[i - 1].sender_id
                                    && checkDateDiff(new Date(allMessages[i].date), new Date(allMessages[i - 1].date))) ? null :
                                <p>{new Date(x.date).toLocaleString()}</p>}
                                <div className={"message_data"} id={(x.sender_id === cookies['profile_id']) ? 'sender' : 'receiver'}>
                                    <div>{x.message}</div>
                                    {(x.sender_id !== cookies['profile_id']) ?
                                    <img alt={'profile_picture'} src={receiver.image} />
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