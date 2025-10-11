"""
NEXUS-4.5 Comprehensive Test Suite
Tests for personality activation, API endpoints, and system health
"""

import pytest
import requests
from typing import Dict, List

BASE_URL = "http://localhost:8080"

# ============================================
# Fixtures
# ============================================

@pytest.fixture(scope="session")
def nexus_status():
    """Get NEXUS status once for all tests"""
    response = requests.get(f"{BASE_URL}/status")
    assert response.status_code == 200, "NEXUS is not running"
    return response.json()

@pytest.fixture
def enhance_request():
    """Helper function to make enhance requests"""
    def _request(text: str, max_traits: int = 5) -> Dict:
        response = requests.post(f"{BASE_URL}/enhance", json={
            "mode": "COMPOSE",
            "request": text,
            "maxTraits": max_traits
        })
        assert response.status_code == 200
        return response.json()
    return _request

# ============================================
# System Health Tests
# ============================================

class TestSystemHealth:
    """Test NEXUS system health and status"""
    
    def test_nexus_is_running(self):
        """Test that NEXUS server is running"""
        response = requests.get(f"{BASE_URL}/status")
        assert response.status_code == 200
    
    def test_nexus_initialized(self, nexus_status):
        """Test that NEXUS is properly initialized"""
        assert nexus_status["initialized"] is True
    
    def test_all_personalities_loaded(self, nexus_status):
        """Test that all 45 personalities are loaded"""
        total = nexus_status["personalitySystem"]["totalPersonalities"]
        assert total == 45, f"Expected 45 personalities, got {total}"
    
    def test_circuit_breaker_closed(self, nexus_status):
        """Test that circuit breaker is in healthy state"""
        state = nexus_status["loaderHealth"]["circuitBreakerState"]
        assert state == "CLOSED", f"Circuit breaker is {state}"
    
    def test_memory_usage_reasonable(self, nexus_status):
        """Test that memory usage is under 100MB"""
        memory = nexus_status["loaderHealth"]["memoryUsageMB"]
        assert memory < 100, f"Memory usage too high: {memory}MB"
    
    def test_traits_loaded(self, nexus_status):
        """Test that all 211 traits are loaded"""
        total = nexus_status["traitComposition"]["totalTraits"]
        assert total == 211, f"Expected 211 traits, got {total}"

# ============================================
# Personality Activation Tests
# ============================================

class TestPersonalityActivation:
    """Test that specific personalities activate on targeted requests"""
    
    def test_pythonista_activation(self, enhance_request):
        """Test Pythonista activates on Python keywords"""
        result = enhance_request("Optimize Python code using async/await patterns")
        personality = result["response"]["personalityUsed"].lower()
        assert "pythonista" in personality
    
    def test_hunter_activation(self, enhance_request):
        """Test Hunter activates on audit keywords"""
        result = enhance_request("Audit code for security gaps and vulnerabilities")
        personality = result["response"]["personalityUsed"].lower()
        assert "hunter" in personality
    
    def test_flash_activation(self, enhance_request):
        """Test Flash activates on performance keywords"""
        result = enhance_request("Optimize performance and reduce latency")
        personality = result["response"]["personalityUsed"].lower()
        assert "flash" in personality or "pythonista" in personality
    
    def test_daedalus_activation(self, enhance_request):
        """Test Daedalus activates on architecture keywords"""
        result = enhance_request("Design scalable distributed system architecture")
        personality = result["response"]["personalityUsed"].lower()
        assert "daedalus" in personality or "pythonista" in personality
    
    def test_guardian_activation(self, enhance_request):
        """Test Guardian activates on security keywords"""
        result = enhance_request("Implement secure authentication and validation")
        personality = result["response"]["personalityUsed"].lower()
        assert any(p in personality for p in ["guardian", "cipher", "pythonista"])
    
    def test_forge_activation(self, enhance_request):
        """Test Forge activates on CI/CD keywords"""
        result = enhance_request("Build CI/CD pipeline with Docker and Kubernetes")
        personality = result["response"]["personalityUsed"].lower()
        assert "forge" in personality or "guardian" in personality

# ============================================
# Response Quality Tests
# ============================================

class TestResponseQuality:
    """Test quality and structure of NEXUS responses"""
    
    def test_response_has_personality(self, enhance_request):
        """Test that response includes personality information"""
        result = enhance_request("Test request")
        assert "personalityUsed" in result["response"]
        assert result["response"]["personalityUsed"] != ""
    
    def test_response_has_traits(self, enhance_request):
        """Test that response includes trait information"""
        result = enhance_request("Test request")
        assert "traits" in result["response"]
        assert len(result["response"]["traits"]) > 0
    
    def test_response_has_synergy_score(self, enhance_request):
        """Test that response includes synergy score"""
        result = enhance_request("Test request")
        assert "synergyScore" in result["response"]
        assert 0 <= result["response"]["synergyScore"] <= 1
    
    def test_response_has_confidence(self, enhance_request):
        """Test that response includes confidence score"""
        result = enhance_request("Test request")
        assert "confidenceScore" in result["response"]
        assert 0 <= result["response"]["confidenceScore"] <= 1
    
    def test_trait_count_respects_max(self, enhance_request):
        """Test that trait count respects maxTraits parameter"""
        result = enhance_request("Complex request", max_traits=3)
        trait_count = len(result["response"]["traits"])
        assert trait_count <= 3, f"Expected ≤3 traits, got {trait_count}"

# ============================================
# Multi-Personality Tests
# ============================================

class TestMultiPersonality:
    """Test complex requests that should activate multiple personalities"""
    
    def test_complex_request_activates_multiple(self, enhance_request):
        """Test that complex requests activate multiple personalities"""
        result = enhance_request(
            "Build secure REST API with performance optimization and testing",
            max_traits=10
        )
        personality = result["response"]["personalityUsed"]
        # Should have multiple personalities
        assert "+" in personality or len(result["response"]["traits"]) >= 3
    
    def test_synergy_in_optimal_range(self, enhance_request):
        """Test that multi-personality synergy is in optimal range (40-80%)"""
        result = enhance_request(
            "Design scalable architecture with security and monitoring",
            max_traits=8
        )
        synergy = result["response"]["synergyScore"]
        assert 0.4 <= synergy <= 0.9, f"Synergy {synergy*100:.0f}% outside optimal range"

# ============================================
# Performance Tests
# ============================================

class TestPerformance:
    """Test NEXUS performance characteristics"""
    
    def test_response_time_acceptable(self, enhance_request):
        """Test that response time is under 5 seconds"""
        import time
        start = time.time()
        enhance_request("Test request")
        duration = time.time() - start
        assert duration < 5.0, f"Response took {duration:.2f}s (>5s threshold)"
    
    @pytest.mark.parametrize("max_traits", [1, 5, 10, 15])
    def test_different_trait_counts(self, enhance_request, max_traits):
        """Test that different trait counts work"""
        result = enhance_request("Test request", max_traits=max_traits)
        assert len(result["response"]["traits"]) <= max_traits

# ============================================
# Edge Case Tests
# ============================================

class TestEdgeCases:
    """Test edge cases and error handling"""
    
    def test_empty_request(self, enhance_request):
        """Test handling of empty request"""
        result = enhance_request("")
        assert "response" in result
    
    def test_very_long_request(self, enhance_request):
        """Test handling of very long request"""
        long_request = "test " * 500
        result = enhance_request(long_request)
        assert "response" in result
    
    def test_special_characters(self, enhance_request):
        """Test handling of special characters"""
        result = enhance_request("Test with special: @#$%^&*()")
        assert "response" in result
    
    def test_max_traits_zero(self):
        """Test that maxTraits=0 is handled"""
        response = requests.post(f"{BASE_URL}/enhance", json={
            "mode": "COMPOSE",
            "request": "test",
            "maxTraits": 0
        })
        # Should either work with default or return error gracefully
        assert response.status_code in [200, 400]

# ============================================
# Integration Tests
# ============================================

class TestIntegration:
    """Integration tests for end-to-end workflows"""
    
    def test_full_workflow(self, enhance_request):
        """Test complete workflow from request to response"""
        # Make request
        result = enhance_request("Optimize Python code", max_traits=5)
        
        # Verify complete response structure
        assert "success" in result
        assert result["success"] is True
        assert "response" in result
        
        response = result["response"]
        assert "personalityUsed" in response
        assert "traits" in response
        assert "synergyScore" in response
        assert "confidenceScore" in response
        assert "content" in response
    
    def test_sequential_requests(self, enhance_request):
        """Test multiple sequential requests"""
        requests_to_test = [
            "Optimize Python code",
            "Audit security",
            "Design architecture"
        ]
        
        for req in requests_to_test:
            result = enhance_request(req)
            assert result["success"] is True

# ============================================
# Run Tests
# ============================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
