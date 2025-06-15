// websocketService.ts
class WebSocketService {
    private socket: WebSocket | null = null;
    private subscribers: Set<string> = new Set();
    private messageHandlers: ((data: any) => void)[] = [];
    public token = '';
    private isConnecting: boolean = false;
    private connectionPromise: Promise<void> | null = null;
  
    private async waitForConnection(): Promise<void> {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        if (this.isConnecting) {
            return new Promise((resolve) => {
                const checkConnection = setInterval(() => {
                    if (this.socket?.readyState === WebSocket.OPEN) {
                        clearInterval(checkConnection);
                        resolve();
                    }
                }, 100);
            });
        }

        this.isConnecting = true;
        this.connectionPromise = new Promise((resolve, reject) => {
            if (!this.token) {
                this.isConnecting = false;
                this.connectionPromise = null;
                reject(new Error('No authentication token available'));
                return;
            }

            try {
                this.socket = new WebSocket(import.meta.env.VITE_WEB_SOCKET, this.token);
                
                this.socket.onopen = () => {
                    console.log('WebSocket connected');
                    this.isConnecting = false;
                    this.connectionPromise = null;
                    // Resubscribe to all symbols after reconnection
                    this.subscribers.forEach(symbol => {
                        this.sendSubscribeMessage(symbol);
                    });
                    resolve();
                };

                this.socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    this.messageHandlers.forEach(handler => handler(data));
                };

                this.socket.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.socket = null;
                    this.isConnecting = false;
                    this.connectionPromise = null;
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.isConnecting = false;
                    this.connectionPromise = null;
                    reject(error);
                };
            } catch (error) {
                console.error('Failed to connect:', error);
                this.isConnecting = false;
                this.connectionPromise = null;
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    private sendSubscribeMessage(symbol: string) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: "subscribe",
                type: "ltp",
                variables: [symbol]
            }));
        }
    }

    private sendUnsubscribeMessage(symbol: string) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: "unsubscribe",
                type: "ltp",
                variables: [symbol]
            }));
        }
    }
  
    async subscribe(symbol: string) {
        try {
            await this.waitForConnection();
            if (!this.subscribers.has(symbol)) {
                this.subscribers.add(symbol);
                this.sendSubscribeMessage(symbol);
            }
        } catch (error) {
            console.error('Failed to subscribe:', error);
        }
    }
  
    async unsubscribe(symbol: string) {
        try {
            await this.waitForConnection();
            if (this.subscribers.has(symbol)) {
                this.subscribers.delete(symbol);
                this.sendUnsubscribeMessage(symbol);
            }
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
        }
    }
  
    onMessage(handler: (data: any) => void) {
        this.messageHandlers.push(handler);
    }
  
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.subscribers.clear();
        this.messageHandlers = [];
        this.connectionPromise = null;
        this.isConnecting = false;
    }
}
  
const webSocketService = new WebSocketService();
export default webSocketService;
  