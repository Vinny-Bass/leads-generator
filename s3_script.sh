#!/bin/bash

source .env

DIR="./data"

if ! [[ $MAX_ROWS_PER_FILE =~ ^[0-9]+$ ]]; then
  echo "MAX_ROWS_PER_FILE is not set or not a number."
  exit 1
fi

for file in "$DIR"/*.csv
do
  if [ -f "$file" ]; then
    num_rows=$(wc -l < "$file")

    if [ "$num_rows" -ge "$MAX_ROWS_PER_FILE" ]; then
      aws s3 cp "$file" "$S3_LOCATION"
      rm "$file"
    fi
  fi
done
