#!/bin/bash

exec nginx -g 'daemon off;' &
cd /api
NODE_ENV=production PAYLOAD_CONFIG_PATH=dist/payload.config.js npm run start 2>&1| tee /npm-logs.txt

