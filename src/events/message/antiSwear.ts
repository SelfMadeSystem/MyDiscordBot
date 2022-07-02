import { Handler } from "../messageHandler";

const removeZeroWidth = (str: string) => {
    return str.replace(/[\u200B-\u200D\uFEFF]/g, "");
}

const expressions = [
    /(?!\b(niger|nigeria)\b)n(i|!|1|l)+(g|6)+(((e|3)*r+)|a+)/i,
    /(b|6)+(i|!|l|1)+(t|1)+(c)+(h|4)/i,
    /(s|5)+(4|h)+(i|1)+(t|1)+/i,
    /(^|_|-| )(a|4)+(s|5){2,}((3|e)+(s|5)*)?($|_|-| )/i,
    /(^|_|-| )f+u+(c|k|q)+?($|_|-| )|f+u+(c|q|k){2,}/i,
    /(c|k)(o|0|u)(c|k)+/i,
    /p+(u+|V)(s+|5+)+?y+/i,
    /d(i|1|!)+ck+?|d(i|1|!)+(k|c)/i,
    /f+(a|4)+(g|6)+/i,
    /^g+(?:([a4]))+y+/i,
    /(?:[s5]+)(l+|i+|1+)(u+|v+)t+/i,
    /(s+|5+)+k+(([a|4]+))n+k+/i
];

const handler: Handler = {
    onMessage: (message) => {
        const content = removeZeroWidth(message.content);
        expressions.forEach(expression => {
            if (expression.test(content)) {
                message.delete();
                message.channel.send(`${message.author.username} has been deleted for using a bad word.`);
            }
        });
    }
}

export default handler;