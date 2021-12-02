#!/bin/bash
find ./ -iname '*.js' -type f -exec bash -c 'expand -t 2 "$0" | sponge "$0"' {} \;
find ./ -iname '*.tsx' -type f -exec bash -c 'expand -t 2 "$0" | sponge "$0"' {} \;
find ./ -iname '*.scss' -type f -exec bash -c 'expand -t 2 "$0" | sponge "$0"' {} \;

