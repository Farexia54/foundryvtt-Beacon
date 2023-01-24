// only required for dev
// in prod, foundry loads index.js, which is compiled by vite/rollup
// in dev, foundry loads index.js, this file, which loads Beacon.ts

window.global = window;
import * as Beacon from "./Beacon.ts";
