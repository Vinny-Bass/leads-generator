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
      aws s3 cp "$file" "s3://leads-892ec6b2-ea0e-4f8d-ad32-690bc209d3ac"
      rm "$file"
    fi
  fi
done
