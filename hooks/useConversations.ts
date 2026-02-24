import type { Conversation, ConversationMessage, ConversationsState } from '@/types/message';
import { getStoredJson, setStoredJson } from '@/utils/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CONVERSATIONS_STORAGE_KEY = 'conversationsState';

type ConversationsListener = (state: ConversationsState) => void;

const initialState: ConversationsState = {
  conversations: [
    {
      id: '1',
      participantName: 'IT Company',
      participantRole: 'Роботодавець',
      lastMessage: 'Чудово, чекаємо на вас на співбесіду!',
      timestamp: Date.now() - 1000 * 60 * 5,
      unread: 2,
      pinned: true,
    },
    {
      id: '2',
      participantName: 'John Doe',
      participantRole: 'Кандидат',
      lastMessage: 'Дякую за можливість!',
      timestamp: Date.now() - 1000 * 60 * 60,
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
        timestamp: Date.now() - 1000 * 60 * 30,
        senderName: 'Я',
      },
      {
        id: '2',
        conversationId: '1',
        text: 'Привіт! Раді це чути. Розкажіть, будь ласка, про ваш досвід.',
        sender: 'other',
        timestamp: Date.now() - 1000 * 60 * 25,
        senderName: 'IT Company',
      },
      {
        id: '3',
        conversationId: '1',
        text: 'Я маю 3 роки досвіду з React Native та 2 роки з React.',
        sender: 'me',
        timestamp: Date.now() - 1000 * 60 * 20,
        senderName: 'Я',
      },
      {
        id: '4',
        conversationId: '1',
        text: 'Чудово, чекаємо на вас на співбесіду!',
        sender: 'other',
        timestamp: Date.now() - 1000 * 60 * 5,
        senderName: 'IT Company',
      },
    ],
    '2': [
      {
        id: '5',
        conversationId: '2',
        text: 'Дякую за можливість!',
        sender: 'other',
        timestamp: Date.now() - 1000 * 60 * 60,
        senderName: 'John Doe',
      },
    ],
  },
};

function sortConversations(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1;
    }

    return b.timestamp - a.timestamp;
  });
}

let conversationsStore = getStoredJson<ConversationsState>(CONVERSATIONS_STORAGE_KEY, initialState);
conversationsStore = {
  conversations: sortConversations(conversationsStore.conversations),
  messagesByConversation: conversationsStore.messagesByConversation,
};

const listeners = new Set<ConversationsListener>();

function emitConversations() {
  conversationsStore = {
    conversations: sortConversations(conversationsStore.conversations),
    messagesByConversation: conversationsStore.messagesByConversation,
  };
  setStoredJson(CONVERSATIONS_STORAGE_KEY, conversationsStore);
  listeners.forEach((listener) => listener(conversationsStore));
}

function subscribe(listener: ConversationsListener) {
  listeners.add(listener);
  listener(conversationsStore);
  return () => {
    listeners.delete(listener);
  };
}

export function useConversations() {
  const [state, setState] = useState<ConversationsState>(conversationsStore);

  useEffect(() => subscribe(setState), []);

  const openConversation = useCallback((conversationId: string) => {
    conversationsStore = {
      ...conversationsStore,
      conversations: conversationsStore.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
      ),
    };
    emitConversations();
  }, []);

  const togglePinConversation = useCallback((conversationId: string) => {
    conversationsStore = {
      ...conversationsStore,
      conversations: conversationsStore.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, pinned: !conversation.pinned } : conversation
      ),
    };
    emitConversations();
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

    const existingMessages = conversationsStore.messagesByConversation[conversationId] ?? [];

    conversationsStore = {
      conversations: conversationsStore.conversations.map((conversation) =>
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
        ...conversationsStore.messagesByConversation,
        [conversationId]: [...existingMessages, nextMessage],
      },
    };

    emitConversations();
  }, []);

  const markConversationUnread = useCallback((conversationId: string) => {
    conversationsStore = {
      ...conversationsStore,
      conversations: conversationsStore.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unread: Math.max(1, conversation.unread),
            }
          : conversation
      ),
    };
    emitConversations();
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
    messagesFor,
    openConversation,
    sendMessage,
    togglePinConversation,
    markConversationUnread,
    unreadCount,
  };
}
