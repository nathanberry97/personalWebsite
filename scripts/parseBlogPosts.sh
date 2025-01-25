#!/bin/bash

cd ./posts

for entry in *
do
  if [[ "${entry}" =~ \.md ]]; then
    pandoc \
        -s ./${entry} \
        --template ../templates/blogPosts.html \
        -c ../css/style.css \
        -c ../css/blogPost.css \
        -o ../static/blog/${entry%.*}.html \
        --metadata pagetitle="Nathan Berry"
  fi
done
