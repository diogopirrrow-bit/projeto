#!/usr/bin/env python3
"""Create the offline presentation from the editable sources; Python stdlib only.

Run from any directory: python3 /path/to/projeto/tools/build_standalone.py
The source files remain unchanged. Rebuild after editing HTML, CSS, JS or assets.
"""

from __future__ import annotations

import base64
import mimetypes
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "Surf_Point_Abrir.html"
MIME_OVERRIDES = {".woff2": "font/woff2", ".svg": "image/svg+xml"}
ASSET_PATH = re.compile(r"(?<![A-Za-z0-9_./-])(assets/[A-Za-z0-9_./-]+)")


def data_url(relative_path: str) -> str:
    path = (ROOT / relative_path).resolve()
    if not path.is_relative_to(ROOT / "assets") or not path.is_file():
        raise ValueError(f"Missing or unsafe local asset: {relative_path}")
    mime = MIME_OVERRIDES.get(path.suffix) or mimetypes.guess_type(path.name)[0]
    if not mime:
        raise ValueError(f"Unknown MIME type: {relative_path}")
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def embed_assets(source: str) -> str:
    # Cache within this source: repeated references reuse the same encoded value.
    encoded = {name: data_url(name) for name in set(ASSET_PATH.findall(source))}
    return ASSET_PATH.sub(lambda match: encoded[match[1]], source)


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = embed_assets((ROOT / "style.css").read_text(encoding="utf-8"))
    script = embed_assets((ROOT / "app.js").read_text(encoding="utf-8"))
    # HTML raw-text elements need escaped closing tags inside strings/comments.
    script = re.sub(r"</script", r"<\\/script", script, flags=re.IGNORECASE)
    css = re.sub(r"</style", r"<\\/style", css, flags=re.IGNORECASE)
    html, css_count = re.subn(
        r'<link\b(?=[^>]*\brel=["\']stylesheet["\'])(?=[^>]*\bhref=["\']style\.css["\'])[^>]*>',
        lambda _: f"<style>\n{css}\n</style>", html,
    )
    html, script_count = re.subn(
        r'<script\b[^>]*\bsrc=["\']app\.js["\'][^>]*>\s*</script>', "", html,
    )
    if css_count != 1 or script_count != 1:
        raise ValueError("Expected exactly one style.css link and one app.js script.")
    html = embed_assets(html)
    # A deferred external script runs after DOM parsing. An inline script at the
    # end of body preserves that order without modules, fetch or a local server.
    html = html.replace("</body>", f"<script>\n{script}\n</script>\n</body>")
    licenses = []
    for path in sorted((ROOT / "assets/fonts").glob("LICENSE-*.txt")):
        licenses.append(path.name + "\n" + path.read_text(encoding="utf-8"))
    notice = (
        "\n<!--\nSurf Point: autonomous demonstration, generated from editable sources.\n"
        "Font files are unchanged. Original license files are also supplied in assets/fonts/.\n"
        "The following notices remain embedded so this HTML can be shared independently.\n\n"
        + "\n\n".join(licenses).replace("-->", "-- >") + "\n-->\n"
    )
    html = html.replace("</html>", notice + "</html>")
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Created {OUTPUT.name} ({OUTPUT.stat().st_size:,} bytes). Sources unchanged.")


if __name__ == "__main__":
    main()
