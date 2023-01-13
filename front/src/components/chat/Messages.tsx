import { useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL } from '@/config.json';
import IMessage from './IMessage';

export default function Messages() {
    const messages: IMessage[] = getMessages();
    return (
        <div id="messages">
            {messages.map((x: IMessage, i: number) => (
                <Message key={i} user={x.user} message={x.message} />
            ))}
        </div>
    );
}

function getMessages(): IMessage[] {
    const messages = useRef<IMessage[]>([]);
    useWebSocket(WS_URL, {
        share: true,
        onMessage: ({ data }: { data?: string }) => {
            if (!data || !isChatMessage(data)) {
                return;
            }
            const newMessage = parseMessage(data);
            messages.current = [...messages.current, newMessage];
        },
        filter: ({ data }: { data: string }) => {
            return isChatMessage(data);
        },
    });
    return messages.current;
}

function isChatMessage(rawMessage: string): boolean {
    try {
        var message = JSON.parse(rawMessage);
    } catch (error) {
        return false;
    }
    return message?.['event'] == 'chat';
}

function parseMessage(rawMessage: string): IMessage {
    const jsonMessage = JSON.parse(rawMessage);
    return jsonMessage['data'];
}

function Message(props: IMessage) {
    return (
        <span className="message">
            <span className="user">{props.user}: </span>
            <span className="content">{props.message}</span>
            <br />
        </span>
    );
}
