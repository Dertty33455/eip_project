"""
Test settings — uses SQLite in-memory so tests can run without PostgreSQL.
"""

from bookshell_backend.settings import *  # noqa: F401, F403

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
