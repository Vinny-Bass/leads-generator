#!/bin/bash

source .env

DIR="./data"

for file in "$DIR"/*.csv
do
  num_rows=$(wc -l < "$file")
  echo $num_rows

  if [ "$num_rows" -ge "$MAX_ROWS_PER_FILE" ]; then
    aws s3 cp "$file" "s3://leads-892ec6b2-ea0e-4f8d-ad32-690bc209d3ac"
    rm $file
  fi
done
