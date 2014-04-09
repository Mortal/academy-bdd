from .base import *

try:
    from .local import *
except ImportError:
    import logging
    logging.warning("No local config for Academy found")
