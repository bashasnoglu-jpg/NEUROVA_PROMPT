import os
import re
import sys
from pathlib import Path

# =========================================
# NEUROVA CI PRE-DEPLOY CHECKLIST
# Enforces ULTRA MEGA PROMPT v1.0 Rules
# =========================================

ROOT_DIR = Path(".")
HTML_EXT = ".html"
TEXT_EXTS = {".html", ".css", ".js", ".json", ".md", ".txt", ".xml", ".svg"}

# Rule 8: Mojibake patterns
MOJIBAKE_PATTERNS = [
    "Ä±", "Ä°", "ÅŸ", "Åž", "ÄŸ", "Äž", "Ã§", "Ã‡", "Ã¶", "Ã–", "Ã¼", "Ãœ",
    "â€™", "â€œ", "â€", "â€“", "â€”"
]

def check_encoding_and_mojibake(filepath):
    errors = []
    try:
        raw = filepath.read_bytes()
        if b"\0" in raw: # Binary
            return []
        
        content = raw.decode("utf-8")
        
        # Check Mojibake
        for pat in MOJIBAKE_PATTERNS:
            if pat in content:
                errors.append(f"Rule 8: Mojibake detected: '{pat}'")
                break 
                
    except UnicodeDecodeError:
        errors.append("Rule 8: File is not valid UTF-8")
    except Exception as e:
        errors.append(f"Error reading file: {e}")
        
    return errors

def check_html_rules(filepath):
    errors = []
    try:
        content = filepath.read_text(encoding="utf-8")
    except:
        return [] 

    # Skip partials if they don't have body (e.g. nav.html)
    has_body = "<body" in content
    
    if has_body:
        # Rule 2.1: body data-page
        if not re.search(r"<body[^>]*data-page=[\"'][^\"']+[\"']", content, re.IGNORECASE):
            errors.append("Rule 2.1: <body> missing 'data-page' attribute")

    # Rule 3.1: section data-section
    # Find all section tags
    # We use a simple regex that might match across lines
    section_tags = re.finditer(r"<section([^>]*)>", content, re.IGNORECASE)
    
    for match in section_tags:
        attrs = match.group(1)
        if "data-section=" not in attrs:
            errors.append(f"Rule 3.1: <section> missing 'data-section' attribute")
        
        # Rule 5.1: Check for nv-wa section compliance
        if 'id="nv-wa"' in attrs or "id='nv-wa'" in attrs:
            if 'data-section="nv-wa"' not in attrs and "data-section='nv-wa'" not in attrs:
                 errors.append("Rule 5.1: <section id='nv-wa'> must have data-section='nv-wa'")

    # Rule 5.2: Forbidden ID
    if 'id="reservation"' in content or "id='reservation'" in content:
        errors.append("Rule 5.2: id='reservation' is FORBIDDEN. Use id='nv-wa'.")

    # Rule 8: Duplicate IDs
    ids = re.findall(r'\bid=["\']([^"\']+)["\']', content)
    seen = set()
    duplicates = set()
    for i in ids:
        if i in seen:
            duplicates.add(i)
        seen.add(i)
    
    if duplicates:
        errors.append(f"Rule 8: Duplicate IDs found: {', '.join(duplicates)}")

    return errors

def main():
    print("🚀 NEUROVA CI PRE-DEPLOY CHECKLIST (ULTRA MEGA PROMPT v1.0)")
    print("===========================================================")
    
    failed = False
    checked_count = 0
    
    # Exclude list
    exclude_dirs = {".git", "node_modules", "dist", "build", "__pycache__", ".venv", "venv"}
    
    for root, dirs, files in os.walk(ROOT_DIR):
        # Modify dirs in-place to skip
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in files:
            filepath = Path(root) / file
            if filepath.name == "ci_pre_deploy.py": continue
            if filepath.name == "fix_tr_chars.py": continue
            
            ext = filepath.suffix.lower()
            file_errors = []
            
            # Encoding Check
            if ext in TEXT_EXTS:
                file_errors.extend(check_encoding_and_mojibake(filepath))
            
            # HTML Structure Check
            if ext == HTML_EXT:
                file_errors.extend(check_html_rules(filepath))
            
            if file_errors:
                failed = True
                print(f"\n❌ {filepath}")
                for err in file_errors:
                    print(f"   - {err}")
            
            checked_count += 1

    print(f"\n-----------------------------------------------------------")
    if failed:
        print(f"💥 DEPLOY BLOCKED. Fix errors above.")
        sys.exit(1)
    else:
        print(f"✅ ALL CHECKS PASSED ({checked_count} files scanned). Ready for deploy.")
        sys.exit(0)

if __name__ == "__main__":
    main()