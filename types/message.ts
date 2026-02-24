export interface ConversationMessage {
  id: string;
  conversationId: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: number;
  senderName: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  timestamp: number;
  unread: number;
  pinned?: boolean;
}

export interface ConversationsState {
  conversations: Conversation[];
  messagesByConversation: Record<string, ConversationMessage[]>;
}
