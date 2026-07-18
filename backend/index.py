"""
Vercel serverless entrypoint. Vercel's Python builder loads this
file directly and does not add its own directory to sys.path, so
we do that explicitly here before importing the real app — this
lets app/main.py's existing `from app.api.routes import ...` style
absolute imports resolve exactly as they do when run normally via
`uvicorn app.main:app` from within backend/.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.main import app  # noqa: E402
