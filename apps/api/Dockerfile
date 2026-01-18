FROM python:3.12-slim

WORKDIR /app

# system deps for building C++ and psycopg
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake ninja-build \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# copy monorepo
COPY . .

# install uv
RUN pip install --no-cache-dir uv

# build matching engine (Linux .so)
RUN cmake -S engine/matching_engine -B engine/matching_engine/build -G Ninja -DCMAKE_BUILD_TYPE=Release \
 && cmake --build engine/matching_engine/build

# Tell python wrapper where the shared lib is
ENV MATCHING_ENGINE_LIB=/app/engine/matching_engine/build/libmatching_engine.so

# install python deps (api + local matching-engine source)
WORKDIR /app/apps/api
RUN uv sync --frozen=false

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
