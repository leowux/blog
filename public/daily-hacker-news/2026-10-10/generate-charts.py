#!/usr/bin/env python3
"""Rebuild three SVG charts offline from preserved GitHub REST data."""
import pathlib,json,math,html
R=pathlib.Path(__file__).resolve().parent;m=json.loads((R/'data/provenance.json').read_text());L=m['languages'];T=sum(L.values());C=['#087f8c','#e49b39']
def tx(x,y,s,size=18):return f'<text x="{x}" y="{y}" font-size="{size}" fill="#20333f">{html.escape(str(s))}</text>'
def save(name,title,desc,body):
 (R/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" role="img" aria-labelledby="t d"><title id="t">{html.escape(title)}</title><desc id="d">{html.escape(desc)}</desc><rect width="960" height="520" fill="#fafcfb"/><g font-family="system-ui,sans-serif">'+tx(35,42,title,25)+body+tx(35,478,'来源：GitHub REST API · denoland/deno · 方法与原始数据见文章',15)+tx(35,505,'抓取：2026-10-10 UTC / Asia/Shanghai；不是性能或用户量统计',15)+'</g></svg>')
counts=m['daily_counts'];b=tx(35,80,'2026-10-03 至 10-09 · 北京时间完整自然日 · 单位：次',16);pts=[]
for j in range(6):
 y=390-j*55;b+=f'<path d="M 85 {y} H 900" stroke="#d8e0e3"/>'+tx(48,y+6,j,15)
for i,(day,v) in enumerate(counts.items()):
 x=95+i*130;y=390-v*55;pts.append((x,y));b+=tx(x-22,423,day[5:],15)+tx(x-4,y-14,v,16)
b+='<polyline fill="none" stroke="#087f8c" stroke-width="3" points="'+' '.join(f'{x},{y}' for x,y in pts)+'"/>'
for x,y in pts:b+=f'<circle cx="{x}" cy="{y}" r="5" fill="#087f8c"/>'
save('line-commits.svg','Deno 七天提交记录',str(counts)+'，合计9次；按committer时间统计，含合并提交。',b)
b=tx(35,80,'同一语言字节快照 · 前四类 · 线性零起点 · MB = 1,000,000 字节',16)
for j in range(5):
 x=175+j*145;b+=f'<path d="M {x} 110 V 401" stroke="#d8e0e3"/>'+tx(x-5,426,j*6,15)
for i,(k,v) in enumerate(list(L.items())[:4]):
 y=125+i*65;b+=tx(35,y+24,k)+f'<rect x="175" y="{y}" width="{580*v/24000000}" height="33" fill="#087f8c"/>'+tx(775,y+24,f'{v:,}',16)
save('bar-language-bytes.svg','Deno 前四种语言的字节数','；'.join(f'{k}:{v}字节' for k,v in list(L.items())[:4])+'。只比较同一仓库中的API字节分类。',b)
a=2*math.pi*L['Rust']/T;cx,cy,r=260,265,145;xe=cx+r*math.cos(a-math.pi/2);ye=cy+r*math.sin(a-math.pi/2)
b=tx(35,80,'同一快照 · Rust 与其余 16 类互斥 · 分母为全部 17 类字节之和',16)+f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{C[1]}"/><path d="M {cx} {cy} L {cx} {cy-r} A {r} {r} 0 1 1 {xe} {ye} Z" fill="{C[0]}"/>'
for i,(k,v) in enumerate([('Rust',L['Rust']),('其余 16 类',T-L['Rust'])]):
 y=190+i*105;b+=f'<rect x="470" y="{y-18}" width="20" height="20" fill="{C[i]}"/>'+tx(508,y,k,23)+tx(508,y+35,f'{v:,} 字节 / {v/T*100:.2f}%',21)
b+=tx(470,420,f'总量：{T:,} 字节',18)
save('pie-language-share.svg','Deno 语言字节组成',f'Rust {L["Rust"]}字节，{L["Rust"]/T*100:.2f}%；其他{T-L["Rust"]}字节；分母{T}字节。',b)
