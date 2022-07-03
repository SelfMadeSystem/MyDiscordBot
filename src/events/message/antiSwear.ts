import { Handler } from "../messageHandler";

const removeZeroWidth = (str: string) => {
    return str.replace(/\-|_|\./g, "");
}

/* Examples:
console.log(genRegex([
    ["c", "("],
    ["o", "0"],
    ["c", "(", "k"],
]).replaceAll("\\", "\\\\"))

console.log(genRegex([
    "p",
    ["u", "v"],
    [["s", "5"], 2],
    "y"
]).replaceAll("\\", "\\\\"))

console.log(genRegex([
    "d",
    ["i", "1", "l", "!"],
    [["k", "c", "("], 2],
]).replaceAll("\\", "\\\\"))

console.log(genRegex([
    "p",
    ["u", "v"],
    [["s", "5"], 2],
    ["i", "1", "l", "!"],
    ["e", "3"],
    ["s", "5"],
]).replaceAll("\\", "\\\\"))
*/

/* type SingleRegexGen =
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

function genRegex(gen: RegexGen): string {
    const whitespace = "(\\s|\\-|_|\\.)";
    const inBetween = `${whitespace}*`;

    const regexes = gen.map(g => {
        if (typeof g === "string") {
            return `(${g})+`;
        } else if (Array.isArray(g)) {
            if (Array.isArray(g[0])) {
                const [words, count] = g;
                let escaped = words.map(escapeRegExp).join("|");
                if (typeof count === "number") {
                    return `((${escaped})(${inBetween})){${count},}`;
                }
                if (typeof count === "boolean") {
                    return `((${escaped})(${inBetween}))*`;
                }
                if (Array.isArray(count)) {
                    const [min, max] = count;
                    return `((${escaped})(${inBetween})){${min},${max}}`;
                }
                // Go to throw statement since invalid
            } else if (typeof g[0] === "string") { // All of g should be of type string
                let escaped = g.map(c => escapeRegExp(c as string)).join("|");
                return `((${escaped})(${inBetween}))+`;
            }
        }
        throw new Error("Invalid regex gen");
    });

    return `\\b(${regexes.join(inBetween)})+\\b`;
} */
// I'd just use this to generate the regex, then I'd just hard code it in encase
// there's anything that you'd want to customize that's impossible for this
// thing to generate.

const expressions: { [key: string]: string } = Object.freeze({
    "N-Word": "\\b(?!\\b(niger)\\b)((n)+(\\s|\\-|_|\\.)*((i|!|l|1)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((g|9|q)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((e|3)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*(r)+(\\s|\\-|_|\\.|s|5)*)+\\b",
    "N-Word with a": "\\b((n)+(\\s|\\-|_|\\.)*((i|!|l|1)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((g|9|q)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((a|4)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.|s)*)+\\b",
    "B-Word": "\\b((b)+(\\s|\\-|_|\\.)*((i|l|1|!)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((t|7)((\\s|\\-|_|\\.)*))*(\\s|\\-|_|\\.)*((c|\\()((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((h|4)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.|e|3|s|5)*)+\\b",
    "F-Word": "\\b((f)+(\\s|\\-|_|\\.)*((u|v)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((c|k|q)((\\s|\\-|_|\\.)*)){2,}(\\s|\\-|_|\\.|s|5)*)+\\b",
    "S-Word #1": "\\b(((s|5)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((h|4)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((i|1|!|l)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((t|7)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.|e|3|s|5)*)+\\b",
    "S-Word #2": "\\b(((s|5)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((l|1)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((u|v)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((t|7)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.|s)*(\\s|\\-|_|\\.|e|3|s|5)*)+\\b",
    "C-Word #1": "\\b(((c|\\()((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((o|0)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((c|\\(|k)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.|s|5)*)+\\b",
    "C-Word #2": "\\b(((c|\\()((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((u|v)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*(n)+(\\s|\\-|_|\\.)*((t|7)((\\s|\\-|_|\\.)*))+)+\\b",
    "P-Word": "\\b((p)+(\\s|\\-|_|\\.)*((u|v)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((s|5)((\\s|\\-|_|\\.)*)){2,}(\\s|\\-|_|\\.)*(y)+)+\\b",
    "P-Word but plural": "\\b((p)+(\\s|\\-|_|\\.)*((u|v)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((s|5)((\\s|\\-|_|\\.)*)){2,}(\\s|\\-|_|\\.)*((i|1|l|!)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((e|3)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((s|5)((\\s|\\-|_|\\.)*))+)+\\b",
    "D-Word": "\\b((d)+(\\s|\\-|_|\\.)*((i|1|l|!)((\\s|\\-|_|\\.)*))+(\\s|\\-|_|\\.)*((k|c|\\()((\\s|\\-|_|\\.)*)){2,}(\\s|\\-|_|\\.|e|3|s|5)*)+\\b",
});

const handler: Handler = {
    onMessage: (message) => {
        const content = removeZeroWidth(message.content);
        for (const key in expressions) {
            const expression = expressions[key];
            const regex = new RegExp(expression, "gi");
            if (regex.test(content)) {
                message.delete();
                message.channel.send(`${message.author.username}'s message got deleted for saying ${key}.`);
                console.log(`${message.author.username}'s message got deleted for saying ${key}: ${message.content}`);
                return;
            }
        }
    }
}

export default handler;
