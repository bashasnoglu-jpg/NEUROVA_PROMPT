from pathlib import Path

path = Path("prompt-library.html")
text = path.read_text(encoding="utf-8")

start = text.index("<h1>")
end = text.index('<div class="muted">', start)

new_block = """        <h1 class="library-heading">NEUROVA İstek Kütüphanesi</h1>
        <p class="library-subtitle">
            Prompt Library<br />
            <small>Request Library (Prompt Library)</small>
        </p>
"""

text = text[:start] + new_block + text[end:]
path.write_text(text, encoding="utf-8")
