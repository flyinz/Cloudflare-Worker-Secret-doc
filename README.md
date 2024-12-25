# Cloudflare Worker Secret doc
秘密文档是一款极简、开源的在线文档。
## 功能

- 阅后即焚
- 自定义分享链接路径、长度
- 简单防扫描3秒盾

## 使用方法

1. 访问 [Cloudflare](https://www.cloudflare.com) - Workers和Pages - 创建 - 创建Workers，名称保持默认或者随意设置，点击部署，然后编辑代码，把原来的代码删除，然后把仓库里 `Worker_Secret_doc.js` 的内容复制并粘贴到代码处，点击部署；
2. 如果想自定义分享路径、分享ID类型等；见代码头部的注释；
3. 新建一个KV，名称随意，进入刚才新建的workers，点击设置 - 绑定 - 添加 - KV命名空间，变量名称填 `Worker_Secret_doc` 找到刚新建的KV，KV命名空间选择刚才创建的KV，点击保存即可使用Cloudflare提供的默认域名访问；
4. 自定义域名：添加域名到Cloudflare后，Workers和Pages - 找到秘密文档的 workers - 设置 - 域和路由 -自定义域，添加自己域名即可；例如：你的域名是 doc.com 那么可以添加 mimi.doc.com ；
5. 阻止恶意访问需要在Cloudflare防火墙设置规则；
6. 如果想删数据，进入KV按文档ID删除，或者删除整个KV。

## 已知问题

带预览链接功能的即时通讯软件、邮件，会导致链接被机器访问而失效，解决方法是用Cloudflare防火墙把它们拦截下来（根据UA、地区等）。
