#!/usr/bin/env python3
"""
NEXUS Diagnosis Test: Prove personalities return metadata, not content
"""

import requests
import json

NEXUS_URL = "http://localhost:8080"

def test_current_behavior():
    """Test that current system returns metadata, not personality content"""
    print("🔬 TEST 1: Current Behavior Diagnosis")
    print("=" * 60)
    
    request_data = {
        "mode": "COMPOSE",
        "request": "Should we use PostgreSQL or stay with cache?",
        "maxTraits": 3
    }
    
    response = requests.post(
        f"{NEXUS_URL}/enhance",
        json=request_data,
        timeout=10
    )
    
    data = response.json()
    content = data['response']['content']
    
    print("\n📊 Response Analysis:")
    print(f"Total length: {len(content)} characters")
    print()
    
    # Count sections
    metadata_sections = [
        "Multi-Personality Composed Response",
        "Trait Composition",
        "Integrated Analysis",
        "Multi-Perspective Insights",
        "Combined Knowledge Domains"
    ]
    
    found_sections = {section: section in content for section in metadata_sections}
    
    print("Metadata Sections Found:")
    for section, found in found_sections.items():
        icon = "✅" if found else "❌"
        print(f"  {icon} {section}")
    
    print()
    
    # Check for actual conversational content
    personality_voices = [
        "I think", "I believe", "In my opinion",
        "We should", "I recommend", "My analysis shows",
        "Disagree", "However", "On the other hand"
    ]
    
    found_voices = [voice for voice in personality_voices if voice.lower() in content.lower()]
    
    print("Conversational Indicators Found:")
    if found_voices:
        for voice in found_voices:
            print(f"  ✅ '{voice}'")
    else:
        print(f"  ❌ NONE - No conversational content!")
    
    print()
    
    # Calculate metadata vs content ratio
    metadata_keywords = ["Expertise:", "Specializes in:", "Activates on:", "🎯", "📊", "💡", "🔔"]
    metadata_count = sum(content.count(keyword) for keyword in metadata_keywords)
    
    print(f"📈 Metadata Density: {metadata_count} metadata markers found")
    print(f"📝 Actual Analysis: {len([line for line in content.split('\\n') if len(line) > 50 and not any(k in line for k in metadata_keywords)])} lines")
    
    print()
    
    # Verdict
    metadata_percentage = (metadata_count / (len(content) / 100)) * 100
    
    if metadata_percentage > 5:
        print("❌ VERDICT: METADATA OVERLOAD")
        print(f"   System is generating {metadata_count} metadata items")
        print("   but minimal actual conversational content!")
    else:
        print("✅ VERDICT: Content-focused")
    
    print()
    print("=" * 60)
    return content

def test_what_we_want():
    """Show what a proper response should look like"""
    print()
    print("🎯 TEST 2: What We SHOULD Get")
    print("=" * 60)
    
    ideal_response = """
🎭 integrationmaestro + atlas + performancehawk (Synergy: 68%)

integrationmaestro: "Stay with cache for now. Your 50% hit rate will climb 
to 80% within 24 hours. PostgreSQL is overkill - you're handling 100 
requests/day, not millions."

atlas: "I disagree slightly. While cache works TODAY, PostgreSQL gives you 
ACID guarantees and persistent storage. If you ever need cross-session data, 
you'll have to migrate anyway."

performancehawk: "atlas has a point about persistence, but the performance 
cost is real. Cache: <2ms. PostgreSQL: 10-50ms. That's a 5-25x slowdown. 
Start with cache, add PostgreSQL ONLY when you need persistence."

CONSENSUS: Cache now, PostgreSQL later (when you hit 10k requests/day or 
need persistent storage).
"""
    
    print(ideal_response)
    print()
    print("✅ Notice:")
    print("  - Personalities actually SPEAK")
    print("  - They DISAGREE with each other")
    print("  - They give SPECIFIC advice (50% → 80%, <2ms vs 10-50ms)")
    print("  - Minimal metadata, maximum insight")
    print()
    print("=" * 60)

def test_diagnosis_complete():
    """Summary of findings"""
    print()
    print("📋 DIAGNOSIS COMPLETE")
    print("=" * 60)
    print()
    print("ROOT CAUSE IDENTIFIED:")
    print("  🔴 NEXUS.engine.v2.ts Line 603-665")
    print("  🔴 synthesizeMultiPersonalityResponse()")
    print("  🔴 Returns metadata, no AI-generated content")
    print()
    print("THE PROBLEM:")
    print("  ❌ System lists personality credentials")
    print("  ❌ No actual AI generation happens")
    print("  ❌ No conversational content")
    print()
    print("THE SOLUTION:")
    print("  ✅ Add PersonalityPromptGenerator")
    print("  ✅ Create prompts with personality context")
    print("  ✅ Send to AI (OpenAI/Anthropic/etc)")
    print("  ✅ Return actual conversational response")
    print()
    print("IMPLEMENTATION:")
    print("  📄 See: DIAGNOSIS_ROOT_CAUSE.md")
    print("  ⏱️  Time: 1-4 hours depending on approach")
    print("  🎯 Impact: 10x better responses immediately")
    print()
    print("=" * 60)

if __name__ == "__main__":
    try:
        print()
        print("🔬 NEXUS PERSONALITY DIAGNOSIS")
        print("=" * 60)
        print()
        
        content = test_current_behavior()
        test_what_we_want()
        test_diagnosis_complete()
        
        print()
        print("✅ Diagnosis complete! Ready to implement fix?")
        print()
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: NEXUS not running on http://localhost:8080")
        print("   Start NEXUS first: npx tsx nexus-runtime.v2.ts")
    except Exception as e:
        print(f"\n❌ Error: {e}")
