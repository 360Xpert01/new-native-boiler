import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '@components/Button/Button';
import Header from '@components/Header/Header';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { useTheme } from '@theme/ThemeContext';


const ProfileScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => dispatch(logout()), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Profile" />
      <View style={styles.content}>
        <View style={[styles.profileHeader, { borderBottomColor: theme.colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.secondaryText }]}>
              {user?.email || 'email@example.com'}
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="account-edit" size={24} color={theme.colors.primary} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color={theme.colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="cog" size={24} color={theme.colors.primary} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Settings</Text>
            <Icon name="chevron-right" size={24} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        </View>

        <Button
          title="Logout"
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    marginLeft: spacing.lg,
  },
  userName: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
  },
  userEmail: {
    fontSize: fonts.size.md,
    marginTop: spacing.xs,
  },
  menuContainer: {
    marginBottom: spacing.xxl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fonts.size.md,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});

export default ProfileScreen;
