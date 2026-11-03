/**
 * Throws on a Supabase error, otherwise returns the (guaranteed non-null) data.
 * `error` is typed as `Error | null` rather than the more specific `PostgrestError`
 * because this also unwraps Storage API responses (upload/remove), whose errors
 * are `StorageError` — both classes extend `Error`, which is all `throw` needs.
 */
export function unwrap<T>({ data, error }: { data: T | null; error: Error | null }): T {
  if (error) {
    throw error;
  }

  return data as T;
}
