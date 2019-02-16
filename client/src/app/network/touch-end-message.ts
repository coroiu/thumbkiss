import { Message } from './message';

export interface TouchEndMessage extends Message {
  type: 'touchEnd';
  identifier: number;
}

export function isTouchEndMessage(message: Message): message is TouchEndMessage {
  return message.type === 'touchEnd';
}
