# drift-vue

## 配置环境变量

在本地开发时，需在本机配置后端地址：

```bash
export DRIFT_BACKEND_ADDRESS=localhost:8000
```

## 本地开发

第一次开发时，先使用以下命令获取依赖：

```bash
npm install
# 或者
cnpm install 
```

获取完依赖之后，在本地调试：
```bash
npm run serve
```

本代码只是前端代码，还需要启动后端服务：
```bash
git clone https://github.com/xujiyou-drift/drift.git
cd drift
operator-sdk run local
```

## 部署

最终需要运行在 k8s 之上。
构建新镜像：
```bash
sh build.sh
```



