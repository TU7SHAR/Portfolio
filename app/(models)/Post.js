import mongoose, { Schema } from "mongoose";

const SectionSchema = new Schema(
  {
    heading: { type: String, required: true },
    level: { type: Number, enum: [2, 3], default: 2 },
    paragraphs: [String],
    bullets: [String],
    code: { type: new Schema({ language: String, content: String }, { _id: false }), default: undefined },
    table: { type: new Schema({ headers: [String], rows: [[String]] }, { _id: false }), default: undefined },
  },
  { _id: false }
);

const PostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    excerpt: { type: String, required: true },
    // short direct answer shown at the top (what search/AI answers quote)
    tldr: String,
    keyTakeaways: [String],
    // first-person note tying the topic to the author's real projects
    authorNote: String,
    // the search query the post was written to answer
    primaryQuery: String,
    // "evergreen" (search-query driven) or "trending" (news driven)
    mode: String,
    category: { type: String, default: "Tech" },
    keywords: [String],
    tags: [String],
    sections: [SectionSchema],
    faq: [{ _id: false, question: String, answer: String }],
    sources: [{ _id: false, title: String, url: String }],
    // the trending keyword this post was generated from (used for de-duping)
    sourceTopic: { type: String, index: true },
    topicKey: { type: String, index: true },
    readingMinutes: { type: Number, default: 4 },
    words: Number,
    // quality problems left after the repair pass (empty = clean)
    qualityIssues: [String],
    status: { type: String, enum: ["published", "draft"], default: "published", index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
