const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(["node_modules",".git",".vs",".vscode","dist","build",".cache"]);
const MUST_HAVE = [
  "NEUROVA_SITE/index.html",
  "NEUROVA_PROMPT/prompt-library.html",
  "NEUROVA_PROMPT/app.js",
  "NEUROVA_PROMPT/packs"
];

function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

function walk(dir, out){
  const items = fs.readdirSync(dir, { withFileTypes:true });
  for (const it of items){
    if (it.isDirectory()){
      if (IGNORE_DIRS.has(it.name)) continue;
      walk(path.join(dir,it.name), out);
    } else {
      out.push(path.join(dir,it.name));
    }
  }
  return out;
}

function readTextSafe(fp){
  try { return fs.readFileSync(fp, "utf8"); } catch { return ""; }
}

function rel(fp){ return fp.replace(ROOT + path.sep, "").replaceAll("\\","/"); }

function findRefsInHtml(html){
  const refs = [];
  const re1 = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  const re2 = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const m of html.matchAll(re1)) refs.push(m[1]);
  for (const m of html.matchAll(re2)) refs.push(m[1]);
  return refs.filter(x => x && !x.startsWith("http") && !x.startsWith("data:") && !x.startsWith("#"));
}

function resolveRef(baseFile, ref){
  if (ref.startsWith("/")) return path.join(ROOT, ref.replace(/^\//,""));
  return path.resolve(path.dirname(baseFile), ref);
}

function main(){
  const report = {
    timestamp: new Date().toISOString(),
    root: ROOT,
    mustHave: [],
    counts: {},
    problems: [],
    duplicatesByName: [],
    htmlRefMissing: [],
    promptPackSignals: []
  };

  for (const p of MUST_HAVE){
    const abs = path.join(ROOT, p);
    report.mustHave.push({ path: p, ok: exists(abs) });
    if (!exists(abs)) report.problems.push({ type:"missing_required", path:p });
  }

  const files = walk(ROOT, []).map(f => rel(f));
  report.counts.totalFiles = files.length;
  report.counts.html = files.filter(f=>f.toLowerCase().endsWith(".html")).length;
  report.counts.js   = files.filter(f=>f.toLowerCase().endsWith(".js")).length;
  report.counts.css  = files.filter(f=>f.toLowerCase().endsWith(".css")).length;

  const byName = new Map();
  for (const f of files){
    const name = path.posix.basename(f);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(f);
  }
  for (const [name, arr] of byName.entries()){
    if (arr.length >= 2 && (name.endsWith(".html") || name.endsWith(".js") || name.endsWith(".css"))){
      report.duplicatesByName.push({ name, paths: arr });
    }
  }

  const htmlFiles = files.filter(f=>f.toLowerCase().endsWith(".html"));
  for (const hf of htmlFiles){
    const abs = path.join(ROOT, hf);
    const txt = readTextSafe(abs);
    const refs = findRefsInHtml(txt);
    for (const r of refs){
      const target = resolveRef(abs, r);
      if (!exists(target)){
        report.htmlRefMissing.push({ file: hf, ref: r, resolvedTo: rel(target) });
      }
    }
  }

  const pl = path.join(ROOT, "NEUROVA_PROMPT/prompt-library.html");
  if (exists(pl)){
    const t = readTextSafe(pl);
    const hasPackList = /NV_PACK_LIST/.test(t);
    const hasManifest = /manifest\.json/.test(t) || /manifest\s*:\s*/.test(t);
    report.promptPackSignals.push({ file:"NEUROVA_PROMPT/prompt-library.html", hasPackList, hasManifest });
  } else {
    report.promptPackSignals.push({ file:"NEUROVA_PROMPT/prompt-library.html", ok:false });
  }

  fs.mkdirSync(path.join(ROOT,"_audit"), { recursive:true });
  const jsonPath = path.join(ROOT,"_audit","nv-audit.report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");

  const summary = [];
  summary.push("NV_AUDIT v1.0");
  summary.push("Root: " + ROOT);
  summary.push("Files: " + report.counts.totalFiles + ` (html=${report.counts.html}, js=${report.counts.js}, css=${report.counts.css})`);
  const missReq = report.problems.filter(p=>p.type==="missing_required").length;
  summary.push("Missing required: " + missReq);
  summary.push("HTML missing refs: " + report.htmlRefMissing.length);
  summary.push("Duplicate filenames: " + report.duplicatesByName.length);
  const txtPath = path.join(ROOT,"_audit","nv-audit.summary.txt");
  fs.writeFileSync(txtPath, summary.join("\n") + "\n", "utf8");

  console.log(summary.join("\n"));
  console.log("\nSaved:");
  console.log(" - " + rel(jsonPath));
  console.log(" - " + rel(txtPath));
}

main();
