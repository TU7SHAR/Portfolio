// Renders schema.org structured data. `<` is escaped so content coming from
// the database (e.g. AI-generated blog text) can never break out of the tag.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
