#!/bin/sh
set -e ${DEBUG:+-x}

echo >&3 "=> Wait for LabelStudio to be available..."

timeout 90 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' app 8080
