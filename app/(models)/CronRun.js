import mongoose, { Schema } from "mongoose";

// One document per blog-generation run, so results are visible at
// /api/cron/generate-blog?status=1 without digging through Vercel logs.
const CronRunSchema = new Schema(
  {
    status: { type: String, enum: ["running", "success", "skipped", "error"], default: "running", index: true },
    stage: String, // last step reached: start → scrape → gemini → save → revalidate → done
    trigger: String, // "background" | "wait"
    topic: String,
    slug: String,
    error: String,
    sourceErrors: [String],
    ms: Number,
    finishedAt: Date,
  },
  { timestamps: true }
);

// keep ~30 days of history
CronRunSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export default mongoose.models.CronRun || mongoose.model("CronRun", CronRunSchema);
