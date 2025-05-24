import { useAuth } from "../store/authContext";

// websocketService.ts
class WebSocketService {
    private socket: WebSocket | null = null;
    private subscribers: Set<string> = new Set();
    private messageHandlers: ((data: any) => void)[] = [];
  
    async connect() {
      const {user} = useAuth()
      if(!user){
        throw new Error('No user available');
      }
      const jwtToken: any = await user?.getIdToken();
      if (!jwtToken) {
        throw new Error('No authentication token available');
      }
      if (!this.socket) {
        this.socket = new WebSocket("wss://node-mongoose-server.onrender.com",jwtToken);
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        };
      }
    }
  
    subscribe(symbol: string) {

      console.log("out",this.socket)
      if(this.socket?.CLOSED){
        console.log("in",this.socket)
        this.connect();
      }
      if (!this.subscribers.has(symbol)) {
        this.subscribers.add(symbol);
        this.socket?.send(JSON.stringify({ type: 'subscribe', symbol }));
      }
    }
  
    unsubscribe(symbol: string) {
      if (this.subscribers.has(symbol)) {
        this.subscribers.delete(symbol);
        this.socket?.send(JSON.stringify({ type: 'unsubscribe', symbol }));
      }
    }
  
    onMessage(handler: (data: any) => void) {
      this.messageHandlers.push(handler);
    }
  
    disconnect() {
      this.socket?.close();
      this.socket = null;
      this.subscribers.clear();
      this.messageHandlers = [];
    }
  }
  
  const webSocketService = new WebSocketService();
  export default webSocketService;
  