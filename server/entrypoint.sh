#!/bin/bash
set -e

npx drizzle-kit migrate
npm run start