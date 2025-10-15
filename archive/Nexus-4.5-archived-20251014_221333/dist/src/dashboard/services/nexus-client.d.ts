/**
 * NEXUS Client
 * HTTP + WebSocket client for NEXUS API
 *
 * Sprint 3 Deliverable: StyleForge + VisualArchitect
 */
export class NexusClient {
    constructor(baseUrl?: string);
    baseUrl: string;
    ws: import("undici-types").WebSocket | null;
    listeners: Map<any, any>;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
    /**
     * Connect to WebSocket for live updates
     */
    connect(): void;
    /**
     * Attempt to reconnect WebSocket
     */
    attemptReconnect(): void;
    /**
     * Handle WebSocket message
     */
    handleMessage(data: any): void;
    /**
     * Register event listener
     */
    on(event: any, callback: any): void;
    /**
     * Emit event to listeners
     */
    emit(event: any, data: any): void;
    /**
     * Get NEXUS status
     */
    getStatus(): Promise<unknown>;
    /**
     * Generate design system
     */
    generateDesign(payload: any): Promise<unknown>;
    /**
     * Enhance with personality
     */
    enhance(payload: any): Promise<unknown>;
    /**
     * Compose optimal agent
     */
    compose(payload: any): Promise<unknown>;
    /**
     * Get analytics
     */
    getAnalytics(): Promise<unknown>;
    /**
     * Get enhancement history
     */
    getHistory(limit?: number): Promise<unknown>;
    /**
     * Get personalities
     */
    getPersonalities(): Promise<unknown>;
    /**
     * Close WebSocket connection
     */
    disconnect(): void;
    /**
     * Send message via WebSocket
     */
    send(data: any): void;
}
//# sourceMappingURL=nexus-client.d.ts.map