FROM node:18.15.0-bullseye-slim

RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    curl \
    git \
    wget \
    sudo \
    neofetch \
    && apt-get upgrade -y

RUN mkdir E1
WORKDIR /E1
COPY . /E1
EXPOSE 3000 4000 5000 10000 443 80

CMD ["bash", "mongo.sh"]
