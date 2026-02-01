"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSQL = generateSQL;
const openai_1 = __importDefault(require("openai"));
function getOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("Missing OPENAI_API_KEY environment variable.\n" +
            "Get one at https://platform.openai.com/api-keys then:\n" +
            "  export OPENAI_API_KEY=sk-...");
        process.exit(1);
    }
    return new openai_1.default({ apiKey });
}
async function generateSQL(query, options) {
    const openai = getOpenAI();
    const dialect = options.dialect || "PostgreSQL";
    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a database expert. Convert natural language to ${dialect} SQL queries. Use best practices: proper indexing hints, parameterized placeholders where appropriate, and clear aliases.${options.schema ? ` The database schema is: ${options.schema}` : ""} Return ONLY the SQL query, no explanation.`,
            },
            {
                role: "user",
                content: query,
            },
        ],
        temperature: 0.2,
    });
    return res.choices[0].message.content || "";
}
