"""Refresh public catalogue metadata only; never mirror article bodies. stdlib only."""
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urljoin, quote
from html.parser import HTMLParser
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/hacking'

def fetch(url):
    return urlopen(Request(url, headers={'User-Agent': 'Hacking-Library/1.0'}), timeout=45).read().decode('utf-8')

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.href=None; self.label=[]
    def handle_starttag(self, tag, attrs):
        if tag=='a': self.href=dict(attrs).get('href'); self.label=[]
    def handle_data(self, data):
        if self.href is not None: self.label.append(data)
    def handle_endtag(self, tag):
        if tag=='a' and self.href is not None:
            self.links.append((self.href,' '.join(''.join(self.label).split()))); self.href=None

def category(title, url):
    s=(title+' '+url).lower()
    for cat, words in [
        ('域与身份', ['active-directory','/ad/','kerberos','ntlm','ldap','adcs','ad-cs','域','bloodhound']),
        ('云与容器', ['cloud','aws','azure','gcp','docker','kubernetes','container','云','容器']),
        ('移动与逆向', ['android','ios','mobile','revers','binary','pwn','macos','移动','逆向','二进制']),
        ('主机与提权', ['linux','windows','privilege','sudo','suid','capabilit','提权','gtfobins','lolbas']),
        ('Web 与 API', ['web','http','sql','xss','ssrf','injection','upload','jwt','oauth','api','csrf','deserial','注入','上传','反序列化']),
    ]:
        if any(w in s for w in words): return cat
    return '侦察与通用'

ALIASES={'kerberos':'域认证 票据','ntlm':'认证 中继','delegation':'委派','certificate':'证书','dacl':'访问控制 权限','recon':'侦察 信息收集','password':'密码 口令','credential':'凭据','sql':'数据库 注入','xss':'跨站脚本','ssrf':'服务端请求伪造','csrf':'跨站请求伪造','deserial':'反序列化','upload':'文件上传','inclusion':'文件包含','traversal':'目录穿越','smuggling':'请求走私','linux':'主机 提权','windows':'主机 提权','docker':'容器','kubernetes':'容器 k8s','aws':'亚马逊 云','azure':'微软 云','graphql':'接口 API','oauth':'认证 授权','jwt':'令牌 认证','suid':'提权','sudo':'提权','reverse':'逆向','android':'安卓 移动','ios':'苹果 移动','cache':'缓存','prototype':'原型链污染','command':'命令执行','saml':'单点登录','acl':'权限 访问控制'}

def main():
    rows=[]
    def add(source,title,url,lang):
        if not title.strip(): return
        tags=' '.join(v for k,v in ALIASES.items() if k in (title+' '+url).lower())
        rows.append(dict(source=source,title=title,url=url,language=lang,category=category(title,url),keywords=tags))
    raw=fetch('https://raw.githubusercontent.com/HackTricks-wiki/hacktricks/zh/src/SUMMARY.md')
    for title,path in re.findall(r'\[([^\]]+)\]\(([^)]+\.md)\)',raw):
        if path=='README.md': path='index.md'
        path=path.replace('/README.md','/index.md')[:-3]+'.html'
        add('HackTricks',title,'https://book.hacktricks.wiki/zh/'+quote(path,safe='/'),'中文')
    raw=fetch('https://raw.githubusercontent.com/The-Hacker-Recipes/The-Hacker-Recipes/main/docs/.vitepress/config.mts')
    for title,path in re.findall(r'"text":\s*"([^"]+)"\s*,\s*"link":\s*"([^"]+)"',raw):
        if not path.startswith('/'): continue
        path=re.sub(r'(?:/index)?\.md$','',path)
        add('The Hacker Recipes',title,'https://www.thehacker.recipes'+path,'英文')
    p=Links();p.feed(fetch('https://swisskyrepo.github.io/PayloadsAllTheThings/'))
    for path,title in p.links:
        if not path or path.startswith(('#','http','mailto:','javascript:')) or 'assets/' in path: continue
        if title in ['Documentation','Contributions','CONTRIBUTING','DISCLAIMER','Payloads All The Things']: continue
        add('PayloadsAllTheThings',title,urljoin('https://swisskyrepo.github.io/PayloadsAllTheThings/',path),'英文')
    extra=[
        ('GTFOBins','Unix 程序功能与权限上下文速查','https://gtfobins.org/'),
        ('LOLBAS','Windows 系统程序、脚本与库速查','https://lolbas-project.github.io/'),
        ('PortSwigger Academy','Web 安全原理与交互实验','https://portswigger.net/web-security'),
        ('ired.team','红队实验、Windows 内部机制与实践记录','https://www.ired.team/'),
        ('Cloud HackTricks','AWS、Azure、GCP 云安全知识库','https://cloud.hacktricks.wiki/'),
        ('OWASP WSTG','Web 安全测试指南与测试用例','https://owasp.org/www-project-web-security-testing-guide/'),
        ('CTF Wiki','中文 CTF、Pwn、密码学与逆向知识库','https://ctf-wiki.org/'),
    ]
    for source,title,url in extra: add(source,title,url,'中文' if source=='CTF Wiki' else '英文')
    rows=list({r['url']:r for r in rows}.values())
    assert len(rows)>1000, 'Upstream catalogue changed; keep the previous snapshot.'
    OUT.mkdir(parents=True,exist_ok=True)
    payload={'updated':datetime.now(timezone.utc).strftime('%Y-%m-%d'),'entries':rows}
    (OUT/'catalog.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    # Article metadata participates in the documentation site's native search too.
    for source,slug in [('HackTricks','hacktricks'),('The Hacker Recipes','recipes'),('PayloadsAllTheThings','payloads')]:
        lines=[f'# {source} 目录','', '这里只聚合公开文章标题与来源链接。全文、更新及署名以原站为准。','']
        for r in rows:
            if r['source']==source:
                title=r['title'].replace('[','').replace(']','')
                lines += [f"- [{title}]({r['url']}) · {r['category']} {r['keywords']}"]
        (OUT/(slug+'.md')).write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(f'Refreshed {len(rows)} catalogue entries.')

if __name__=='__main__': main()
