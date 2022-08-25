#!/usr/bin/env bash

start=82449735678d3abe75c5dd4652cd3158d9ae5d73
end1file=51d5b9ba30e4006f92efa41328e9201e04da6318
end4files=0ecd146cfbe9b9a66c864d1b211c87babd9d285d

services=(
  'database'
  'uploads'
  'app-api'
  'proxy-api'
  'stream-functions'
  'ui'
  'ui-auth'
  'ui-src'
)

diffList=$(git diff ${start}...${end4files} --name-only)
diffList+=("package.json")
serviceList=()

allFlag=false;

for i in $diffList; do 
    serviceFound=false;
    for j in "${services[@]}" ; do
        if [[ "$i" == *"services/${j}/"* ]]; then
            echo $i;
            serviceList+=($j);
            serviceFound=true;
        fi
    done
    if [[ $serviceFound == false ]]; then 
        allFlag=true
    fi
done

if [[ $allFlag == true ]]; then
    echo "in allflag if"
    serviceList+=(${services[@]})
fi

echo "${serviceList[@]}"

uniques=($(for v in "${serviceList[@]}"; do echo "$v";done| sort| uniq| xargs))
echo "${uniques[@]}"