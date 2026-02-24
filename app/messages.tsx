import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type ConversationTab = 'all' | 'unread' | 'pinned';

const QUICK_REPLIES = ['Дякую, перегляну.', 'Можемо обговорити деталі?', 'Чи є можливість remote?'];

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const { conversations, messagesFor, openConversation, sendMessage, togglePinConversation, markConversationUnread, unreadCount } =
    useConversations();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<ConversationTab>('all');

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  const messages = useMemo(
    () => (selectedConversationId ? messagesFor(selectedConversationId) : []),
    [messagesFor, selectedConversationId]
  );

  const filteredConversations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      if (tab === 'unread' && conversation.unread === 0) {
        return false;
      }

      if (tab === 'pinned' && !conversation.pinned) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        conversation.participantName.toLowerCase().includes(normalizedQuery) ||
        conversation.lastMessage.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [conversations, searchQuery, tab]);

  if (!user) {
    return (
      <Screen>
        <Card style={styles.authCard}>
          <Text style={styles.authText}>{t('common.authRequired')}</Text>
        </Card>
      </Screen>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  const handleOpenConversation = (conversationId: string) => {
    openConversation(conversationId);
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = () => {
    if (!selectedConversationId || !draft.trim()) {
      return;
    }

    sendMessage(selectedConversationId, draft);
    setDraft('');
  };

  if (selectedConversationId && selectedConversation) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1 }}>
          <Header
            title={selectedConversation.participantName}
            subtitle={selectedConversation.participantRole}
            showBackButton
            onBackPress={() => setSelectedConversationId(null)}
          />

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

          <View style={styles.quickRepliesRow}>
            {QUICK_REPLIES.map((reply) => (
              <TouchableOpacity key={reply} style={styles.quickReplyChip} onPress={() => setDraft(reply)}>
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={draft}
              onChangeText={setDraft}
              placeholder={t('messages.typeMessage')}
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]} onPress={handleSendMessage} disabled={!draft.trim()}>
              <Text style={[styles.sendButtonText, !draft.trim() && styles.sendButtonTextDisabled]}>{t('messages.sendMessage')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header title={t('messages.title')} subtitle={`${unreadCount} ${t('messages.unread')}`} showBackButton showSettingsButton />

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('messages.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tabButton, tab === 'all' && styles.tabButtonActive]} onPress={() => setTab('all')}>
            <Text style={[styles.tabButtonText, tab === 'all' && styles.tabButtonTextActive]}>{t('messages.tabAll')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, tab === 'unread' && styles.tabButtonActive]} onPress={() => setTab('unread')}>
            <Text style={[styles.tabButtonText, tab === 'unread' && styles.tabButtonTextActive]}>{t('messages.tabUnread')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, tab === 'pinned' && styles.tabButtonActive]} onPress={() => setTab('pinned')}>
            <Text style={[styles.tabButtonText, tab === 'pinned' && styles.tabButtonTextActive]}>{t('messages.tabPinned')}</Text>
          </TouchableOpacity>
        </View>

        {filteredConversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('messages.noMessages')}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.conversationItem} onPress={() => handleOpenConversation(item.id)}>
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.participantName}>{item.participantName}</Text>
                    <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                  </View>
                  <Text style={styles.participantRole}>{item.participantRole}</Text>
                  <Text style={styles.lastMessage} numberOfLines={2}>
                    {item.lastMessage}
                  </Text>

                  <View style={styles.conversationActionsRow}>
                    <TouchableOpacity style={styles.actionChip} onPress={() => togglePinConversation(item.id)}>
                      <Text style={styles.actionChipText}>{item.pinned ? t('messages.unpin') : t('messages.pin')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionChip} onPress={() => markConversationUnread(item.id)}>
                      <Text style={styles.actionChipText}>{t('messages.markUnread')}</Text>
                    </TouchableOpacity>
                  </View>
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
      minHeight: 42,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
    },
    sendButtonDisabled: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    sendButtonText: {
      fontSize: typography.sm,
      fontWeight: typography.semibold,
      color: '#fff',
    },
    sendButtonTextDisabled: {
      color: colors.textMuted,
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
    searchContainer: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      backgroundColor: colors.surface,
      color: colors.text,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.sm,
    },
    tabsRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    tabButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      backgroundColor: colors.surface,
    },
    tabButtonActive: {
      backgroundColor: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.1)',
      borderColor: colors.primary,
    },
    tabButtonText: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      fontWeight: typography.medium,
    },
    tabButtonTextActive: {
      color: colors.primary,
      fontWeight: typography.semibold,
    },
    conversationActionsRow: {
      flexDirection: 'row',
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    actionChip: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.surface,
    },
    actionChipText: {
      fontSize: typography.xs,
      color: colors.textSecondary,
      fontWeight: typography.medium,
    },
    quickRepliesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    quickReplyChip: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.surface,
    },
    quickReplyText: {
      fontSize: typography.xs,
      color: colors.textSecondary,
    },
  });
