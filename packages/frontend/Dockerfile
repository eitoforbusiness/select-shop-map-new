FROM node:20-alpine

# 作業ディレクトリの設定
WORKDIR /app

# パッケージのインストール
COPY package*.json ./
RUN npm install && \
    npm install @react-google-maps/api @mui/material @emotion/react @emotion/styled axios @types/react @types/node @types/google.maps

# アプリケーションのファイルをコピー
COPY . .

# ポートの公開
EXPOSE 3000

# 開発サーバーの起動
CMD ["npm", "run", "dev"] 