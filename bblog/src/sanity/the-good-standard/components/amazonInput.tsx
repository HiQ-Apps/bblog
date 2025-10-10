// sanity/components/amazonInput.tsx
import type { ObjectInputProps } from "sanity";
import { set, unset } from "sanity";
import { TextInput, Button, Stack, Card, Text } from "@sanity/ui";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL!;
const path = process.env.NEXT_PUBLIC_SANITY_ORIGIN!;

function corsHeaders() {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3333",
    path,
    ,
  ];

  return {
    "Access-Control-Allow-Origin": allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default function AmazonInput(props: ObjectInputProps) {
  const { value, onChange, renderDefault } = props;
  const [raw, setRaw] = useState<string>(value?.asin || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function fetchItem() {
    setErr(null);
    setLoading(true);
    try {
      const asin = extractAsin(raw);
      const res = await fetch(
        `https://thegoodstandard.org/api/amazon-search?asin=${encodeURIComponent(asin)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Fetch failed");

      onChange(
        set({
          asin: data.asin,
          product: {
            ...data.product,
            imageUrl:
              data.product?.image?.asset?.url ?? data.product?.imageUrl ?? null,
          },
        })
      );
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      setErr(e.message ?? "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack space={3}>
      {/* Your custom controls */}
      <TextInput
        value={raw}
        onChange={(e) => setRaw(e.currentTarget.value)}
        placeholder="Paste ASIN or Amazon product URL"
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          text={loading ? "Fetching..." : "Fetch"}
          disabled={loading || !raw}
          onClick={fetchItem}
        />
        <Button
          tone="caution"
          text="Clear"
          onClick={() => onChange(unset())}
          disabled={loading}
        />
      </div>
      {err && (
        <Card tone="critical" padding={3} radius={2}>
          <Text>{err}</Text>
        </Card>
      )}
      {value?.product?.title && (
        <Card tone="positive" padding={3} radius={2}>
          <Text size={1}>
            Loaded: <strong>{value.product.title}</strong>
          </Text>
        </Card>
      )}

      {/* Optional: also render default fields UI below your controls */}
      {renderDefault(props)}
    </Stack>
  );
}

function extractAsin(input: string): string {
  const rxs = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /^[A-Z0-9]{10}$/i,
  ];
  for (const rx of rxs) {
    const m = input.match(rx);
    if (m) return (m[1] || m[0]).toUpperCase();
  }
  return input.trim().toUpperCase();
}
