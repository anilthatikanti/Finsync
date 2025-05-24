import webSocketService from "../services/websocketService";
import type { ITickerData } from "../shared/stock.interface";

type Listener = () => void

let listeners = new Set<Listener>();
const tickerMap = new Map<string,ITickerData>()
webSocketService.onMessage((data: ITickerData) => {
    tickerStore.setData(data); // Use this instead of directly mutating tickerMap
  });

let lastSnapshot = tickerMap;

export const tickerStore = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapShot: () => lastSnapshot,

  // Update map and snapshot on new data
  setData: (data: ITickerData) => {
    tickerMap.set(data.id, data);
    lastSnapshot = new Map(tickerMap); // Update snapshot reference only when data changes
    listeners.forEach((listener) => listener());
  },

  subscribeToSymbol: (symbol: string) => webSocketService.subscribe(symbol),
  unsubscribeFromSymbol: (symbol: string) => webSocketService.unsubscribe(symbol),
};