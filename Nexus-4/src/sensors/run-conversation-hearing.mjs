#!/usr/bin/env node
import readline from 'node:readline';
import { nervousSystem } from '../nervous-system.mjs';
import ConversationHearing from './conversation-hearing.mjs';

// Wire the conversation sensor to the shared nervous system and expose a simple CLI feed.
const sensor = new ConversationHearing(nervousSystem);
console.log('🎧 Conversation Hearing sensor listening. Type messages to emit conversation events.');
console.log('   Enter "exit" to stop the listener.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'you> '
});

const emitConversation = (text, source = 'human') => {
  nervousSystem.emit('conversation', {
    text,
    source,
    timestamp: Date.now()
  });
};

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (trimmed.toLowerCase() === 'exit') {
    rl.close();
    return;
  }

  emitConversation(line);
  rl.prompt();
});

rl.on('close', () => {
  console.log('👂 Conversation Hearing sensor shutting down.');
  process.exit(0);
});

emitConversation('Listener boot sequence complete.', 'system');
rl.prompt();
