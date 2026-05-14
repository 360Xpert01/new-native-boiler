/**
 * SocketService — Singleton wrapper around socket.io-client.
 *
 * Usage:
 *   import { socketService } from '@services/socket/socketService';
 *   socketService.connect('your-jwt-token');
 *   socketService.on('chat:message', (data) => console.log(data));
 *   socketService.emit('chat:send', { text: 'Hello!' });
 *   socketService.disconnect();
 */

import { SOCKET_URL } from '@env';
import { io, Socket } from 'socket.io-client';

type EventCallback = (...args: any[]) => void;

class SocketService {
  private socket: Socket | null = null;

  /**
   * Connect to the Socket.io server.
   * @param token  Optional JWT token — sent as an `auth` header so the
   *               server can authenticate the connection.
   */
  connect(token?: string | null): void {
    // Prevent duplicate connections
    if (this.socket?.connected) {
      console.log('[SocketService] Already connected');
      return;
    }

    console.log('[SocketService] 🌐 Connecting to:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      // ── Auth ──────────────────────────────────────────────
      auth: token ? { token } : undefined,

      // ── Reconnection ─────────────────────────────────────
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 30000,

      // ── Transport ─────────────────────────────────────────
      transports: ['websocket', 'polling'],
      forceNew: true, // Create a fresh connection
    });

    // ── Built-in lifecycle events ───────────────────────────
    this.socket.on('connect', () => {
      console.log('[SocketService] ✅ Connected — id:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] ❌ Disconnected —', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[SocketService] ⚠️  Connection error:', error.message);
    });
  }

  /**
   * Disconnect from the server and clean up all listeners.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      console.log('[SocketService] 🔌 Disconnected & cleaned up');
    }
  }

  /**
   * Send an event to the server.
   * @param event  Event name (e.g. 'chat:send')
   * @param data   Payload
   */
  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Cannot emit — not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Listen for an event from the server.
   * @param event     Event name (e.g. 'chat:message')
   * @param callback  Handler function
   */
  on(event: string, callback: EventCallback): void {
    if (!this.socket) {
      console.warn('[SocketService] Cannot listen — socket not initialised');
      return;
    }
    this.socket.on(event, callback);
  }

  /**
   * Remove a specific listener for an event.
   */
  off(event: string, callback?: EventCallback): void {
    if (!this.socket) {return;}
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  /** Returns true if the socket is currently connected. */
  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /** Returns the current socket ID, or null. */
  get socketId(): string | null {
    return this.socket?.id ?? null;
  }
}

// Export a singleton so the whole app shares one connection
export const socketService = new SocketService();
