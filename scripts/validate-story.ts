import { validateStoryData } from '../src/engine/validation';
import { characters, conversations, evidence, photos } from '../src/story/data';
const errors = validateStoryData();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Narrativa válida: ${characters.length} personagens, ${conversations.length} conversas, ${conversations.reduce((count, chat) => count + chat.messages.length, 0)} mensagens, ${photos.length} ilustrações, ${evidence.length} evidências.`);
}
