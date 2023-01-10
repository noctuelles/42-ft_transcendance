import { useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL } from '../config.json';
import IMessage from './IMessage';

export default function Messages() {
    let messages: IMessage[] = getMessages();
    return (
        <p id="messages">
            {messages.map((x: IMessage, i: number) => (
                <Message key={i} user={x.user} message={x.message} />
            ))}
        </p>
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
            let newMessages = parseMessages(data);
            messages.current = [...messages.current, ...newMessages];
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

function parseMessages(rawMessage: string): IMessage[] {
    let jsonMessage = JSON.parse(rawMessage);
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
