main() {
    login_ecr
    build_container_image
    tag_container_image
    push_container_image
}

login_ecr() {
    aws ecr get-login-password --region ${REGION} \
        | podman login --username AWS --password-stdin ${ACCOUNT_NUM}.dkr.ecr.${REGION}.amazonaws.com
}

build_container_image() {
    podman build -t nasa_apod_html .
}

tag_container_image() {
    podman tag nasa_apod_html ${ACCOUNT_NUM}.dkr.ecr.${REGION}.amazonaws.com/nasa_apod_html:nasa_apod_html
}

push_container_image() {
    podman push ${ACCOUNT_NUM}.dkr.ecr.${REGION}.amazonaws.com/nasa_apod_html:nasa_apod_html
}

main
