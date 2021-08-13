#!/bin/sh

set -eux

cd "$(dirname "$0")/.."

zip -r \
  upload.zip \
  manifest.json \
  background.js \
  move.js \
  images

