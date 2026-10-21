import mongoose, { Schema } from "mongoose";

const SectionSchema = new Schema(
  {
    heading: { type: String, required: true },
    level: { type: Number, enum: [2, 3], default: 2 },
    paragraphs: [String],
    bullets: [String],
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
    status: { type: String, enum: ["published", "draft"], default: "published", index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
