#!/bin/bash

exec nginx -g 'daemon off;' &
cd /api
NODE_ENV=production npm run start 2>&1| tee /npm-logs.txt

