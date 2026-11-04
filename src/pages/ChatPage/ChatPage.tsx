import { useChat, ChatInput, ChatMessageList } from '../../features/chat';

export const ChatPage = () => {
  const chat = useChat();

  return (
    <>
      <ChatMessageList />
      <ChatInput />
    </>
  );
};
