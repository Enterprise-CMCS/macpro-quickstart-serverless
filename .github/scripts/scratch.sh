#!/usr/bin/env bash

start=82449735678d3abe75c5dd4652cd3158d9ae5d73
end=51d5b9ba30e4006f92efa41328e9201e04da6318

diffList=$(git diff ${start}...${end} --name-only)

echo "$diffList"