import { useEffect, useSyncExternalStore } from "react";
import type { ITickerData } from "../shared/stock.interface";
import { tickerStore } from '../store/tickerStore';
import webSocketService from "../services/websocketService";




export const useLiveData=():Map<string,ITickerData>=>{

    useEffect(() => {
        // Ensure the WebSocket is connected
        webSocketService.connect(); // assumes user was set earlier
    
        return () => {
          webSocketService.disconnect(); // optional cleanup
        };
      }, []);


    return useSyncExternalStore(tickerStore.subscribe,tickerStore.getSnapShot)

}