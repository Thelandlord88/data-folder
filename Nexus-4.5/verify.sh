#!/bin/bash
# Run a simple test to verify Nexus is working

echo "🧪 Testing Nexus Endpoints"
echo ""

# Test if running
if curl -s --max-time 2 http://127.0.0.1:8080/status > /dev/null 2>&1; then
    echo "✅ Nexus is running!"
    echo ""
    
    echo "📊 Status Response:"
    curl -s http://127.0.0.1:8080/status | jq '.' 2>/dev/null || curl -s http://127.0.0.1:8080/status
    
    echo ""
    echo "✅ All tests passed!"
else
    echo "❌ Nexus is not running"
    echo ""
    echo "To start Nexus, run:"
    echo "  ./start-nexus.sh"
fi
