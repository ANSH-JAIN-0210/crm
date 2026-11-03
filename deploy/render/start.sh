#!/bin/sh
set -eu

export NODE_PORT="${PORT:-3000}"
export SERVER_URL="${SERVER_URL:-${RENDER_EXTERNAL_URL:-}}"
: "${SERVER_URL:?SERVER_URL must be set}"
: "${PG_DATABASE_URL:?PG_DATABASE_URL must be set}"
: "${REDIS_URL:?REDIS_URL must be set}"

cd /app/packages/twenty-server

if [ "${CRM_PROCESS:-web}" = "all" ]; then
  export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=192}"
  exec /app/entrypoint.sh node /app/render-run-all.cjs
fi

if [ "${CRM_PROCESS:-web}" = "worker" ]; then
  export DISABLE_DB_MIGRATIONS=true
  export DISABLE_CRON_JOBS_REGISTRATION=true
  attempts=0
  until curl --fail --silent --max-time 5 "${SERVER_URL%/}/healthz" >/dev/null; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge 180 ]; then
      echo 'Web service did not become healthy; worker startup aborted.' >&2
      exit 1
    fi
    sleep 5
  done
  exec /app/entrypoint.sh yarn worker:prod
fi

exec /app/entrypoint.sh node dist/main
