export function mockFetchOk<T>(data: T) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(''),
  });
}

export function mockFetchFail(opts?: { status?: number; statusText?: string; bodyText?: string }) {
  const status = opts?.status ?? 500;
  const statusText = opts?.statusText ?? 'Internal Server Error';
  const bodyText = opts?.bodyText ?? 'boom';

  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText,
    json: vi.fn(), // won't be used on failure
    text: vi.fn().mockResolvedValue(bodyText),
  });
}
