import json
from pathlib import Path

data = json.loads(Path("_audit/nv-audit.report.json").read_text(encoding="utf-8"))

payload = {
    "mustHave": data.get("mustHave", []),
    "htmlRefMissing": data.get("htmlRefMissing", []),
    "duplicatesByName": data.get("duplicatesByName", []),
}

print(json.dumps(payload, indent=2, ensure_ascii=False))
