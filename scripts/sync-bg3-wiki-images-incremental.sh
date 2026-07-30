#!/usr/bin/env bash

set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <markdown-file>" >&2
    exit 1
fi

SOURCE_FILE="$1"
set -- --incremental "$SOURCE_FILE"
. "$(dirname "$0")/sync-bg3-wiki-images.sh"
