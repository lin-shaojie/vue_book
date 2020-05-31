
## 简介
[校园图书管理图书系统](https://book.poetrycode.top/)采用了[vue-element-admin](https://panjiachen.github.io/vue-element-admin)框架，这是一个校园图书管理的中后台系统。它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element)实现。它使用了最新的前端技术栈，内置了 i18n 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型。

## 主要技术栈

```
Vue
基于 Vue 2.6 框架开发。

Node
服务端使用 Node 进行开发，配合 Express 快速完成开发

MySQL
服务端使用 MySQL 数据库存储数据

Nginx
使用 Nginx 进行静态资源管理
```

## 其他技术栈

```
前端
- vue-element-admin：基于知名开源项目定制开发
- element-ui：基于饿了么的 element-ui 组件库
- axios：基于 axios 发送网络请求
- driver.js：基于 driver.js 实现用户引导

后端
- jsonwebtoken：使用 JWT 进行登录认证
- multer：使用 Express 官方的 multer 进行文件上传
- adm-zip：使用 adm-zip 解压 epub 电子书
- epub：使用 epub 库完成电子书解析
- crypto：使用 crypto 完成密码的 MD5 加密

```
## 功能

```
- 登录 / 注销
  - JWT登录认证
  - MD5加密
  - 权限配置

- 上传图书
  - 新增/编辑/删除电子书
  - 引导页，引导上传电子书的步骤。
  - 电子书的解析

- 图书列表
  - 电子书的搜索查询
  - 根据图书列表信息导出excel，cxv,txt文件

```

## 开发

```bash
# 克隆项目
git clone https://github.com/lin-shaojie/vue_book.git

# 进入项目目录
cd vue-element-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```


浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

- 如需找到一些相应ebub电子书进行上传，这里主要有推荐几个毕竟好的网站，可以根据需要自行下载。
[epubw](https://epubw.com/)， [超级书库](https://shuayouxi.cn/)，[鸠摩搜书](https://www.jiumodiary.com/)。
- 后端访问API可以在`.env.production`文件自行修改。

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
