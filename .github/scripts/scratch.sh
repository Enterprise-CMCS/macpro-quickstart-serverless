#!/usr/bin/env bash

start=82449735678d3abe75c5dd4652cd3158d9ae5d73
end1file=51d5b9ba30e4006f92efa41328e9201e04da6318
end4files=0ecd146cfbe9b9a66c864d1b211c87babd9d285d



diffList=$(git diff ${start}...${end4files} --name-only)
serviceList=()

for i in $diffList; do 
    echo $i
done

