const post = {
  slug: "razorpay-signature-verification-nextjs",
  publishedAt: "2026-10-31T08:30:00.000Z",
  primaryQuery: "razorpay webhook signature verification next.js",
  title: "Razorpay Payment and Webhook Signature Verification in Next.js",
  metaTitle: "Razorpay Signature Verification in Next.js App Router",
  metaDescription:
    "Verify Razorpay payment and webhook signatures in Next.js App Router: the two HMAC checks, raw body handling, idempotency with x-razorpay-event-id, and gotchas.",
  excerpt:
    "Razorpay uses two different HMAC checks with two different secrets. Here is how to do both in Next.js App Router route handlers, and how to handle retries and duplicates.",
  category: "Payments",
  tags: ["Razorpay", "Next.js", "Webhooks"],
  keywords: [
    "razorpay signature verification",
    "razorpay webhook signature verification",
    "x-razorpay-signature",
    "razorpay nextjs app router",
    "razorpay webhook nodejs",
    "x-razorpay-event-id",
  ],
  tldr:
    "Razorpay uses two HMAC-SHA256 checks. After Checkout, hash `order_id + \"|\" + razorpay_payment_id` with your API key secret and compare it to `razorpay_signature`. For webhooks, hash the raw request body with the webhook secret you set in the Dashboard and compare it to the `X-Razorpay-Signature` header. In App Router, read the body with `await req.text()` before parsing it.",
  keyTakeaways: [
    "The payment signature uses your API key secret; the webhook signature uses the separate webhook secret. Mixing them up is the most common failure.",
    "Verify the webhook against the exact raw bytes. Parsing and re-stringifying JSON changes them.",
    "Razorpay delivers at least once and treats responses slower than 5 seconds as failures, so expect duplicates and keep handlers fast.",
    "Deduplicate with the `x-razorpay-event-id` header, which is unique per event.",
    "Events can arrive out of order, for example `payment.captured` before `payment.authorized`.",
  ],
  authorNote:
    "I built the payment flow on bhavishai.in this way: Razorpay signature verification first, then the PDF report is generated in the background and emailed, with an admin reconciliation view for deliveries that fail.",
  sections: [
    {
      heading: "Two signatures, two secrets",
      level: 2,
      paragraphs: [
        "Razorpay signs two different things, and each check has its own inputs. Keep this table next to your code.",
      ],
      table: {
        headers: ["Check", "Message", "Key", "Compare with"],
        rows: [
          ["Payment (after Checkout)", "order_id + \"|\" + razorpay_payment_id", "API key secret", "razorpay_signature from the Checkout handler"],
          ["Webhook", "Raw request body", "Webhook secret set in the Dashboard", "X-Razorpay-Signature header"],
        ],
      },
    },
    {
      heading: "The full flow, from order to fulfilment",
      level: 2,
      paragraphs: [
        "Signature checks only make sense inside the right flow. This is the order of operations I use for one-time payments with Razorpay Orders and Standard Checkout.",
      ],
      bullets: [
        "Create the order on your server with the Orders API, passing the amount in paise, the currency and your own receipt id. Store the returned `order_id` next to your internal order.",
        "Open Checkout in the browser with your public key id and that `order_id`. Never send your key secret to the client.",
        "When Checkout's handler fires, POST the three `razorpay_*` values to your server and verify the payment signature. Show the customer a success screen only after this passes.",
        "Treat the webhook as the source of truth. Mark the order paid from `payment.captured` or `order.paid` as well, because the browser step can fail after the money has moved.",
        "Fulfil exactly once. Whichever path arrives first marks the order paid and queues delivery; the other sees it's already done and exits.",
      ],
    },
    {
      heading: "How to verify the payment signature after Checkout",
      level: 2,
      paragraphs: [
        "When Checkout succeeds, its handler receives `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature`. Post them to your server and verify there. Never mark an order paid from the browser alone.",
        "Use the `order_id` you created and stored on the server, not the one sent back by the client. That way a valid signature for a different order can't be replayed against this one.",
      ],
      code: {
        language: "js",
        content: `// app/api/razorpay/verify/route.js
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

const safeEqual = (a, b) => {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
};

export async function POST(req) {
  const { razorpay_payment_id, razorpay_signature, internalOrderId } = await req.json();
  const order = await db.orders.findById(internalOrderId); // has razorpayOrderId
  if (!order || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(\`\${order.razorpayOrderId}|\${razorpay_payment_id}\`)
    .digest("hex");

  if (!safeEqual(expected, razorpay_signature)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  await db.orders.markPaid(order.id, razorpay_payment_id);
  return NextResponse.json({ ok: true });
}`,
      },
    },
    {
      heading: "How to verify Razorpay webhooks in App Router",
      level: 2,
      paragraphs: [
        "The webhook signature covers the request body exactly as sent. In a Route Handler, `await req.text()` gives you that string. Verify it first, then `JSON.parse` it. If you call `req.json()` and stringify the result again, whitespace and key order can change and the HMAC won't match.",
        "Unlike the Pages Router, App Router Route Handlers don't parse the body for you, so there's no `bodyParser` config to turn off.",
      ],
      code: {
        language: "js",
        content: `// app/api/razorpay/webhook/route.js
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const raw = await req.text(); // exact bytes Razorpay signed
  const signature = req.headers.get("x-razorpay-signature") || "";
  const expected = createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(raw)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventId = req.headers.get("x-razorpay-event-id");
  const event = JSON.parse(raw);

  // idempotency: insert fails if this event id was already stored (unique index)
  const isNew = await db.webhookEvents.insertIfAbsent(eventId, event.event);
  if (isNew) await queue.add("razorpay-event", { eventId, event });

  return NextResponse.json({ ok: true }); // fast 2xx
}`,
      },
    },
    {
      heading: "Handling retries, duplicates and order",
      level: 2,
      paragraphs: [
        "Razorpay's webhook docs describe at-least-once delivery. Any non-2xx response counts as a failure and is retried with exponential backoff for 24 hours after the event was created. If deliveries keep failing for 24 hours, the webhook is disabled and you get an email. A response that takes longer than 5 seconds is also treated as a timeout and retried, even if your server processed it.",
        "That gives three rules. Store the `x-razorpay-event-id` with a unique index and skip events you've seen. Answer within a second or two and do slow work, such as generating a PDF or sending email, in a background job. And don't assume order: Razorpay notes `payment.captured` can arrive before `payment.authorized`, so update state based on the event's data, not on what you expect came before.",
      ],
      code: {
        language: "js",
        content: `// Mongoose: unique event ids make duplicate deliveries a no-op
const WebhookEvent = new Schema(
  { eventId: { type: String, required: true, unique: true }, type: String },
  { timestamps: true }
);

async function insertIfAbsent(eventId, type) {
  try {
    await WebhookEventModel.create({ eventId, type });
    return true;
  } catch (err) {
    if (err.code === 11000) return false; // duplicate key: already processed
    throw err;
  }
}`,
      },
    },
    {
      heading: "Testing webhooks locally",
      level: 3,
      paragraphs: [
        "Razorpay needs a public HTTPS URL, and its docs list blocked domains for webhook URLs, including `localhost`, `ngrok.io`, `loca.lt`, `webhook.site` and `requestbin.com`. The docs suggest a zrok tunnel for local testing, or a staging deployment with webhooks configured in Test mode. Test and Live mode have separate webhook settings, so set the secret for each.",
      ],
    },
    {
      heading: "Gotchas",
      level: 2,
      paragraphs: [],
      bullets: [
        "Using `RAZORPAY_KEY_SECRET` to verify webhooks. Webhooks use the secret you typed when creating the webhook.",
        "Rotating the webhook secret: Razorpay's docs say retries of older events are still signed with the old secret, so accept both for a while.",
        "Comparing with `===` works but leaks timing; `timingSafeEqual` is the safe default and throws if lengths differ, so check length first.",
        "Amounts are in the smallest currency unit (paise for INR). Compare the paid amount with your order, not with what the client sent.",
        "Edge runtime: `node:crypto`'s `createHmac` needs the Node.js runtime, so keep `runtime = \"nodejs\"` on these routes or use Web Crypto.",
      ],
    },
  ],
  faq: [
    {
      question: "Why does my Razorpay webhook signature not match?",
      answer:
        "Usually one of three things: you're using the API key secret instead of the webhook secret, you're hashing a re-serialised JSON body instead of the raw text, or the secret is from the other mode (Test vs Live). Log the length of the raw body and recheck which secret the webhook was created with.",
    },
    {
      question: "Do I need webhooks if I already verify the payment signature?",
      answer:
        "It is strongly recommended. The browser callback can fail if the customer closes the tab or loses connection after paying. A webhook such as payment.captured or order.paid lets your server mark the order paid either way.",
    },
    {
      question: "Which Razorpay events should I listen to?",
      answer:
        "For one-time payments with Orders, payment.captured or order.paid cover the success case, and payment.failed lets you notify the customer. Subscribe only to the events you handle, and make every handler idempotent.",
    },
    {
      question: "Can I use the Razorpay SDK instead of writing the HMAC myself?",
      answer:
        "Yes. Razorpay's SDKs include signature validation helpers. Writing the HMAC with node:crypto is a few lines and avoids a dependency in a route handler; both produce the same result.",
    },
  ],
  sources: [
    { title: "Razorpay docs: Validate and test webhooks", url: "https://razorpay.com/docs/webhooks/validate-test/" },
    { title: "Razorpay docs: Webhook best practices", url: "https://razorpay.com/docs/webhooks/best-practices/" },
    { title: "Razorpay docs: Standard Checkout integration steps", url: "https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/" },
  ],
};

export default post;
