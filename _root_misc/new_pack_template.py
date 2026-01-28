import argparse
import json
from pathlib import Path

ROOT = Path(__file__).parent
PACKS_DIR = ROOT / "SANTIS_PROMPT" / "packs"
MANIFEST = PACKS_DIR / "manifest.json"


def load_manifest():
    with MANIFEST.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_manifest(entries):
    entries = sorted(set(entries))
    with MANIFEST.open("w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)
        f.write("\n")


def create_pack_file(filename, key):
    filepath = PACKS_DIR / filename
    if filepath.exists():
        raise FileExistsError(f"{filepath} already exists")

    tmpl = f"""// packs/{filename}
(function () {{
    "use strict";

    const KEY = "{key}";
    const entries = [
        {{
            id: "{key}_01",
            category: "CATEGORY",
            role: "Therapist",
            title: "TITLE",
            tags: ["tag"],
            safeNote: {{
                tr: "Referans: docs/STYLE_GUIDE.md – Safe Note kuralları doğrultusunda yazın.",
                en: "Reference: docs/STYLE_GUIDE.md – follow the Safe Note guardrails."
            }},
            lang: {{
                tr: "",
                en: ""
            }}
        }}
    ];

    window.NV_PROMPT_PACKS = window.NV_PROMPT_PACKS || {{}};
    window.NV_PROMPT_PACKS[KEY] = window.NV_PROMPT_PACKS[KEY] || [];
    window.NV_PROMPT_PACKS[KEY].push(...entries);
})();
"""
    filepath.write_text(tmpl, encoding="utf-8")
    return filepath


def main():
    parser = argparse.ArgumentParser(description="Create a new pack template and register it")
    parser.add_argument("name", help="plain pack name (without extension, e.g. 'spa')")
    parser.add_argument("--key", help="pack key (defaults to name uppercased)")
    args = parser.parse_args()

    name = args.name.replace("pack.", "").lower()
    key = (args.key or name).upper()
    filename = f"pack.{name}.js"

    manifest = load_manifest()
    if filename in manifest:
        raise SystemExit(f"{filename} already listed in manifest")

    create_pack_file(filename, key)
    manifest.append(filename)
    save_manifest(manifest)
    print(f"Created {filename} with key {key} and appended to {MANIFEST}")


if __name__ == "__main__":
    main()
