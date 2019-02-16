import { Message } from './message';

export interface TouchStartMessage extends Message {
  type: 'touchStart';
  identifier: number;
  x: number;
  y: number;
}

export function isTouchStartMessage(message: Message): message is TouchStartMessage {
  return message.type === 'touchStart';
}
