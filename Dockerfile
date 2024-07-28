FROM amazonlinux

RUN yum update -y \
    && yum install -y libatomic1 python3 nginx tar

COPY nginx.conf /etc/nginx/nginx.conf
ADD /start.sh /etc/start.sh

# See SO 36399848
ENV NODE_VERSION=20.12.2
ENV NVM_DIR=/usr/local/.nvm

RUN mkdir $NVM_DIR

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="$NVM_DIR/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version
ENV NODE_ENV=production

RUN mkdir /app
COPY /frontend/dist /app

RUN mkdir /api
COPY /backend /api
WORKDIR /api
RUN touch .env
RUN npm install
RUN npm run build

EXPOSE 80/tcp
EXPOSE 80/udp

RUN chmod +x /etc/start.sh

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["/etc/start.sh"]
