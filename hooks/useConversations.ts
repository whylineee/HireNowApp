import type { Conversation, ConversationMessage, ConversationsState } from '@/types/message';
import { createPersistentStore } from '@/utils/persistentStore';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CONVERSATIONS_STORAGE_KEY = 'conversationsState';

function createInitialConversationsState(): ConversationsState {
  const now = Date.now();

  return {
    conversations: [
      {
        id: '1',
        participantName: 'IT Company',
        participantRole: 'Роботодавець',
        lastMessage: 'Чудово, чекаємо на вас на співбесіду!',
        timestamp: now - 1000 * 60 * 5,
        unread: 2,
        pinned: true,
      },
      {
        id: '2',
        participantName: 'John Doe',
        participantRole: 'Кандидат',
        lastMessage: 'Дякую за можливість!',
        timestamp: now - 1000 * 60 * 60,
        unread: 0,
        pinned: false,
      },
    ],
    messagesByConversation: {
      '1': [
        {
          id: '1',
          conversationId: '1',
          text: 'Доброго дня! Зацікавила ваша вакансія React Native розробника.',
          sender: 'me',
          timestamp: now - 1000 * 60 * 30,
          senderName: 'Я',
        },
        {
          id: '2',
          conversationId: '1',
          text: 'Привіт! Раді це чути. Розкажіть, будь ласка, про ваш досвід.',
          sender: 'other',
          timestamp: now - 1000 * 60 * 25,
          senderName: 'IT Company',
        },
        {
          id: '3',
          conversationId: '1',
          text: 'Я маю 3 роки досвіду з React Native та 2 роки з React.',
          sender: 'me',
          timestamp: now - 1000 * 60 * 20,
          senderName: 'Я',
        },
        {
          id: '4',
          conversationId: '1',
          text: 'Чудово, чекаємо на вас на співбесіду!',
          sender: 'other',
          timestamp: now - 1000 * 60 * 5,
          senderName: 'IT Company',
        },
      ],
      '2': [
        {
          id: '5',
          conversationId: '2',
          text: 'Дякую за можливість!',
          sender: 'other',
          timestamp: now - 1000 * 60 * 60,
          senderName: 'John Doe',
        },
      ],
    },
  };
}

function sortConversations(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1;
    }

    return b.timestamp - a.timestamp;
  });
}

const conversationsStore = createPersistentStore<ConversationsState>({
  key: CONVERSATIONS_STORAGE_KEY,
  initialState: createInitialConversationsState(),
  mergeHydratedState: (_, persisted) => ({
    conversations: sortConversations(persisted.conversations),
    messagesByConversation: persisted.messagesByConversation,
  }),
});

export function resetConversationsStore() {
  return conversationsStore.setState(createInitialConversationsState());
}

export function useConversations() {
  const [state, setState] = useState<ConversationsState>(conversationsStore.getSnapshot());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = conversationsStore.subscribe((nextState) => {
      setState({
        conversations: sortConversations(nextState.conversations),
        messagesByConversation: nextState.messagesByConversation,
      });
    });

    let active = true;
    void conversationsStore.hydrate().finally(() => {
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const openConversation = useCallback((conversationId: string) => {
    void conversationsStore.updateState((prevState) => ({
      ...prevState,
      conversations: prevState.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
      ),
    }));
  }, []);

  const togglePinConversation = useCallback((conversationId: string) => {
    void conversationsStore.updateState((prevState) => ({
      ...prevState,
      conversations: prevState.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, pinned: !conversation.pinned } : conversation
      ),
    }));
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextMessage: ConversationMessage = {
      id: String(Date.now()),
      conversationId,
      text: trimmed,
      sender: 'me',
      timestamp: Date.now(),
      senderName: 'Я',
    };

    void conversationsStore.updateState((prevState) => {
      const existingMessages = prevState.messagesByConversation[conversationId] ?? [];

      return {
        conversations: prevState.conversations.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessage: trimmed,
                timestamp: nextMessage.timestamp,
                unread: 0,
              }
            : conversation
        ),
        messagesByConversation: {
          ...prevState.messagesByConversation,
          [conversationId]: [...existingMessages, nextMessage],
        },
      };
    });
  }, []);

  const markConversationUnread = useCallback((conversationId: string) => {
    void conversationsStore.updateState((prevState) => ({
      ...prevState,
      conversations: prevState.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unread: Math.max(1, conversation.unread),
            }
          : conversation
      ),
    }));
  }, []);

  const messagesFor = useCallback(
    (conversationId: string) => state.messagesByConversation[conversationId] ?? [],
    [state.messagesByConversation]
  );

  const unreadCount = useMemo(
    () => state.conversations.reduce((total, conversation) => total + conversation.unread, 0),
    [state.conversations]
  );

  return {
    conversations: state.conversations,
    loading,
    messagesFor,
    openConversation,
    sendMessage,
    togglePinConversation,
    markConversationUnread,
    unreadCount,
  };
}
