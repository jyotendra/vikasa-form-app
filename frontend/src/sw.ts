import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

// to allow work offline
registerRoute(({ url }) => url.pathname.startsWith("/"), new NetworkFirst());

import { Queue } from "workbox-background-sync";

const queue = new Queue("apiQueue");

self.addEventListener("fetch", (event) => {
  // Add in your own criteria here to return early if this
  // isn't a request that should use background sync.
  if (event.request.method !== "POST") {
    return;
  }

  const bgSyncLogic = async () => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await queue.pushRequest({ request: event.request });
      return new Response(
        JSON.stringify({
          error: "Network request failed",
          message:
            "Your request has been saved and will be sent when you're back online.",
          queued: true,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 503, // Service Unavailable
          statusText: "Service Unavailable: Queued for background sync",
        }
      );
    }
  };

  event.respondWith(bgSyncLogic());
});

(self as any).skipWaiting();
clientsClaim();
