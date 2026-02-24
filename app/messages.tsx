import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
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
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setConversations([
      {
        id: '1',
        participantName: 'IT Company',
        participantRole: 'Роботодавець',
        lastMessage: 'Чудово, чекаємо на вас на співбесіду!',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        unread: 2,
      },
      {
        id: '2',
        participantName: 'John Doe',
        participantRole: 'Кандидат',
        lastMessage: 'Дякую за можливість!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        unread: 0,
      },
    ]);

    setMessages([
      {
        id: '1',
        text: 'Доброго дня! Зацікавила ваша вакансія React Native розробника.',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        senderName: 'Я',
      },
      {
        id: '2',
        text: 'Привіт! Раді це чути. Розкажіть, будь ласка, про ваш досвід.',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        senderName: 'IT Company',
      },
      {
        id: '3',
        text: 'Я маю 3 роки досвіду з React Native та 2 роки з React.',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        senderName: 'Я',
      },
      {
        id: '4',
        text: 'Чудово, чекаємо на вас на співбесіду!',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        senderName: 'IT Company',
      },
    ]);
  }, []);

  if (!user) {
    return (
      <Screen>
        <Card style={styles.authCard}>
          <Text style={styles.authText}>{t('common.authRequired')}</Text>
        </Card>
      </Screen>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'me',
        timestamp: new Date(),
        senderName: 'Я',
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  if (selectedConversation) {
    const conversation = conversations.find((c) => c.id === selectedConversation);

    return (
      <Screen scroll={false}>
        <View style={{ flex: 1 }}>
          <Header title={conversation?.participantName || t('messages.chat')} subtitle={conversation?.participantRole} showBackButton onBackPress={() => setSelectedConversation(null)} />

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
                <Text style={[styles.messageText, item.sender === 'me' ? styles.myMessageText : styles.otherMessageText]}>{item.text}</Text>
                <Text style={[styles.messageTime, item.sender === 'me' ? styles.myMessageTime : styles.otherMessageTime]}>
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
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} onPress={handleSendMessage} disabled={!newMessage.trim()}>
              <Ionicons name="send" size={20} color={newMessage.trim() ? colors.primary : colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header title={t('messages.title')} showBackButton showSettingsButton />

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
              <TouchableOpacity style={styles.conversationItem} onPress={() => setSelectedConversation(item.id)}>
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.participantName}>{item.participantName}</Text>
                    <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                  </View>
                  <Text style={styles.participantRole}>{item.participantRole}</Text>
                  <Text style={styles.lastMessage} numberOfLines={2}>
                    {item.lastMessage}
                  </Text>
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
      <BottomNav />
    </Screen>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    conversationsList: {
      padding: spacing.md,
      paddingBottom: 120,
    },
    conversationItem: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceElevated,
      borderRadius: 24,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      ...colors.shadow.sm,
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
      fontWeight: typography.bold,
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
      lineHeight: 20,
    },
    timestamp: {
      fontSize: typography.xs,
      color: colors.textMuted,
    },
    unreadBadge: {
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      paddingHorizontal: spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      marginLeft: spacing.sm,
      alignSelf: 'flex-start',
    },
    unreadText: {
      fontSize: typography.xs,
      color: '#fff',
      fontWeight: typography.bold,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      marginTop: spacing.md,
      fontSize: typography.base,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    messagesList: {
      padding: spacing.md,
      paddingBottom: spacing.md,
    },
    messageContainer: {
      maxWidth: '84%',
      borderRadius: 18,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
      borderWidth: 1,
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(219,234,254,0.95)',
      borderColor: isDark ? 'rgba(96,165,250,0.4)' : 'rgba(59,130,246,0.2)',
    },
    otherMessage: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
    },
    messageText: {
      fontSize: typography.sm,
      lineHeight: 20,
    },
    myMessageText: {
      color: colors.text,
    },
    otherMessageText: {
      color: colors.text,
    },
    messageTime: {
      fontSize: typography.xs,
      marginTop: spacing.xs,
      textAlign: 'right',
    },
    myMessageTime: {
      color: colors.textSecondary,
    },
    otherMessageTime: {
      color: colors.textMuted,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
    },
    textInput: {
      flex: 1,
      maxHeight: 110,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      backgroundColor: colors.surface,
      color: colors.text,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.sm,
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.6,
    },
    authCard: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    authText: {
      fontSize: typography.base,
      color: colors.textSecondary,
      fontWeight: typography.medium,
      textAlign: 'center',
    },
  });
