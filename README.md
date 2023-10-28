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
1. 确认后端 server 服务启动
2. 确认 src/component/fetch.js axios函数内的url字段(在第10或第11行)值为url，而不是`${HOST}${url}`
3. 在 package.json 内添加proxy字段："proxy": "http://10.177.44.94:8081"
4. `npm start`

# 部署
1.  将 src/component/fetch.js axios函数内的url字段修改为`${HOST}${url}`
2.  删除 package.json 内的proxy字段
3.  `npm run build`
4.  将 build 产生的 dist 文件夹里的静态文件进行部署(ydroid 阿里云服务器 /var/www/userStudy 目录下)
5.  将代码更新同步到 gitlab 中：`git push origin master`