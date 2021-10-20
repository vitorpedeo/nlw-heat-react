import { FormEvent, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';

import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

import styles from './styles.module.scss';

export function SendMessageForm() {
  const [message, setMessage] = useState('');

  const { user, signOut } = useAuth();

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      await api.post('messages', { message });

      setMessage('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button type="button" onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          value={message}
          onChange={event => setMessage(event.target.value)}
        />
        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  );
}
