import { Client } from "@stomp/stompjs";

export function createStockAlertSocket(onMessage: () => void) {
    const client = new Client({
        brokerURL: `${import.meta.env.VITE_WS_URL}`,
        onConnect: () => {
            console.log("WebSocket connected");
            client.subscribe("/topic/stock-alerts", () => {
                        console.log("Stock alert received");
                        onMessage();
                    });
        },
        reconnectDelay: 5000,
    });

    client.activate();
    return client;
}