export function formatMaybeArray(value: unknown): string | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    const cleaned = value.map(v => String(v).trim()).filter(Boolean);
    return cleaned.length ? cleaned.join(', ') : null;
  }
  const s = String(value).trim();
  return s ? s : null;
}

export function formatWeight(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // If API sends just "260", show "260 g" (common for this dataset)
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed} g`;
  return trimmed;
}
