import { Message } from './message';

export interface TouchStartMessage extends Message {
  type: 'touchStart';
  identifier: number;
}

export function isTouchStartMessage(message: Message): message is TouchStartMessage {
  return message.type === 'touchStart';
}
