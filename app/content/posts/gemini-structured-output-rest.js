const post = {
  slug: "gemini-structured-output-rest-api",
  publishedAt: "2026-10-31T06:30:00.000Z",
  primaryQuery: "gemini api structured output json schema rest example",
  title: "Gemini Structured Output over REST: A Production Example",
  metaTitle: "Gemini API Structured Output: JSON Schema REST Example",
  metaDescription:
    "Get schema-valid JSON from the Gemini API with plain fetch: request shape, schema design, URL context, parsing and fallbacks, from a generator in production.",
  excerpt:
    "How I get a full blog post back from Gemini as schema-valid JSON using plain fetch, no SDK: the request, schema design tips, tools, parsing and fallbacks.",
  category: "AI",
  tags: ["Gemini API", "LLM", "JSON Schema"],
  keywords: [
    "gemini structured output",
    "gemini json schema",
    "gemini responseJsonSchema",
    "gemini api rest example",
    "gemini url context",
    "gemini json mode",
  ],
  tldr:
    "Send `generationConfig.responseFormat.text` with `mimeType: \"APPLICATION_JSON\"` and a JSON Schema in `schema` to the `generateContent` endpoint, and Gemini returns JSON that matches it, with keys in schema order. Gemini 3 models can combine this with built-in tools like URL context. Still filter thought parts before parsing, validate the content yourself, and fall back to `responseMimeType` plus `responseJsonSchema` if a model rejects the newer shape.",
  keyTakeaways: [
    "Structured output guarantees the shape, not the quality. Length, tone and facts still need your own checks.",
    "Property `description` fields work as instructions. Put length limits and rules there as well as in the prompt.",
    "Output follows the order of keys in the schema, so put fields the model should decide first (like which topic it picked) at the top.",
    "With thinking models, skip parts marked `thought: true` before joining the response text.",
    "Grounding with Google Search has terms that restrict storing and republishing its results. For content you publish, read your own source URLs with URL context instead.",
  ],
  authorNote:
    "I call the Gemini REST API without an SDK in several products, including the generator that writes drafts for this blog. The code below is simplified from that generator.",
  sections: [
    {
      heading: "What does the minimal request look like?",
      level: 2,
      paragraphs: [
        "Structured output is a field in `generationConfig`. You describe the JSON you want with a JSON Schema, and the model's text part comes back as a JSON string that matches it. No SDK is required; `fetch` is enough, which keeps serverless bundles small.",
        "Send the API key in the `x-goog-api-key` header rather than the query string, so it doesn't end up in request logs.",
      ],
      code: {
        language: "js",
        content: `const API = "https://generativelanguage.googleapis.com/v1beta/models";

const schema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Headline, 45-70 characters." },
    summary: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
  },
  required: ["title", "summary", "tags"],
};

const res = await fetch(\`\${API}/gemini-3.8-flash:generateContent\`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text: "Write a post about HTTP 410 vs 404." }] }],
    generationConfig: {
      responseFormat: { text: { mimeType: "APPLICATION_JSON", schema } },
    },
  }),
});
const data = await res.json();`,
      },
    },
    {
      heading: "How should you design the schema for long content?",
      level: 2,
      paragraphs: [
        "A blog post is a big object: SEO fields, a short answer, sections with headings, paragraphs, optional code and tables, and an FAQ. A few habits made the output much more consistent for me.",
      ],
      bullets: [
        "Write rules into `description`. \"metaTitle, 50-60 characters, query near the start\" in the schema is followed more reliably than the same rule only in the prompt.",
        "Use `enum` for anything you'll switch on later, such as category or heading level. It removes a whole class of cleanup code.",
        "Make nested extras optional. My sections have optional `code` and `table` objects; marking them required made the model invent tables where none belonged.",
        "Order keys deliberately. The model writes them in schema order, so `chosenIndex` and `primaryQuery` come first and the body is written with that decision already made.",
        "Keep to the supported subset: string, number, integer, boolean, object, array and null, plus things like enum, anyOf and $ref that the docs show. Exotic keywords may be ignored.",
      ],
      code: {
        language: "js",
        content: `const SECTION = {
  type: "object",
  properties: {
    heading: { type: "string" },
    level: { type: "integer", enum: [2, 3] },
    paragraphs: { type: "array", items: { type: "string" } },
    code: {
      type: "object",
      description: "Optional runnable example.",
      properties: { language: { type: "string" }, content: { type: "string" } },
      required: ["language", "content"],
    },
  },
  required: ["heading", "level", "paragraphs"], // code stays optional
};`,
      },
    },
    {
      heading: "Combining structured output with tools",
      level: 2,
      paragraphs: [
        "Gemini 3 models can use built-in tools, including URL context and Grounding with Google Search, in the same request as a response schema. URL context reads pages you list in the prompt and reports which ones it fetched in `urlContextMetadata`, which is useful for showing sources.",
        "I list official documentation URLs next to each topic candidate and let the model read the ones for the topic it picks. Then I only show a URL as a source if it was both offered and successfully retrieved.",
      ],
      code: {
        language: "js",
        content: `body: JSON.stringify({
  contents: [{ role: "user", parts: [{ text: promptWithUrls }] }],
  tools: [{ urlContext: {} }],
  generationConfig: {
    thinkingConfig: { thinkingLevel: "medium" },
    responseFormat: { text: { mimeType: "APPLICATION_JSON", schema: POST_SCHEMA } },
  },
});

// which URLs were actually read
const meta = data.candidates?.[0]?.urlContextMetadata?.urlMetadata || [];
const read = meta
  .filter((u) => u.urlRetrievalStatus?.includes("SUCCESS"))
  .map((u) => u.retrievedUrl);`,
      },
    },
    {
      heading: "Why I don't publish Google Search grounded output",
      level: 3,
      paragraphs: [
        "Grounding with Google Search is the obvious way to fact-check, and my first version used it. Then I read the Gemini API Additional Terms. Grounded Results are meant to be shown, with their Search Suggestions, to the end user who sent the prompt, and the terms restrict caching, storing and syndicating them, with narrow exceptions.",
        "A blog post stored in a database and served to everyone is hard to square with that. I switched research to URL context on pages I choose. If you use Search grounding, read the [terms](https://ai.google.dev/gemini-api/terms) for your use case first; I'm describing my reading, not giving legal advice.",
      ],
    },
    {
      heading: "Which fields does a search-ready blog post need?",
      level: 2,
      paragraphs: [
        "The schema is also where you encode what a good page looks like. My first version asked for a title, sections and an FAQ, and the posts read like generic summaries. The current one asks for fields that force a better structure.",
      ],
      table: {
        headers: ["Field", "Why it's there"],
        rows: [
          ["primaryQuery", "Makes the model commit to one real search query before writing, so the post answers something specific"],
          ["tldr", "A 40-60 word direct answer shown at the top; readers and AI answers can quote it on its own"],
          ["keyTakeaways", "3-5 concrete points; vague ones are easy to spot and reject"],
          ["authorNote", "First-person context, limited to a list of things the author has actually built, or empty"],
          ["sections[].code / table", "Optional, so working code and comparisons appear where they help, not everywhere"],
          ["faq", "Follow-up questions with answers that stand alone, also used for FAQPage structured data"],
        ],
      },
    },
    {
      heading: "Prompt rules that made the biggest difference",
      level: 3,
      paragraphs: [
        "The schema controls shape; the prompt controls substance. Three rules changed the output the most for me.",
      ],
      bullets: [
        "A closed list of the author's real projects, with an explicit instruction that nothing else may be claimed as experience. Without it, models invent plausible anecdotes and numbers.",
        "A list of banned filler words and phrases, checked again in code after generation, because models don't always follow negative instructions.",
        "A list of internal pages with exact paths that inline links may use. Any other link in the output is turned back into plain text before saving.",
      ],
    },
    {
      heading: "Parsing the response safely",
      level: 2,
      paragraphs: [
        "Thinking models can return parts flagged `thought: true` alongside the answer. Join only the non-thought text parts. I also strip stray code fences, which some older models add even in JSON mode, and wrap `JSON.parse` so a bad response becomes a clear error in the run log.",
        "After parsing, validate what the schema can't: word count, banned filler phrases, meta lengths, whether a technical post has a code example. If something fails, I send the draft and a list of the problems back in a second, tool-free request and ask for a corrected version in the same schema. Posts that still fail are saved as drafts instead of published.",
      ],
      code: {
        language: "js",
        content: `const text = (data.candidates?.[0]?.content?.parts || [])
  .filter((p) => typeof p.text === "string" && !p.thought)
  .map((p) => p.text)
  .join("")
  .trim()
  .replace(/^\`\`\`(?:json)?\\s*|\\s*\`\`\`$/g, "");

let post;
try {
  post = JSON.parse(text);
} catch {
  throw new Error("Gemini returned invalid JSON");
}`,
      },
    },
    {
      heading: "Fallbacks for older models",
      level: 2,
      paragraphs: [
        "If `GEMINI_MODEL` points at an older model, the newer `responseFormat` shape may return 400. The older fields, `responseMimeType: \"application/json\"` with `responseJsonSchema`, are still documented in the SDK examples. Some older models also reject tools combined with JSON output, so my last attempt drops the tools.",
      ],
      code: {
        language: "js",
        content: `const attempts = [
  { contents, tools, generationConfig: { responseFormat: { text: { mimeType: "APPLICATION_JSON", schema } } } },
  { contents, tools, generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema } },
  { contents, generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema } },
];

let r;
for (const body of attempts) {
  r = await callGemini(body);
  if (r.ok || r.status !== 400) break; // only retry on "bad request"
}`,
      },
    },
    {
      heading: "Common problems and fixes",
      level: 2,
      paragraphs: [],
      table: {
        headers: ["Symptom", "Likely cause", "Fix"],
        rows: [
          ["JSON.parse fails on valid-looking output", "Thought parts or code fences mixed into the text", "Filter thought parts, strip fences"],
          ["HTTP 400 on a working prompt", "Model doesn't support the request shape or tool combination", "Fall back to responseJsonSchema, then drop tools"],
          ["Fields are present but too short", "Schema only enforces structure", "Validate lengths and run a repair pass"],
          ["Model invents optional objects", "Nested object marked required", "Make extras optional and describe when to use them"],
          ["Request killed on serverless", "Long generation hits the platform timeout", "AbortSignal.timeout before maxDuration"],
        ],
      },
    },
  ],
  faq: [
    {
      question: "Does Gemini structured output always return valid JSON?",
      answer:
        "The docs say the model returns a syntactically valid JSON string matching the schema. In practice you should still guard JSON.parse and validate values, because schema-valid JSON can still have empty strings, wrong lengths or made-up content.",
    },
    {
      question: "What is the difference between responseSchema and responseJsonSchema?",
      answer:
        "responseSchema is the older field that takes an OpenAPI-style schema object. responseJsonSchema accepts JSON Schema directly, and in REST the newer responseFormat.text.schema does the same. For new code, use JSON Schema.",
    },
    {
      question: "Can I use the Gemini API with fetch instead of the SDK?",
      answer:
        "Yes. The REST endpoint is POST /v1beta/models/{model}:generateContent with the key in the x-goog-api-key header. The SDK adds conveniences such as Zod or Pydantic schema conversion, but plain fetch works well in serverless functions.",
    },
    {
      question: "How long can a structured output response be?",
      answer:
        "It is bounded by the model's output token limit, listed per model in the Gemini docs. A 1,500-word post with code fits comfortably in current Flash models; very large objects are more reliable when split across several requests.",
    },
  ],
  sources: [
    { title: "Gemini API docs: Structured outputs", url: "https://ai.google.dev/gemini-api/docs/generate-content/structured-output" },
    { title: "Gemini API docs: URL context", url: "https://ai.google.dev/gemini-api/docs/generate-content/url-context" },
    { title: "Gemini API docs: Grounding with Google Search", url: "https://ai.google.dev/gemini-api/docs/generate-content/google-search" },
    { title: "Gemini API Additional Terms of Service", url: "https://ai.google.dev/gemini-api/terms" },
  ],
};

export default post;
