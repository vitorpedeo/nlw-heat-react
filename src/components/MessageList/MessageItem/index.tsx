import { motion, MotionStyle, usePresence } from 'framer-motion';

import styles from './styles.module.scss';

type MessageProps = {
  message: {
    id: string;
    text: string;
    user: {
      avatar_url: string;
      name: string;
    };
  };
};

export function MessageItem({ message }: MessageProps) {
  const [isPresent, safeToRemove] = usePresence();

  const style: MotionStyle = {
    position: isPresent ? 'static' : 'absolute',
  };

  const animations = {
    layout: true,
    initial: 'out',
    style,
    animate: isPresent ? 'in' : 'out',
    variants: {
      in: { scaleY: 1, opacity: 1 },
      out: { scaleY: 0, opacity: 0, zIndex: -1 },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
    },
    onAnimationComplete: () => !isPresent && safeToRemove && safeToRemove(),
    transition: { type: 'spring', stiffness: 500, damping: 50, mass: 1 },
  };

  return (
    <motion.li {...animations} className={styles.messageWrapper}>
      <p className={styles.messageContent}>{message.text}</p>
      <div className={styles.messageUser}>
        <div className={styles.userImage}>
          <img src={message.user.avatar_url} alt={message.user.name} />
        </div>
        <span>{message.user.name}</span>
      </div>
    </motion.li>
  );
}
