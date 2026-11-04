# 中文阅读路线

先确定正在研究哪一层，再选择资料。以下是本站编写的阅读建议，供组织笔记与实验顺序使用。每条路线都可以回到[统一搜索](index.md)，输入中文或英文技术名继续查找。

## 侦察与通用

先画出资产、入口、协议与身份的关系，再按边界拆分测试范围。把观察到的事实与待验证的假设分开记录：端口开放是事实，服务可被利用则仍需验证。每条线索保留来源、时间与适用条件，避免后续把过期结果当作现状。

**阅读顺序：** [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) → [HackTricks 中文目录](hacktricks.md)。

**检索词：** 信息收集、侦察、DNS、recon、LDAP。

## Web 与 API

沿着输入、处理、存储和输出的路径理解应用，标出身份校验、对象归属和状态变化的位置。阅读一种漏洞时，同时记下成立前提、可观察现象和反例。只记一个请求样例，很容易忽略真正的信任边界。

**阅读顺序：** [PortSwigger Academy](https://portswigger.net/web-security) 学原理与实验 → [PayloadsAllTheThings](payloads.md) 扩展参考 → [HackTricks](hacktricks.md) 补充技术背景。

**检索词：** 文件上传、SSRF、SQL、反序列化、OAuth、JWT、GraphQL。

## 域与身份

围绕身份、凭据、权限和信任关系组织知识。先理解认证解决谁是谁、授权决定谁能做什么，再理解票据、委派、证书和访问控制之间的联系。遇到技术名时，先问它需要什么权限、影响哪个对象，以及环境里有没有这条关系。

**阅读顺序：** [The Hacker Recipes](recipes.md) 建立结构 → [HackTricks](hacktricks.md) 交叉阅读 → [ired.team](https://www.ired.team/) 阅读实验背景。

**检索词：** Kerberos、NTLM、委派、证书、DACL、BloodHound。

## 主机与提权

从当前用户、组、可执行文件与服务权限出发，整理实际可控的资源。操作系统版本、运行上下文和配置差异会改变结论。查到某个程序支持某种功能后，仍需要确认现场权限是否满足条件。

**阅读顺序：** [HackTricks](hacktricks.md) 理解上下文 → [GTFOBins](https://gtfobins.org/) 或 [LOLBAS](https://lolbas-project.github.io/) 按程序查阅。

**检索词：** Linux、Windows、sudo、SUID、capabilities、privilege。

## 云与容器

先区分控制平面、工作负载与身份凭据，再梳理资源之间的权限关系。将组织、账号、项目、角色和资源放到同一张图里，能更快发现假设缺口。容器内权限与宿主机权限也应分别记录，避免把两个边界混在一起。

**阅读顺序：** [Cloud HackTricks](https://cloud.hacktricks.wiki/) → [HackTricks 容器相关目录](hacktricks.md)。

**检索词：** AWS、Azure、GCP、Docker、Kubernetes、容器。

## 移动与逆向

从应用架构、数据流与运行环境开始。静态观察用来建立假设，动态观察用来确认路径；两者之间保留清晰对应关系。记录系统版本、架构和保护机制，让实验结论有明确的适用范围。

**阅读顺序：** [CTF Wiki](https://ctf-wiki.org/) 补基础 → [HackTricks](hacktricks.md) 按 Android、iOS、逆向等主题深入。

**检索词：** Android、iOS、Frida、逆向、binary、Pwn。
