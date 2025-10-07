/**
 * NEXUS Security Middleware
 * Provides security controls for NEXUS HTTP endpoints
 */

export class NexusSecurity {
  constructor(options = {}) {
    this.rateLimit = options.rateLimit || { windowMs: 60000, maxRequests: 100 }; // 100 requests per minute
    this.requestCounts = new Map();
    this.allowedOrigins = options.allowedOrigins || ['http://localhost:*', 'http://127.0.0.1:*'];
    this.apiKeys = options.apiKeys || []; // Optional API key authentication
    this.enableCORS = options.enableCORS !== false;
    this.maxRequestSize = options.maxRequestSize || 256 * 1024; // 256KB
    
    // Clean up rate limit data periodically
    setInterval(() => this.cleanupRateLimitData(), this.rateLimit.windowMs);
  }

  /**
   * Main security middleware - validates all security checks
   */
  validateRequest(req, res) {
    const security = {
      cors: this.handleCORS(req, res),
      rateLimit: this.checkRateLimit(req, res),
      authentication: this.checkAuthentication(req, res),
      inputValidation: this.validateInput(req, res)
    };

    const passed = Object.values(security).every(check => check.passed);
    
    if (!passed) {
      const failedChecks = Object.entries(security)
        .filter(([_, check]) => !check.passed)
        .map(([name, check]) => ({ name, error: check.error }));
      
      console.log('🚨 Security check failed:', failedChecks);
      return { passed: false, failedChecks };
    }

    console.log('✅ Security validation passed');
    return { passed: true, security };
  }

  /**
   * Handle CORS (Cross-Origin Resource Sharing)
   */
  handleCORS(req, res) {
    if (!this.enableCORS) {
      return { passed: true, message: 'CORS disabled' };
    }

    const origin = req.headers.origin;
    const isAllowed = !origin || this.isOriginAllowed(origin);

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    }

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return { passed: false, preflight: true }; // Not an error, just handled
    }

    return { 
      passed: isAllowed, 
      error: isAllowed ? null : `Origin '${origin}' not allowed` 
    };
  }

  /**
   * Rate limiting to prevent abuse
   */
  checkRateLimit(req, res) {
    const clientId = this.getClientId(req);
    const now = Date.now();
    const windowStart = now - this.rateLimit.windowMs;

    // Get or create request history for this client
    if (!this.requestCounts.has(clientId)) {
      this.requestCounts.set(clientId, []);
    }

    const requests = this.requestCounts.get(clientId);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if rate limit exceeded
    if (recentRequests.length >= this.rateLimit.maxRequests) {
      res.setHeader('X-RateLimit-Limit', this.rateLimit.maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', new Date(now + this.rateLimit.windowMs).toISOString());
      
      return { 
        passed: false, 
        error: `Rate limit exceeded: ${this.rateLimit.maxRequests} requests per ${this.rateLimit.windowMs / 1000}s` 
      };
    }

    // Record this request
    recentRequests.push(now);
    this.requestCounts.set(clientId, recentRequests);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', this.rateLimit.maxRequests);
    res.setHeader('X-RateLimit-Remaining', this.rateLimit.maxRequests - recentRequests.length);
    res.setHeader('X-RateLimit-Reset', new Date(now + this.rateLimit.windowMs).toISOString());

    return { passed: true, requestCount: recentRequests.length };
  }

  /**
   * Optional API key authentication
   */
  checkAuthentication(req, res) {
    // If no API keys configured, authentication is optional
    if (this.apiKeys.length === 0) {
      return { passed: true, message: 'No authentication required' };
    }

    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return { passed: false, error: 'API key required but not provided' };
    }

    if (!this.apiKeys.includes(apiKey)) {
      return { passed: false, error: 'Invalid API key' };
    }

    return { passed: true, authenticated: true };
  }

  /**
   * Input validation for request data
   */
  validateInput(req, res) {
    // Check Content-Type for POST requests
    if (req.method === 'POST') {
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return { passed: false, error: 'Content-Type must be application/json' };
      }
    }

    // Check Content-Length
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > this.maxRequestSize) {
      return { 
        passed: false, 
        error: `Request too large: ${contentLength} bytes (max: ${this.maxRequestSize})` 
      };
    }

    return { passed: true, contentLength };
  }

  /**
   * Get client identifier for rate limiting
   */
  getClientId(req) {
    // Use X-Forwarded-For header if behind proxy, otherwise use remote address
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    return req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
  }

  /**
   * Check if origin is allowed
   */
  isOriginAllowed(origin) {
    return this.allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      if (allowed.endsWith('*')) {
        const prefix = allowed.slice(0, -1);
        return origin.startsWith(prefix);
      }
      return origin === allowed;
    });
  }

  /**
   * Clean up old rate limit data
   */
  cleanupRateLimitData() {
    const now = Date.now();
    const cutoff = now - this.rateLimit.windowMs;
    
    for (const [clientId, requests] of this.requestCounts.entries()) {
      const recentRequests = requests.filter(timestamp => timestamp > cutoff);
      if (recentRequests.length === 0) {
        this.requestCounts.delete(clientId);
      } else {
        this.requestCounts.set(clientId, recentRequests);
      }
    }
  }

  /**
   * Security response helper
   */
  sendSecurityError(res, statusCode, error, details = {}) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error,
      security: true,
      timestamp: new Date().toISOString(),
      ...details
    }));
  }
}
