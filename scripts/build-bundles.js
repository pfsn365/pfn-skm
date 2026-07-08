/**
 * Builds the 3 PFN tool JS bundles the same way the parent skm repo does
 * (webpack.build.js -> MergeIntoSingleFilePlugin + a minify transform): each
 * bundle is a single source fragment written to one file. No babel, no webpack
 * module wrapper — top-level declarations stay global, which the tools rely on
 * (inline onclick="fn()" handlers).
 *
 * Modes:
 *   node scripts/build-bundles.js            production build (minified, terser)
 *   node scripts/build-bundles.js --dev      dev build (unminified, readable)
 *   node scripts/build-bundles.js --watch    dev build + rebuild on source change
 *
 * We use terser (uglify's maintained successor) for minification because the
 * current sources contain a sloppy-mode `delete <localVar>` that uglify-js
 * rejects but terser/browsers accept. Minified output matches the CDN bundle
 * format (e.g. `var rounds,executionRate;...`).
 *
 * Output: js/production/pfn-proxy/<name>-bundle.js  (the path dev-config.php /
 * config.php point the *_SCRIPT_LOCATION constants at).
 */
const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "js/production/pfn-proxy");
const SRC_DIR = path.join(ROOT, "js/fragments");

const BUNDLES = {
  "mockdraft-simulator-bundle.js": "mockdraft-simulator.js",
  "ultimate-simulator-bundle.js": "ultimate-simulator.js",
  "playoff-predictor-bundle.js": "playoff-predictor.js",
};

const WATCH = process.argv.includes("--watch");
// --watch implies a dev (unminified) build so you get readable, line-accurate
// output while iterating; --dev forces it for a one-shot build too.
const DEV = WATCH || process.argv.includes("--dev");

async function buildOne(outName, srcFile) {
  const code = fs.readFileSync(path.join(SRC_DIR, srcFile), "utf8");
  let out = code;
  if (!DEV) {
    const result = await minify(code);
    if (result.error) {
      console.error(`ERROR minifying ${srcFile}:`, result.error);
      return false;
    }
    out = result.code;
  }
  fs.writeFileSync(path.join(OUT_DIR, outName), out);
  console.log(`built ${outName}  (${(out.length / 1024).toFixed(1)} KiB${DEV ? ", dev/unminified" : ""})`);
  return true;
}

async function buildAll() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = true;
  for (const [outName, srcFile] of Object.entries(BUNDLES)) {
    if (!(await buildOne(outName, srcFile))) ok = false;
  }
  return ok;
}

(async () => {
  const ok = await buildAll();

  if (!WATCH) {
    process.exit(ok ? 0 : 1);
    return;
  }

  const srcToOut = {};
  for (const [outName, srcFile] of Object.entries(BUNDLES)) srcToOut[srcFile] = outName;

  console.log("\nwatching js/fragments/ for changes (Ctrl+C to stop)...");
  let timer = null;
  const pending = new Set();
  const flush = async () => {
    timer = null;
    const files = [...pending];
    pending.clear();
    for (const f of files) await buildOne(srcToOut[f], f);
  };
  fs.watch(SRC_DIR, (_event, filename) => {
    if (!filename || !srcToOut[filename]) return;
    pending.add(filename);
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 150); // debounce noisy fs events
  });
})();
