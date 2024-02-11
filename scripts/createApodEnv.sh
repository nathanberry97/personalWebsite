#!/bin/bash

touch ./apod/.testenv
echo "NASA_API_KEY='${NASA_API_KEY}'" > ./apod/.env
echo "S3_BUCKET='nathanberry.co.uk'" >> ./apod/.env
echo "AWS_REGION='eu-west-2'" >> ./apod/.env
