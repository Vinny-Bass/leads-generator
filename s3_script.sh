#!/bin/bash
S3_BUCKET=""
DIR=""

while true; do
  for file in $(ls "$DIR"/output*.csv | sort -V)
  do
      if [[ $file =~ output([0-9]+).csv ]]; then
          base=${BASH_REMATCH[1]}
          next_version=$((base+1))
          next_file="${DIR}/output${next_version}.csv"
          if [ -f "$next_file" ]; then
              aws s3 cp "$file" "$S3_BUCKET"
              rm "$file"
          fi
      fi
  done
  sleep 5
done