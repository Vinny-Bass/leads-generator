#!/bin/bash

DIR_TO_WATCH=""
S3_BUCKET=""

for FILE in "$DIR_TO_WATCH"/*; do
  if [ -f "$FILE" ]; then
    aws s3 cp "$FILE" "$S3_BUCKET" && rm "$FILE"
  fi
done
sleep 5