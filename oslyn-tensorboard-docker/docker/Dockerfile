ARG UBUNTU_VERSION=18.04
FROM ubuntu:${UBUNTU_VERSION} as base
LABEL maintainer="Dom Fung <dominic.fung@icloud.com>"

#ARG S3_ACCESS_KEY
#RUN test -n "$S3_ACCESS_KEY" || (echo "S3_ACCESS_KEY not set" && false)

#ARG S3_SECRET_KEY
#RUN test -n "$S3_SECRET_KEY" || (echo "S3_SECRET_KEY not set" && false)

#RUN echo  "[default]\n" \
#          "aws_access_key_id=$S3_ACCESS_KEY\n" \
#          "aws_secret_access_key=$S3_SECRET_KEY" > ~/.aws/credentials

RUN apt-get update && apt-get install -y curl
# See http://bugs.python.org/issue19846
ENV LANG C.UTF-8

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip

RUN python3 -m pip --no-cache-dir install --upgrade \
    "pip<20.3" \
    setuptools

# Some TF tools expect a "python" binary
RUN ln -s $(which python3) /usr/local/bin/python

ARG TF_PACKAGE=tensorboard
ARG TF_PACKAGE_VERSION=
RUN python3 -m pip install --no-cache-dir ${TF_PACKAGE}${TF_PACKAGE_VERSION:+==${TF_PACKAGE_VERSION}}

RUN python3 -m pip install --no-cache-dir boto3