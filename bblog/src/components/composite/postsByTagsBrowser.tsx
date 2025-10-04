// components/composite/postsByTagsBrowser.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { TagsWrapper } from "@/components/composite/tagsWrapper";
import useDebounce from "@/hooks/useDebounce";
import type { PostCard } from "@/types/Post";
import { UpdateIcon, TrashIcon } from "@radix-ui/react-icons";
import { isAbortError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "or" | "and";

type Props = {
  availableTags: string[];
  pageSize?: number;
  debounceMs?: number;
};

type SavedSelection = {
  id: string;
  name: string;
  tags: string[];
  mode: Mode;
  createdAt: number;
};

const STORAGE_KEY = "blog.savedTagSelections";
const LAST_KEY = "blog.lastSelectionId";

function formatList(items: string[]) {
  if (items.length <= 2) return items.join(items.length === 2 ? " and " : "");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
const makeId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export default function PostsByTagsBrowser({
  availableTags,
  pageSize = 24,
  debounceMs = 300,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("or");
  const [items, setItems] = useState<PostCard[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // saved selections
  const [saves, setSaves] = useState<SavedSelection[]>([]);
  const [selectedSaveId, setSelectedSaveId] = useState<string>("");

  // dialogs
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  // The *active* filters that produced current items
  const activeSelRef = useRef<string[]>([]);
  const activeModeRef = useRef<Mode>("or");

  // Debounced controls
  const selectedJSON = useMemo(
    () => JSON.stringify([...selected].sort()),
    [selected]
  );
  const debouncedSelectedJSON = useDebounce(selectedJSON, debounceMs);
  const debouncedMode = useDebounce(mode, debounceMs);

  // ---- localStorage helpers ----
  function loadSaves(): SavedSelection[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? (JSON.parse(raw) as SavedSelection[]) : [];
      const norm = arr.map((s) => ({
        ...s,
        tags: s.tags.filter((t) => availableTags.includes(t)),
      }));
      return norm;
    } catch {
      return [];
    }
  }

  function persistSaves(next: SavedSelection[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function openSaveDialog() {
    if (selected.length === 0) return;
    const defaultName = `${mode.toUpperCase()}: ${selected.join(", ")}`;
    setSaveName(defaultName);
    setSaveDialogOpen(true);
  }

  function doSaveSelection(nameFromDialog: string) {
    if (selected.length === 0) return;

    const key = (m: Mode, tags: string[]) =>
      `${m}|${[...tags].sort().join(",")}`;
    const currentKey = key(mode, selected);
    const existing = saves.find((s) => key(s.mode, s.tags) === currentKey);

    let next: SavedSelection[];
    let chosenId: string;

    if (existing) {
      const updated = {
        ...existing,
        name: nameFromDialog,
        createdAt: Date.now(),
      };
      next = saves.map((s) => (s.id === existing.id ? updated : s));
      chosenId = existing.id;
    } else {
      const newSave: SavedSelection = {
        id: makeId(),
        name: nameFromDialog,
        tags: [...selected],
        mode,
        createdAt: Date.now(),
      };
      next = [newSave, ...saves].slice(0, 25);
      chosenId = newSave.id;
    }

    setSaves(next);
    persistSaves(next);
    localStorage.setItem(LAST_KEY, chosenId);
    setSelectedSaveId(chosenId);
    setSaveDialogOpen(false);
  }

  function deleteSavedSelection(id: string) {
    const next = saves.filter((s) => s.id !== id);
    setSaves(next);
    persistSaves(next);

    const last = localStorage.getItem(LAST_KEY);
    if (last === id) {
      if (next.length > 0) {
        localStorage.setItem(LAST_KEY, next[0].id);
        setSelectedSaveId(next[0].id);
      } else {
        localStorage.removeItem(LAST_KEY);
        setSelectedSaveId("");
      }
    }
    if (selectedSaveId === id) setSelectedSaveId("");
  }

  function applySavedSelection(id: string) {
    const found = saves.find((s) => s.id === id);
    if (!found) return;
    const filtered = found.tags.filter((t) => availableTags.includes(t));
    setMode(found.mode);
    setSelected(filtered);
    setSelectedSaveId(found.id);
    localStorage.setItem(LAST_KEY, found.id);
  }

  // Load saved selections on mount
  useEffect(() => {
    const loaded = loadSaves();
    setSaves(loaded);
    const last = localStorage.getItem(LAST_KEY);
    if (last) {
      const match = loaded.find((s) => s.id === last);
      if (match) {
        setMode(match.mode);
        setSelected(match.tags.filter((t) => availableTags.includes(t)));
        setSelectedSaveId(match.id);
      }
    }
  }, [availableTags.join("|")]);

  // ---- fetching ----
  async function fetchPageWith(
    sel: string[],
    m: Mode,
    nextOffset: number,
    reset = false
  ) {
    if (!sel.length) {
      abortRef.current?.abort();
      activeSelRef.current = [];
      activeModeRef.current = m;
      setItems([]);
      setHasMore(false);
      setOffset(0);
      setError(null);
      return;
    }

    activeSelRef.current = sel;
    activeModeRef.current = m;

    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const params = new URLSearchParams();
    for (const t of sel) params.append("tags", t);
    params.set("mode", m);
    params.set("offset", String(nextOffset));
    params.set("limit", String(pageSize));

    try {
      const res = await fetch(`/api/posts/tags?${params.toString()}`, {
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(await res.text());
      const data: PostCard[] = await res.json();

      setItems((prev) => (reset ? data : [...prev, ...data]));
      setOffset(nextOffset + data.length);
      setHasMore(data.length === pageSize);
    } catch (err: unknown) {
      if (isAbortError(err) || ac.signal.aborted) return;
      setError(
        err instanceof Error && err.message ? err.message : "Failed to load"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const sel: string[] = JSON.parse(debouncedSelectedJSON || "[]");
    if (sel.length === 0) {
      abortRef.current?.abort();
      activeSelRef.current = [];
      activeModeRef.current = debouncedMode as Mode;
      setItems([]);
      setOffset(0);
      setHasMore(false);
      setError(null);
      return;
    }
    setItems([]);
    setOffset(0);
    setHasMore(true);
    fetchPageWith(sel, debouncedMode as Mode, 0, true);
  }, [debouncedSelectedJSON, debouncedMode, pageSize]);

  function loadMore() {
    const sel = activeSelRef.current;
    const m = activeModeRef.current;
    if (!loading && hasMore && sel.length) {
      fetchPageWith(sel, m, offset, false);
    }
  }

  function clearAllSelected() {
    abortRef.current?.abort();
    setSelected([]);
    activeSelRef.current = [];
    activeModeRef.current = mode;
    setItems([]);
    setOffset(0);
    setHasMore(false);
    setError(null);
  }

  const headingTags = activeSelRef.current;
  const headingMode = activeModeRef.current;

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 space-y-4">
      {/* Controls */}
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: filter mode */}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold whitespace-nowrap">Filter by Tags:</h2>

          <Button
            className={`whitespace-nowrap cursor-pointer px-3 py-1 rounded transition-colors ${
              mode === "or"
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-secondary text-black hover:bg-accent hover:text-white"
            }`}
            onClick={() => setMode("or")}
            title="Shows posts that match at least one selected tag"
          >
            Any
          </Button>

          <Button
            className={`whitespace-nowrap cursor-pointer px-3 py-1 rounded transition-colors ${
              mode === "and"
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-secondary text-black hover:bg-accent hover:text-white"
            }`}
            onClick={() => setMode("and")}
            title="Shows posts that include every selected tag"
          >
            All
          </Button>
        </div>

        {/* Right: saved + actions (stack on small, row on >=sm) */}
        <div className="flex flex-col gap-2 w-full lg:w-auto space-x-4">
          {/* Saved picker row */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 w-full">
            {/* Saved: label + Select */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground">Saved:</span>

              <Select
                value={selectedSaveId || undefined}
                onValueChange={(val) => applySavedSelection(val)}
                disabled={saves.length === 0}
              >
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue
                    placeholder={
                      saves.length === 0 ? "No saved selections" : "Choose…"
                    }
                  />
                </SelectTrigger>
                {saves.length > 0 && (
                  <SelectContent>
                    {saves.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
            </div>

            {/* Manage Saved selections */}
            <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full sm:w-auto px-3 py-1 rounded transition-colors bg-secondary hover:bg-accent text-black hover:text-white"
                  title="Apply or remove saved selections"
                  disabled={saves.length === 0}
                >
                  Manage saved
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Manage saved selections</DialogTitle>
                  <DialogDescription>
                    Apply or remove saved filters. Removing a selection deletes
                    it from your browser’s storage.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 mb-8 max-h-[50vh] overflow-y-auto pr-1">
                  {saves.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No saved selections.
                    </p>
                  ) : (
                    saves.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between rounded border border-accent p-2"
                      >
                        <div className="min-w-0">
                          <div className="font-medium truncate">{s.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.mode.toUpperCase()} · {s.tags.join(", ")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="px-3 py-1 rounded transition-colors bg-secondary hover:bg-accent hover:text-white"
                            onClick={() => applySavedSelection(s.id)}
                            title="Apply this selection"
                          >
                            Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSavedSelection(s.id)}
                            title="Remove this selection"
                          >
                            <TrashIcon className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="secondary"
                    className="text-black"
                    onClick={() => setManageDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Actions row (Save / Clear), full-width on small */}
          <div className="flex flex-col justify-center items-stretch gap-2 w-full">
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  onClick={openSaveDialog}
                  disabled={selected.length === 0}
                  className="
                    w-full sm:w-auto whitespace-nowrap
                    font-mont px-3 py-1 rounded text-black transition-colors
                    bg-secondary hover:bg-accent hover:text-white
                    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                  "
                  title="Save current tags & mode"
                >
                  Save
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-mont">
                    Save this selection
                  </DialogTitle>
                  <DialogDescription className="font-mont">
                    Name your current tags and mode to reuse later.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2 py-2">
                  <Label htmlFor="saveName" className="font-mont">
                    Name
                  </Label>
                  <Input
                    className="font-mont selection:bg-secondary selection:text-secondary-foreground"
                    id="saveName"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="e.g., AND: skincare, routine"
                  />
                </div>

                <DialogFooter>
                  <Button
                    className="cursor-pointer text-black border border-secondary hover:bg-secondary"
                    onClick={() => setSaveDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="cursor-pointer bg-secondary text-black hover:bg-accent hover:text-white"
                    onClick={() =>
                      doSaveSelection(
                        (saveName ?? "").trim() ||
                          `${mode.toUpperCase()}: ${selected.join(", ")}`
                      )
                    }
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              className="sm:w-auto whitespace-nowrap"
              onClick={clearAllSelected}
              disabled={selected.length === 0}
              variant="destructive"
              title="Clear all selected tags"
            >
              Clear all
            </Button>
          </div>
        </div>
      </div>

      {/* Controlled tag picker */}
      <TagsWrapper
        tags={availableTags}
        selected={selected}
        onChange={setSelected}
      />

      {/* Results heading */}
      {headingTags.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
          <h3 className="text-lg font-semibold">
            Showing {items.length} post{items.length === 1 ? "" : "s"} matching{" "}
            <span className="italic">
              {headingMode === "and" ? "all" : "any"}
            </span>{" "}
            of: <span className="font-medium">{formatList(headingTags)}</span>
          </h3>
        </div>
      )}

      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Grid (contained + resilient) */}
      <ul className="grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((p, i) => {
          const matches = p.tags?.filter((t) => headingTags.includes(t)) ?? [];
          return (
            <li
              key={p._id}
              className="group relative overflow-hidden rounded-lg border bg-background min-w-0"
            >
              <div className="relative aspect-[3/2]">
                {!!p.thumbnailUrl && (
                  <Image
                    src={p.thumbnailUrl}
                    alt={p.title}
                    fill
                    priority={i < 6}
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-black/60 transition-colors duration-300 group-hover:bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <div className="text-center text-white max-w-[90%] drop-shadow">
                    {matches.length > 0 && (
                      <div className="mb-2 flex flex-wrap justify-center gap-1">
                        {matches.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-sm bg-accent border border-accent/70 text-sm shadow-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h4 className="font-semibold line-clamp-2">{p.title}</h4>
                    <div className="text-xs opacity-90">
                      {new Date(p.date).toLocaleDateString()}
                    </div>
                    {p.intro && (
                      <p className="text-xs mt-2 line-clamp-3 opacity-90">
                        {p.intro.split(" ").slice(0, 10).join(" ") + "..."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center py-4">
        {hasMore ? (
          <Button onClick={loadMore} disabled={loading} variant="outline">
            {loading ? <UpdateIcon className="animate-spin" /> : "Load more"}
          </Button>
        ) : (
          <span className="text-muted-foreground">
            {loading ? (
              <UpdateIcon className="animate-spin" />
            ) : (
              "No more posts"
            )}
          </span>
        )}
      </div>
    </div>
  );
}
