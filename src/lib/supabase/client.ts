import { createBrowserClient } from "@supabase/ssr";
import { createMockClient } from "@/lib/mock/mock-supabase";

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export function createClient() {
  if (isDemoMode) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createMockClient("client") as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
