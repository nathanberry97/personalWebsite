#!/bin/bash

cd ./blog

for entry in *
do
  if [[ "${entry}" =~ \.md ]]; then
    pandoc \
        -s ./${entry} \
        --template ./template.html \
        -c ../css/style.css \
        -c ../css/blogPost.css \
        -o ../src/blog/${entry%.*}.html \
        --metadata pagetitle="Nathan Berry"
  fi
done
