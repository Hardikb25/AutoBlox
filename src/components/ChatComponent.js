// components/ChatComponent.js
import React,{useEffect,useState} from 'react';
import  * as  signalR from '@microsoft/signalr'

const ChatComponent = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7277/chathub')
      .build();
    debugger
    setConnection(newConnection);

    newConnection.start()
      .then(() => console.log('Connection established'))
      .catch(err => console.error('Error establishing connection:', err));

    newConnection.on('ReceiveMessage', (user, message) => {
      setMessages([...messages, { user, message }]);
    });

    return () => {
      newConnection.stop();
    };
  }, [messages]);

  const sendMessage = async () => {
    if (connection && user && message) {
      await connection.send('SendMessage', user, message);
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        <label>User: </label>
        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
      </div>
      <div>
        <label>Message: </label>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}><strong>{msg.user}:</strong> {msg.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatComponent;
