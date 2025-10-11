import React, { useMemo, useState } from "react";
import { definePlugin } from "sanity";
import {
  Card,
  Stack,
  Button,
  Text,
  TextInput,
  Switch,
  Inline,
  Code,
  Spinner,
} from "@sanity/ui";

type RunResult =
  | {
      ok: boolean;
      dryRun: boolean;
      totalDocs: number;
      uniqueItems: number;
      processed: Array<{
        asin: string;
        marketplace: string;
        ids: string[];
        ok: boolean;
        error?: string;
      }>;
    }
  | { error: string };

const SECRET_TOKEN = process.env.SANITY_STUDIO_PRICE_UPDATE_SECRET!;

function PriceUpdaterTool() {
  // Configure this to your deployed API route
  const [endpoint, setEndpoint] = useState<string>(
    `${process.env.SANITY_STUDIO_BASE_URL}/api/price-update`
  );
  const [limit, setLimit] = useState<string>("0");
  // ISO string, e.g. 2025-01-01T00:00:00Z
  const [since, setSince] = useState<string>("");
  const [dryRun, setDryRun] = useState<boolean>(true);

  // Optional: paste the admin token if Studio is hosted on a different origin
  const [token, setToken] = useState<string>(SECRET_TOKEN);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const url = useMemo(() => {
    const u = new URL(endpoint, window.location.origin);
    if (limit && Number(limit) > 0)
      u.searchParams.set("limit", String(Number(limit)));
    if (dryRun) u.searchParams.set("dryRun", "1");
    if (since) u.searchParams.set("since", since);
    return u.toString();
  }, [endpoint, limit, since, dryRun]);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || `HTTP ${res.status}`);
      } else {
        setResult(json);
      }
    } catch (e: any) {
      setError(e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack space={4} padding={4}>
      <Text size={2} weight="semibold">
        Amazon Price Updater
      </Text>
      <Card padding={3} shadow={1} radius={2} tone="transparent">
        <Stack space={3}>
          <Text size={1} muted>
            Triggers your Next.js endpoint to refresh price snapshots on all
            relevant docs
          </Text>

          <Text size={1}>Endpoint</Text>
          <TextInput
            value={endpoint}
            onChange={(e) => setEndpoint(e.currentTarget.value)}
          />

          <Inline space={3}>
            <Stack space={2}>
              <Text size={1}>Limit (0 = all)</Text>
              <TextInput
                inputMode="numeric"
                value={limit}
                onChange={(e) => setLimit(e.currentTarget.value)}
              />
            </Stack>
            <Stack space={2}>
              <Text size={1}>Since (ISO)</Text>
              <TextInput
                placeholder="2025-01-01T00:00:00Z"
                value={since}
                onChange={(e) => setSince(e.currentTarget.value)}
              />
            </Stack>
            <Stack space={2}>
              <Text size={1}>Dry run</Text>
              <Switch
                checked={dryRun}
                onChange={(e) => setDryRun(e.currentTarget.checked)}
              />
            </Stack>
          </Inline>

          <Text size={1}>
            Admin token (optional if same-origin / cookie auth)
          </Text>
          <TextInput
            type="password"
            placeholder="Paste PRICE_UPDATE_SECRET"
            value={token}
            onChange={(e) => setToken(e.currentTarget.value)}
          />

          <Inline space={3}>
            <Button
              text={loading ? "Running…" : "Run updater"}
              tone="primary"
              mode="default"
              onClick={run}
              disabled={loading}
            />
            {loading && <Spinner muted />}
          </Inline>

          {error && (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {result && "ok" in result && (
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={3}>
                <Text size={1}>Status: {result.ok ? "OK" : "Failed"}</Text>
                <Text size={1}>Dry run: {String(result.dryRun)}</Text>
                <Text size={1}>
                  Docs scanned: {result.totalDocs} | Unique ASINs:{" "}
                  {result.uniqueItems}
                </Text>
                <Card
                  padding={2}
                  tone="transparent"
                  style={{ maxHeight: 320, overflow: "auto" }}
                >
                  <pre style={{ margin: 0, fontSize: 12 }}>
                    {JSON.stringify(result.processed, null, 2)}
                  </pre>
                </Card>
              </Stack>
            </Card>
          )}

          {result && "error" in result && (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{result.error}</Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

export const priceUpdaterTool = definePlugin({
  name: "price-updater-tool",
  tools: [
    {
      name: "price-updater",
      title: "Price Updater",
      component: PriceUpdaterTool,
    },
  ],
});
