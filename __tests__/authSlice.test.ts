import authReducer, { setCredentials, logout, setLoading } from '../src/store/slices/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setCredentials', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test User' };
    const token = 'fake-token';
    const actual = authReducer(initialState, setCredentials({ user, token }));
    expect(actual.user).toEqual(user);
    expect(actual.token).toBe(token);
    expect(actual.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const state = {
      user: { id: '1', email: 'test@test.com' },
      token: 'fake-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    const actual = authReducer(state, logout());
    expect(actual.user).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it('should handle setLoading', () => {
    const actual = authReducer(initialState, setLoading(true));
    expect(actual.isLoading).toBe(true);
  });
});
