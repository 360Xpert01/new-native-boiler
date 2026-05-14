/**
 * ChatScreen — Real-time chat interface.
 * Uses useSocket hook to send/receive messages and chatSlice for storage.
 */

import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Header from '@components/Header/Header';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { useSocket } from '@hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addMessage, selectMessages, Message } from '@store/slices/chatSlice';
import { useTheme } from '@theme/ThemeContext';

const ChatScreen = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const { isConnected, emit, on, off } = useSocket();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // ── Socket Event Listeners ─────────────────────────────────
  useEffect(() => {
    // Listen for replies from the backend
    on('message_from_server', (data: any) => {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: data.text || 'Message from server',
        sender: 'other',
        timestamp: Date.now(),
      };
      dispatch(addMessage(newMsg));
    });

    return () => off('message_from_server');
  }, [on, off, dispatch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // ── Actions ────────────────────────────────────────────────
  const handleSend = () => {
    if (!inputText.trim()) {return;}

    const myMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: Date.now(),
    };

    // 1. Add to Redux UI
    dispatch(addMessage(myMsg));

    // 2. Send via Socket
    emit('message_from_app', { text: inputText.trim() });

    // 3. Clear input
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isMe ? theme.colors.primary : theme.colors.card,
              borderColor: theme.colors.border,
            },
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={[styles.messageText, { color: isMe ? '#FFFFFF' : theme.colors.text }]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, { color: isMe ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryText }]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Real-time Chat" showBack={false} />

      {/* Connection Status Indicator */}
      {!isConnected && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.colors.error }]}>
          <Text style={styles.offlineText}>Offline — Trying to reconnect...</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.secondaryText}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.colors.primary, opacity: isConnected ? 1 : 0.6 }]}
            onPress={handleSend}
            disabled={!isConnected}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  messageWrapper: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
  },
  myBubble: {
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: fonts.size.md,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  offlineBanner: {
    padding: 4,
    alignItems: 'center',
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: fonts.weight.bold,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    borderWidth: 1,
    fontSize: fonts.size.md,
  },
  sendButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: fonts.weight.bold,
  },
});

export default ChatScreen;
