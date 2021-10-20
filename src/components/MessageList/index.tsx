import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';

import { MessageItem } from './MessageItem';

import logoImg from '../../assets/logo.svg';
import styles from './styles.module.scss';

type Message = {
  id: string;
  text: string;
  user: {
    avatar_url: string;
    name: string;
  };
};

const messagesQueue: Message[] = [];

const socket = io('http://localhost:5000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState =>
          [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean),
        );

        messagesQueue.shift();
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    api
      .get<Message[]>('messages/last3')
      .then(response => setMessages(response.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile2021" />

      <ul className={styles.messageList}>
        <AnimatePresence>
          {messages.map(message => (
            <MessageItem key={message.id} message={message} />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
