import { Handler } from "../messageHandler";

const removeZeroWidth = (str: string) => {
    return str.replace(/[\u200B-\u200D\uFEFF]/g, "");
}

/* Example:
genRegex([
    ["s","5"],
    ["h","4"],
    ["i","1","!","l"],
    ["t","7"],
    [["e"], true]
]) -> /\b(s|5)+\s*(h|4)+\s*(i|1|!|l)+\s*(t|7)+\b/gi

genRegex([
    "f",
    "u",
    [["c", "k", "q"], 2]
]) -> /\b(f)+\s*(u)+\s*(c|k|q){2,}\b/gi
*/

type SingleRegexGen =
    string | // One single character to mandatorily match one or more times
    string[] | // Any one of these characters to mandatorily match one or more times
    [string[], // These characters to match...
        number | // A minimum of this many times
        [number, number] | // A minimum of this many times, but a maximum of this many times
        boolean // Zero or more times
    ];
type RegexGen = SingleRegexGen[];

function escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function genRegex(gen: RegexGen): RegExp {
    const inBetween = "(\\s|[\\u200B-\\u200D\\uFEFF])*";

    const regexes = gen.map(g => {
        if (typeof g === "string") {
            return `${g}+`;
        } else if (Array.isArray(g)) {
            if (Array.isArray(g[0])) {
                const [words, count] = g;
                let escaped = words.map(escapeRegExp).join("|");
                if (typeof count === "number") {
                    return `(${escaped}){${count},}`;
                }
                if (typeof count === "boolean") {
                    return `(${escaped})*`;
                }
                if (Array.isArray(count)) {
                    const [min, max] = count;
                    return `(${escaped}){${min},${max}}`;
                }
                // Go to throw statement since invalid
            } else if (typeof g[0] === "string") { // All of g should be of type string
                let escaped = g.map(c => escapeRegExp(c as string)).join("|");
                return `(${escaped})+`;
            }
        }
        throw new Error("Invalid regex gen");
    });

    return new RegExp(`\\b(${regexes.join(inBetween)})+\\b`, "gi");
}
// I'd just use this to generate the regex, then I'd just hard code it in encase
// there's anything that you'd want to customize that's impossible for this
// thing to generate.

const expressions = [
    /(?!\b(niger|nigeria)\b)n(i|!|1|l)+(g|6)+(((e|3)*r+)|a+)/i,
    /(b|6)+(i|!|l|1)+(t|1)+(c)+(h|4)/i,
    /((l|\b)+(\s|[\u200B-\u200D\uFEFF])*(s|5)+(\s|[\u200B-\u200D\uFEFF])*(h|4)+(\s|[\u200B-\u200D\uFEFF])*(i|1|!|l)+(\s|[\u200B-\u200D\uFEFF])*(t|7)+(\s|[\u200B-\u200D\uFEFF])*(e)*)+\b/gi,
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
        for (const expression of expressions) {
            if (expression.test(content)) {
                message.delete();
                message.channel.send("Please don't use profanity.");
                return;
            }
        }
        const contentWithoutSpaces = content.replace(/\s|\n/g, "");
        for (const expression of expressions) {
            if (expression.test(contentWithoutSpaces)) {
                message.delete();
                message.channel.send("Please don't use profanity.");
                return;
            }
        }
    }
}

export default handler;