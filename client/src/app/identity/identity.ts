import { GenerateUuid } from '../utils/uuid';
import { GenerateColor } from '../utils/color';

export class Identity {
    constructor(
        public readonly id: string = GenerateUuid(),
        public color: string = GenerateColor()
    ) { }
}
