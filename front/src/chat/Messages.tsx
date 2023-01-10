interface IMessage {
    user: string;
    message: string;
}

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
    return [];

function Message(props: IMessage) {
    return (
        <span className="message">
            <span className="user">{props.user}: </span>
            <span className="content">{props.message}</span>
            <br />
        </span>
    );
}
