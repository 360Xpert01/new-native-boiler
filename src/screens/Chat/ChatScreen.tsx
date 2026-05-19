import React, { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Header from '@components/Header/Header';
import { useSocket } from '@hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addMessage, selectMessages, Message } from '@store/slices/chatSlice';
import { useTheme } from '@theme/ThemeContext';

const ChatScreen = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const { isConnected, emit, on, off } = useSocket();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    on('message_from_server', (data: { text?: string }) => {
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

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) {
      return;
    }

    const myMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: Date.now(),
    };

    dispatch(addMessage(myMsg));
    emit('message_from_app', { text: inputText.trim() });
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    const alignment = isMe ? 'self-end' : 'self-start';
    const bubbleRadius = isMe ? 'rounded-ee-none' : 'rounded-es-none';

    return (
      <View className={`mb-md max-w-[80%] ${alignment}`}>
        <View
          className={`p-md rounded-2xl border ${
            isMe
              ? 'bg-primary border-primary'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          } ${bubbleRadius}`}
        >
          <Text
            className={`text-md text-start ${isMe ? 'text-white' : 'text-black dark:text-white'}`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-[10px] mt-1 self-end ${
              isMe ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Header title={t('common.chat')} showBack={false} />

      {!isConnected && (
        <View className="p-1 items-center bg-error">
          <Text className="text-white text-xs font-bold text-center">
            {t('common.offlineReconnecting')}
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerClassName="p-md pb-xl"
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="flex-row p-md items-center border-t bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
          <TextInput
            className="flex-1 rounded-full px-md py-sm max-h-[100px] border text-md text-black dark:text-white bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-start"
            placeholder={t('common.typeMessage')}
            placeholderTextColor={isDark ? '#8E8E93' : '#AEAEB2'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            className={`ms-sm px-md py-sm rounded-full justify-center items-center bg-primary ${
              !isConnected ? 'opacity-60' : ''
            }`}
            onPress={handleSend}
            disabled={!isConnected}
          >
            <Text className="text-white font-bold">{t('common.send')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
