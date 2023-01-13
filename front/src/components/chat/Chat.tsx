import '@/style/chat/Chat.css';
import Messages from './Messages';
import UserInput from './UserInput';

export default function Chat() {
    return (
        <div className="chat">
            <Messages />
            <UserInput />
        </div>
    );
}
