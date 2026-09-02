# ============================================================
# Stage 1 — builder
# Installs all Python dependencies and pre-downloads the
# sentence-transformers model so the final image has zero
# download time at startup.
# ============================================================
FROM python:3.11-slim AS builder

WORKDIR /build

# System deps needed by torch, chromadb, psycopg2, onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    libglib2.0-0 \
    libssl-dev \
    libffi-dev \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a local prefix so we can copy them cleanly
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Pre-download the embedding model used by rag_pipeline.py
# The model lands in /root/.cache/huggingface — we'll copy that cache to Stage 2
COPY app/download_model.py /build/download_model.py
RUN PYTHONPATH=/install/lib/python3.11/site-packages \
    python /build/download_model.py


# ============================================================
# Stage 2 — runner (final image)
# Copies only the installed packages + cached model.
# No build tools, no compiler — lean and clean.
# ============================================================
FROM python:3.11-slim AS runner

WORKDIR /app

# Runtime-only system libs (no compilers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy HuggingFace model cache from builder (instant startup, no download)
COPY --from=builder /root/.cache /root/.cache

# Copy application source code
COPY . .

# Create the chroma_db mount point (volume will be attached here at runtime)
RUN mkdir -p /app/chroma_db

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
