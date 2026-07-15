// Mock types to satisfy the standard TypeScript compiler (tsserver) in IDEs 
// that do not have the Deno extension installed. This prevents red squiggles 
// for Deno globals and URL imports.

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Promise<Response> | Response): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(url: string, key: string): any;
}
