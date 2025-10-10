#!/bin/bash

echo "🧪 TEST 1: New Personality - PromptCrafter"
echo "Request: Create a Midjourney prompt for a sunset beach"
curl -s -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"personalityName": "promptcrafter", "request": "Create a Midjourney prompt for a beautiful sunset beach scene"}' \
  | jq -r '.success, .response.personalityUsed' | head -5

echo ""
echo "🧪 TEST 2: New Personality - PromptSmith"
echo "Request: Optimize this LLM prompt"
curl -s -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"personalityName": "promptsmith", "request": "Optimize this prompt: Write me a story about dogs"}' \
  | jq -r '.success, .response.personalityUsed' | head -5

echo ""
echo "🧪 TEST 3: AUTO Mode Selection"
echo "Request: Help with image generation"
curl -s -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"mode": "AUTO", "request": "I need help creating AI art prompts for Midjourney"}' \
  | jq -r '{success, personality: .response.personalityUsed, mode: .mode}' | head -10

echo ""
echo "🧪 TEST 4: Python Task (Should select Pythonista)"
curl -s -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"mode": "AUTO", "request": "Write a Python function to calculate fibonacci"}' \
  | jq -r '{success, personality: .response.personalityUsed}' | head -10

echo ""
echo "🧪 TEST 5: System Status Check"
curl -s http://localhost:8080/status | jq '{
  initialized,
  totalPersonalities: .personalitySystem.totalPersonalities,
  totalTraits: .traitComposition.totalTraits,
  health: .systemHealth
}' | head -10

