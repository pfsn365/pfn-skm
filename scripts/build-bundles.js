/**
 * Builds the 3 PFN tool JS bundles the same way the parent skm repo does
 * (webpack.build.js -> MergeIntoSingleFilePlugin + a minify transform): each
 * bundle is a single source fragment minified into one file. No babel, no
 * webpack module wrapper — top-level declarations stay global, which the tools
 * rely on (inline onclick="fn()" handlers).
 *
 * The parent uses uglify-js; we use terser (uglify's maintained successor,
 * functionally identical output) because the current sources contain a
 * sloppy-mode `delete <localVar>` that uglify-js rejects but browsers/terser
 * accept. Output matches the CDN bundle format (e.g. `var rounds,executionRate;...`).
 *
 * Output: js/production/pfn-proxy/<name>-bundle.js
 * At runtime the app loads the CDN copies via the *_SCRIPT_LOCATION constants
 * in config.php; rebuild + deploy these if the source changes.
 */
const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "js/production/pfn-proxy");

const BUNDLES = {
  "mockdraft-simulator-bundle.js": "js/fragments/mockdraft-simulator.js",
  "ultimate-simulator-bundle.js": "js/fragments/ultimate-simulator.js",
  "playoff-predictor-bundle.js": "js/fragments/playoff-predictor.js",
};

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let failed = false;

  for (const [outName, src] of Object.entries(BUNDLES)) {
    const code = fs.readFileSync(path.join(ROOT, src), "utf8");
    const result = await minify(code);
    if (result.error) {
      console.error(`ERROR minifying ${src}:`, result.error);
      failed = true;
      continue;
    }
    fs.writeFileSync(path.join(OUT_DIR, outName), result.code);
    console.log(`built ${outName}  (${(result.code.length / 1024).toFixed(1)} KiB)`);
  }

  process.exit(failed ? 1 : 0);
})();
