import { Header } from '../../shared/ui/components/Header/Header';
import { useChat, ChatInput, ChatMessageList } from '../../features/chat';

export const ChatPage = () => {
  const { messages, sending, sendMessage, stop, retry } = useChat();

  return (
    <>
      <Header title="Чат с AI" />
      <ChatMessageList messages={messages} onRetry={retry} />
      <ChatInput disabled={sending} onSend={(text) => void sendMessage(text)} onStop={stop} />
    </>
  );
};
