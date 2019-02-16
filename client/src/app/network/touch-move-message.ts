import { Message } from './message';

export interface TouchMoveMessage extends Message {
  type: 'touchMove';
  identifier: number;
  x: number;
  y: number;
}

export function isTouchMoveMessage(message: Message): message is TouchMoveMessage {
  return message.type === 'touchMove';
}
