import { clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
// if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(({ url }) => url.pathname.startsWith("/"), new NetworkFirst());

(self as any).skipWaiting();
clientsClaim();
