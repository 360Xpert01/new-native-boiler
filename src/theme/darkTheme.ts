import { Platform } from 'react-native';

import { colors } from '../constants/colors';
import { fonts as fontConstants } from '../constants/fonts';

import { Theme } from './lightTheme';

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.black,
    card: colors.gray[900],
    text: colors.white,
    border: colors.gray[800],
    notification: colors.error,
    primaryText: colors.white,
    secondaryText: colors.gray[400],
    placeholder: colors.gray[600],
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    surface: colors.gray[900],
  },
  fonts: Platform.select({
    ios: {
      regular: {
        fontFamily: fontConstants.family.regular,
        fontWeight: fontConstants.weight.regular as any,
      },
      medium: {
        fontFamily: fontConstants.family.medium,
        fontWeight: fontConstants.weight.medium as any,
      },
      bold: {
        fontFamily: fontConstants.family.bold,
        fontWeight: fontConstants.weight.bold as any,
      },
      heavy: {
        fontFamily: fontConstants.family.bold,
        fontWeight: fontConstants.weight.extraBold as any,
      },
    },
    default: {
      regular: {
        fontFamily: fontConstants.family.regular,
        fontWeight: fontConstants.weight.regular as any,
      },
      medium: {
        fontFamily: fontConstants.family.medium,
        fontWeight: fontConstants.weight.medium as any,
      },
      bold: {
        fontFamily: fontConstants.family.bold,
        fontWeight: fontConstants.weight.bold as any,
      },
      heavy: {
        fontFamily: fontConstants.family.bold,
        fontWeight: fontConstants.weight.extraBold as any,
      },
    },
  }),
};
