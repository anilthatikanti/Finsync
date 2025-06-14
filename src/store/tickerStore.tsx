import webSocketService from "../services/websocketService";
import type { ITickerData } from "../shared/stock.interface";

type Listener = () => void

let listeners = new Set<Listener>();
const tickerMap = new Map<string,ITickerData>();
const subscribedSymbols = new Set<string>();

webSocketService.onMessage((data: ITickerData) => {
    tickerStore.setData(data);
});

let lastSnapshot = tickerMap;

export const tickerStore = {
    subscribe: (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },

    getSnapShot: () => lastSnapshot,

    setData: (data: ITickerData) => {
        tickerMap.set(data.id, data);
        lastSnapshot = new Map(tickerMap);
        listeners.forEach((listener) => listener());
    },

    subscribeToSymbol: async (symbol: string) => {
        if (!subscribedSymbols.has(symbol)) {
            subscribedSymbols.add(symbol);
            await webSocketService.subscribe(symbol);
        }
    },

    unsubscribeFromSymbol: async (symbol: string) => {
        if (subscribedSymbols.has(symbol)) {
            subscribedSymbols.delete(symbol);
            await webSocketService.unsubscribe(symbol);
        }
    }
};