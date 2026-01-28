import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  senderName: string;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  if (!user) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: colors.text, marginBottom: 16 }}>Будь ласка, зареєструйтесь для доступу</Text>
        </View>
      </Screen>
    );
  }

  setConversations([
    {
      id: '1',
      participantName: 'IT Company',
      participantRole: 'Роботодавець',
      lastMessage: 'Чудово, чекаємо на вас на співбесіду!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      unread: 2
    },
    {
      id: '2',
      participantName: 'John Doe',
      participantRole: 'Кандидат',
      lastMessage: 'Дякую за можливість!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      unread: 0
    }
  ]);

  setMessages([
    {
      id: '1',
      text: 'Доброго дня! Зацікавила ваша вакансія React Native розробника.',
      sender: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      senderName: 'Я'
    },
    {
      id: '2',
      text: 'Привіт! Раді це чути. Розкажіть, будь ласка, про ваш досвід.',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      senderName: 'IT Company'
    },
    {
      id: '3',
      text: 'Я маю 3 роки досвіду з React Native та 2 роки з React.',
      sender: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      senderName: 'Я'
    },
    {
      id: '4',
      text: 'Чудово, чекаємо на вас на співбесіду!',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      senderName: 'IT Company'
    }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'me',
        timestamp: new Date(),
        senderName: 'Я'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  if (selectedConversation) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1 }}>
          <Header
            title={conversation?.participantName || 'Чат'}
            subtitle={conversation?.participantRole}
            showBackButton
            onBackPress={() => setSelectedConversation(null)}
          />
          
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[
                styles.messageContainer,
                item.sender === 'me' ? styles.myMessage : styles.otherMessage
              ]}>
                <Text style={[
                  styles.messageText,
                  item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
                ]}>
                  {item.text}
                </Text>
                <Text style={[
                  styles.messageTime,
                  item.sender === 'me' ? styles.myMessageTime : styles.otherMessageTime
                ]}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.messagesList}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder={t('messages.typeMessage')}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={newMessage.trim() ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header title={t('messages.title')} showSettingsButton />
        
        {conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>{t('messages.noMessages')}</Text>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => setSelectedConversation(item.id)}
              >
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.participantName}>{item.participantName}</Text>
                    <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                  </View>
                  <Text style={styles.participantRole}>{item.participantRole}</Text>
                  <Text style={styles.lastMessage} numberOfLines={2}>{item.lastMessage}</Text>
                </View>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.conversationsList}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  conversationsList: {
    padding: spacing.md,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  participantName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.text,
  },
  participantRole: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  timestamp: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadText: {
    color: '#fff',
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },
  messagesList: {
    padding: spacing.md,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: spacing.md,
    borderRadius: 16,
    padding: spacing.md,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  messageText: {
    fontSize: typography.base,
    marginBottom: spacing.xs,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: typography.xs,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    maxHeight: 100,
    fontSize: typography.base,
    color: colors.text,
    backgroundColor: colors.background,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
