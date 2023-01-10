import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import IMessage from './IMessage';
import { ws_url as WS_URL } from '../config.json';

export default function UserInput() {
    const [userInput, setUserInput] = useState('');
    const { sendMessage } = useWebSocket(WS_URL, {
        share: true,
    });
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)}
            />
            <input type="submit" value="Envoyer" />
        </form>
    );
    function onSubmit(e: any) {
        e.preventDefault();
        const message: IMessage = { user: 'Alice', message: userInput };
        const jsonMessage = { event: 'chat', data: message };
        sendMessage(JSON.stringify(jsonMessage));
        setUserInput('');
    }
}
