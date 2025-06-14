import { useEffect, useSyncExternalStore, useRef } from "react";
import type { ITickerData } from "../shared/stock.interface";
import { tickerStore } from '../store/tickerStore';
import webSocketService from "../services/websocketService";
import { useAuth } from '../store/authContext';

export const useLiveData = (symbols?: string[]): Map<string, ITickerData> => {
    const { user } = useAuth();
    const previousSymbols = useRef<string[]>([]);

    useEffect(() => {
        let isMounted = true;

        async function setupWebSocket() {
            if (!user) return;
            
            try {
                const token = await user.getIdToken();
                webSocketService.token = token;
                
                if (token && isMounted) {
                    // Only subscribe to new symbols
                    if (symbols) {
                        const newSymbols = symbols.filter(symbol => !previousSymbols.current.includes(symbol));
                        const removedSymbols = previousSymbols.current.filter(symbol => !symbols.includes(symbol));

                        // Subscribe to new symbols
                        for (const symbol of newSymbols) {
                            await tickerStore.subscribeToSymbol(symbol);
                        }

                        // Unsubscribe from removed symbols
                        for (const symbol of removedSymbols) {
                            await tickerStore.unsubscribeFromSymbol(symbol);
                        }

                        // Update previous symbols
                        previousSymbols.current = [...symbols];
                    }
                }
            } catch (error) {
                console.error('Failed to setup WebSocket:', error);
            }
        }

        setupWebSocket();

        return () => {
            isMounted = false;
            // Only unsubscribe if component is unmounting
            if (symbols) {
                symbols.forEach(symbol => {
                    tickerStore.unsubscribeFromSymbol(symbol);
                });
            }
        };
    }, [user, symbols?.join(',')]); // Only re-run if symbols array changes

    return useSyncExternalStore(tickerStore.subscribe, tickerStore.getSnapShot);
}