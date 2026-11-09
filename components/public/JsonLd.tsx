/**
 * Renders one or more JSON-LD <script> tags. Follows the same
 * dangerouslySetInnerHTML(JSON.stringify(...)) pattern used in SchemaMarkup.tsx.
 */
export default function JsonLd({ schema }: { schema: Record<string, unknown> | Record<string, unknown>[] }) {
  const items = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {items.map((item, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
    </>
  );
}
