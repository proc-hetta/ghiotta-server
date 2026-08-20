// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AuthorizedDevice } from "$lib/server/db/authorized-devices";

// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      authorizedDevice: AuthorizedDevice?;
    }
  }
}

export {};
