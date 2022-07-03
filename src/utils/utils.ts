import { ColorResolvable } from 'discord.js';

export function randomColor(): ColorResolvable {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
