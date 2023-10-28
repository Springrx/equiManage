# 拉取代码
1. 在 shell 里运行，后续命令也是
2. `git clone -b master xxx` (目前代码在master分支中)

# 配置环境
1. `node >= 16`
2. `npm >= 8.1.0`

# 安装依赖
## 安装 cnpm
`npm install -g cnpm@7.1.0`
## 安装依赖
`cnpm install`

# 开发
1. 启动 server 服务
2. 将 src/common/fetch.js 内的 HOST 改成 server host（一般是 http://localhost:7001）
3. 将 src/app/index.jsx 内 23 行代码注释掉 `window.location.href = '/login.html';`
4. `npm run dev`

# 部署
1.  将 src/common/fetch.js 内的 HOST 改成线上 server host
2.  将 src/app/index.jsx 内 23 行代码取消注释
3.  `npm run build`
4.  将 build 产生的 dist 文件夹里的静态文件进行部署(ydroid 阿里云服务器 /var/www/manage-page 目录下)
5.  将代码更新同步到 gitlab 中：`git push origin master`