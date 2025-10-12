/**
 * NEXUS Client
 * HTTP + WebSocket client for NEXUS API
 *
 * Sprint 3 Deliverable: StyleForge + VisualArchitect
 */
export class NexusClient {
    constructor(baseUrl = 'http://127.0.0.1:8080') {
        this.baseUrl = baseUrl;
        this.ws = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }
    /**
     * Connect to WebSocket for live updates
     */
    connect() {
        const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws';
        try {
            this.ws = new WebSocket(wsUrl);
            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.reconnectAttempts = 0;
                this.emit('connected');
            };
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                }
                catch (error) {
                    console.error('WebSocket message error:', error);
                }
            };
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.emit('error', error);
            };
            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.emit('disconnected');
                this.attemptReconnect();
            };
        }
        catch (error) {
            console.error('WebSocket connection failed:', error);
            this.attemptReconnect();
        }
    }
    /**
     * Attempt to reconnect WebSocket
     */
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => {
            this.connect();
        }, delay);
    }
    /**
     * Handle WebSocket message
     */
    handleMessage(data) {
        const { type, ...payload } = data;
        switch (type) {
            case 'welcome':
                console.log('👋 Welcome:', payload.message);
                break;
            case 'design-generated':
                this.emit('design-generated', payload);
                break;
            case 'enhancement':
                this.emit('enhancement', payload);
                break;
            default:
                this.emit('message', data);
        }
    }
    /**
     * Register event listener
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    /**
     * Emit event to listeners
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(callback => callback(data));
    }
    /**
     * Get NEXUS status
     */
    async getStatus() {
        const response = await fetch(`${this.baseUrl}/status`);
        if (!response.ok) {
            throw new Error(`Status request failed: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Generate design system
     */
    async generateDesign(payload) {
        const response = await fetch(`${this.baseUrl}/design`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`Design generation failed: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Enhance with personality
     */
    async enhance(payload) {
        const response = await fetch(`${this.baseUrl}/enhance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`Enhancement failed: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Compose optimal agent
     */
    async compose(payload) {
        const response = await fetch(`${this.baseUrl}/compose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`Composition failed: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Get analytics
     */
    async getAnalytics() {
        const response = await fetch(`${this.baseUrl}/analytics`);
        if (!response.ok) {
            throw new Error(`Analytics request failed: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Get enhancement history
     */
    async getHistory(limit = 50) {
        const response = await fetch(`${this.baseUrl}/history?limit=${limit}`);
        if (!response.ok) {
            throw new Error(`History request failed: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Get personalities
     */
    async getPersonalities() {
        const response = await fetch(`${this.baseUrl}/personalities`);
        if (!response.ok) {
            throw new Error(`Personalities request failed: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Close WebSocket connection
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    /**
     * Send message via WebSocket
     */
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
        else {
            console.warn('WebSocket not connected');
        }
    }
}
//# sourceMappingURL=nexus-client.js.map