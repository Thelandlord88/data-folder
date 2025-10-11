#!/usr/bin/env python3
"""
NEXUS Cache Performance Benchmark
Measure real-world cache performance gains
"""

import requests
import time
import statistics
from typing import List, Tuple

NEXUS_URL = "http://localhost:8080"

# Test requests with different patterns
TEST_REQUESTS = [
    "Optimize Python code with async/await",
    "Audit security vulnerabilities",
    "Design scalable architecture",
    "Build CI/CD pipeline",
    "Improve database performance",
    "Create beautiful user interface",
    "Implement cryptography",
    "Profile performance bottlenecks",
    "Test with pytest",
    "Deploy to production",
]

def make_request(text: str) -> Tuple[float, dict]:
    """Make a request and return timing + response"""
    start = time.time()
    response = requests.post(
        f"{NEXUS_URL}/enhance",
        json={"mode": "COMPOSE", "request": text, "maxTraits": 3},
        timeout=10
    )
    elapsed = time.time() - start
    return elapsed * 1000, response.json()  # Convert to ms

def run_benchmark():
    """Run comprehensive cache benchmark"""
    print("🚀 NEXUS CACHE PERFORMANCE BENCHMARK")
    print("=" * 50)
    print()

    # Phase 1: First requests (all cache misses)
    print("📊 Phase 1: COLD START (Cache Misses)")
    print("-" * 50)
    cold_times = []
    
    for i, request in enumerate(TEST_REQUESTS, 1):
        elapsed, _ = make_request(request)
        cold_times.append(elapsed)
        print(f"  {i}. {request[:40]:40} {elapsed:6.1f}ms")
        time.sleep(0.1)  # Small delay between requests
    
    cold_avg = statistics.mean(cold_times)
    print(f"\n  Average (cold): {cold_avg:.1f}ms")
    print()

    # Phase 2: Repeat same requests (all cache hits)
    print("📊 Phase 2: WARM START (Cache Hits)")
    print("-" * 50)
    warm_times = []
    
    for i, request in enumerate(TEST_REQUESTS, 1):
        elapsed, _ = make_request(request)
        warm_times.append(elapsed)
        print(f"  {i}. {request[:40]:40} {elapsed:6.1f}ms")
        time.sleep(0.05)
    
    warm_avg = statistics.mean(warm_times)
    print(f"\n  Average (warm): {warm_avg:.1f}ms")
    print()

    # Phase 3: Mixed requests (some cached, some new)
    print("📊 Phase 3: MIXED LOAD (Cache Hit Rate)")
    print("-" * 50)
    mixed_times = []
    
    # Repeat first 5 (cached) + 5 new requests
    mixed_requests = TEST_REQUESTS[:5] + [
        "New request 1", "New request 2", "New request 3",
        "New request 4", "New request 5"
    ]
    
    for i, request in enumerate(mixed_requests, 1):
        elapsed, _ = make_request(request)
        mixed_times.append(elapsed)
        cached = "✅ HIT" if i <= 5 else "❌ MISS"
        print(f"  {i}. {request[:35]:35} {elapsed:6.1f}ms  {cached}")
        time.sleep(0.05)
    
    mixed_avg = statistics.mean(mixed_times)
    print(f"\n  Average (mixed): {mixed_avg:.1f}ms")
    print()

    # Get cache stats from server
    print("📈 CACHE STATISTICS")
    print("-" * 50)
    status = requests.get(f"{NEXUS_URL}/status").json()
    cache_stats = status.get("performanceCache", {})
    
    print(f"  Cache Hits:     {cache_stats.get('hits', 0)}")
    print(f"  Cache Misses:   {cache_stats.get('misses', 0)}")
    print(f"  Hit Rate:       {cache_stats.get('hitRate', 0):.1f}%")
    print(f"  Cache Size:     {cache_stats.get('size', 0)} items")
    print()

    # Calculate improvements
    print("🎯 PERFORMANCE IMPROVEMENTS")
    print("=" * 50)
    speedup = cold_avg / warm_avg if warm_avg > 0 else 0
    time_saved = cold_avg - warm_avg
    
    print(f"  Cold Start Avg:   {cold_avg:.1f}ms")
    print(f"  Warm Start Avg:   {warm_avg:.1f}ms")
    print(f"  Time Saved:       {time_saved:.1f}ms ({time_saved/cold_avg*100:.0f}%)")
    print(f"  Speedup:          {speedup:.1f}x faster!")
    print()
    
    if speedup >= 10:
        emoji = "🔥🔥🔥"
        message = "INCREDIBLE!"
    elif speedup >= 5:
        emoji = "🚀🚀"
        message = "EXCELLENT!"
    elif speedup >= 2:
        emoji = "✅"
        message = "GOOD!"
    else:
        emoji = "⚠️"
        message = "Needs improvement"
    
    print(f"  {emoji} {message} Cache is delivering {speedup:.1f}x speedup!")
    print()

    # Extreme test: Measure minimum cached response time
    print("⚡ EXTREME TEST: Minimum Response Time")
    print("-" * 50)
    extreme_times = []
    for _ in range(20):
        elapsed, _ = make_request(TEST_REQUESTS[0])
        extreme_times.append(elapsed)
        time.sleep(0.01)
    
    min_time = min(extreme_times)
    avg_extreme = statistics.mean(extreme_times)
    
    print(f"  20 cached requests:")
    print(f"    Minimum:  {min_time:.2f}ms")
    print(f"    Average:  {avg_extreme:.2f}ms")
    print(f"    Maximum:  {max(extreme_times):.2f}ms")
    print()
    
    if min_time < 1:
        print("  🔥 SUB-MILLISECOND responses achieved!")
        print(f"  🎯 That's {cold_avg/min_time:.0f}x faster than uncached!")
    
    print()
    print("=" * 50)
    print("✅ Benchmark complete!")

if __name__ == "__main__":
    try:
        run_benchmark()
    except KeyboardInterrupt:
        print("\n\n⚠️  Benchmark interrupted")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
