import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

class ClientSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  /**
   * Initialise ou réutilise la connexion WebSocket avec le jeton d'accès actuel
   */
  connect(accessToken?: string | null): Socket {
    if (this.socket && this.isConnected) {
      if (accessToken) {
        this.socket.auth = { token: accessToken };
      }
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: accessToken || undefined,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', () => {
      this.isConnected = false;
    });

    return this.socket;
  }

  /**
   * Écoute un événement WebSocket typé
   */
  on<T>(event: string, callback: (data: T) => void): () => void {
    if (!this.socket) {
      this.connect();
    }

    this.socket?.on(event, callback);

    return () => {
      this.socket?.off(event, callback);
    };
  }

  /**
   * Émet un événement vers le serveur
   */
  emit(event: string, payload?: unknown): void {
    if (!this.socket || !this.isConnected) {
      this.connect();
    }
    this.socket?.emit(event, payload);
  }

  /**
   * Ferme proprement la connexion WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const clientSocketService = new ClientSocketService();
