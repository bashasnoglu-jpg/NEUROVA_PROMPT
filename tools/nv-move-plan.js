const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const AUDIT_JSON = path.join(ROOT, "_audit", "nv-audit.report.json");

function rel(p){ return p.replace(ROOT + path.sep, "").replaceAll("\\","/"); }
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

function isCopyName(name){
  const n = name.toLowerCase();
  return n.includes("kopya") || n.includes("copy") || n.includes(" - copy") || n.includes("(1)") || n.includes("(2)");
}
function hasSpaceDir(p){ return p.split("/").some(seg => seg.includes(" ")); }

function guessDomain(file){
  const f = file.toLowerCase();
  if (f.includes("neurova_prompt/")) return "PROMPT";
  if (f.includes("neurova_site/")) return "SITE";
  if (f.includes("prompt-library") || f.includes("packs/") || f.includes("prompts-loader") || f.includes("health-check")) return "PROMPT";
  return "UNKNOWN";
}

function targetFor(file){
  const domain = guessDomain(file);
  const name = path.posix.basename(file);

  if (domain === "PROMPT"){
    if (name.endsWith(".html")) return "NEUROVA_PROMPT/" + name;
    if (name.endsWith(".js")){
      if (name.startsWith("pack.") || name.includes("pack.")) return "NEUROVA_PROMPT/packs/" + name;
      if (file.includes("/tools/")) return file;
      return "NEUROVA_PROMPT/" + name;
    }
    if (name.endsWith(".css")) return "NEUROVA_PROMPT/assets/css/" + name;
    return "NEUROVA_PROMPT/assets/" + name;
  }

  if (domain === "SITE"){
    if (name.endsWith(".html")) return "NEUROVA_SITE/" + name;
    if (name.endsWith(".js")) return "NEUROVA_SITE/assets/js/" + name;
    if (name.endsWith(".css")) return "NEUROVA_SITE/assets/css/" + name;
    if (/\.(png|jpg|jpeg|webp|svg|gif)$/.test(name)) return "NEUROVA_SITE/assets/img/" + name;
    return "NEUROVA_SITE/assets/" + name;
  }

  if (name.includes("prompt") || name.includes("pack.") || name.includes("health-check")) return "NEUROVA_PROMPT/" + name;
  return file;
}

function safeRenameSuggestion(file){
  const dir = path.posix.dirname(file);
  let base = path.posix.basename(file);

  base = base.replace(/ - Kopya/gi, "");
  base = base.replace(/ - kopya/gi, "");
  base = base.replace(/kopya/gi, "");
  base = base.replace(/\s+/g, "-");
  base = base.replace(/--+/g, "-").replace(/-\./g,".").replace(/\.-/g,".");
  base = base.replace(/-$/,
 "");

  if (base === path.posix.basename(file)) return null;
  return dir + "/" + base;
}

function mkdirPS(dir){
  return `New-Item -ItemType Directory -Force -Path "${dir.replaceAll("/","\\")}" | Out-Null`;
}

function movePS(from, to){
  const f = from.replaceAll("/","\\");
  const t = to.replaceAll("/","\\");
  return `Move-Item -LiteralPath "${f}" -Destination "${t}" -Force`;
}

function main(){
  if (!exists(AUDIT_JSON)){
    console.error("Missing audit report:", rel(AUDIT_JSON));
    console.error("Run: node .\\tools\\nv-audit.js");
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(AUDIT_JSON, "utf8"));
  const files = [];

  const seen = new Set();
  function add(p){ if (p && !seen.has(p)) { seen.add(p); files.push(p); } }

  (audit.mustHave || []).forEach(x => add(x.path));
  (audit.duplicatesByName || []).forEach(d => (d.paths || []).forEach(add));
  (audit.htmlRefMissing || []).forEach(x => add(x.file));

  const IGNORE = new Set(["node_modules",".git",".vs",".vscode","dist","build",".cache"]);
  function walk(dir){
    const items = fs.readdirSync(dir, {withFileTypes:true});
    for (const it of items){
      const abs = path.join(dir, it.name);
      const rp = rel(abs);
      if (it.isDirectory()){
        const seg = it.name;
        if (IGNORE.has(seg)) continue;
        walk(abs);
      } else {
        add(rp);
      }
    }
  }
  walk(ROOT);

  const suggestions = [];
  const mkdirs = new Set();

  for (const f of files){
    if (f.startsWith("_audit/")) continue;
    if (f.startsWith("tools/")) continue;

    const name = path.posix.basename(f);
    const inBadSpacePath = hasSpaceDir(f);
    const copyLike = isCopyName(name);

    let proposed = f;

    const rn = safeRenameSuggestion(f);
    if (rn && (copyLike || inBadSpacePath)) proposed = rn;

    const tgt = targetFor(proposed);

    if (tgt !== f){
      const toDir = path.posix.dirname(tgt);
      mkdirs.add(toDir);
      suggestions.push({
        from: f,
        to: tgt,
        reason: [
          copyLike ? "copy_name" : null,
          inBadSpacePath ? "space_in_path" : null,
          (guessDomain(f) !== guessDomain(tgt)) ? "domain_align" : "structure_align"
        ].filter(Boolean)
      });
    }
  }

  const byFrom = new Map();
  for (const s of suggestions){
    if (!byFrom.has(s.from)) byFrom.set(s.from, s);
  }
  const final = [...byFrom.values()];

  const ps = [];
  ps.push('$ErrorActionPreference="Stop"');
  ps.push('# NV MOVE PLAN v1.0');
  ps.push('# 1) Creates needed folders');
  for (const d of [...mkdirs].sort()){
    ps.push(mkdirPS(d));
  }
  ps.push('');
  ps.push('# 2) Moves / renames');
  for (const s of final){
    ps.push(movePS(s.from, s.to));
  }
  ps.push('');
  ps.push('Write-Host "NV MOVE PLAN complete."');

  fs.mkdirSync(path.join(ROOT,"_audit"), {recursive:true});
  fs.writeFileSync(path.join(ROOT,"_audit","nv-move-plan.json"), JSON.stringify({timestamp:new Date().toISOString(), suggestions: final}, null, 2), "utf8");
  fs.writeFileSync(path.join(ROOT,"_audit","nv-move-plan.ps1"), ps.join("\n") + "\n", "utf8");

  const preview = [];
  preview.push("NV MOVE PLAN v1.0");
  preview.push("Suggestions: " + final.length);
  preview.push("");
  for (const s of final.slice(0, 80)){
    preview.push(`- ${s.from}  ->  ${s.to}   [${s.reason.join(", ")}]`);
  }
  if (final.length > 80) preview.push(`... (${final.length-80} more)`);
  fs.writeFileSync(path.join(ROOT,"_audit","nv-move-plan.preview.txt"), preview.join("\n") + "\n", "utf8");

  console.log(preview.join("\n"));
  console.log("\nSaved:");
  console.log(" - " + rel(path.join(ROOT,"_audit","nv-move-plan.json")));
  console.log(" - " + rel(path.join(ROOT,"_audit","nv-move-plan.ps1")));
  console.log(" - " + rel(path.join(ROOT,"_audit","nv-move-plan.preview.txt")));
}

main();
