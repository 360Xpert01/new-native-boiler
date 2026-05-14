import { Platform } from 'react-native';

import { colors } from '../constants/colors';
import { fonts as fontConstants } from '../constants/fonts';

export const lightTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.white,
    card: colors.white,
    text: colors.black,
    border: colors.gray[200],
    notification: colors.error,
    primaryText: colors.white,
    secondaryText: colors.gray[600],
    placeholder: colors.gray[400],
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    surface: colors.gray[100],
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

export type Theme = typeof lightTheme;
