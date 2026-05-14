import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../src/components/Button/Button';
import { ThemeProvider } from '../src/theme/ThemeContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />, { wrapper: AllTheProviders });
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />, { wrapper: AllTheProviders });
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows activity indicator when loading', () => {
    const { getByTestId, queryByText } = render(<Button title="Loading" loading={true} />, { wrapper: AllTheProviders });
    
    // ActivityIndicator doesn't have a default testID, so we check if title is NOT there
    expect(queryByText('Loading')).toBeNull();
  });

  it('is disabled when loading is true', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<Button title="Disabled" loading={true} onPress={onPressMock} />, { wrapper: AllTheProviders });
    
    // In React Native, TouchableOpacity doesn't always show up as a button role in tests unless specified
    // But we can check the 'disabled' prop
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
