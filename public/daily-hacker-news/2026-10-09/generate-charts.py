#!/usr/bin/env python3
"""Generate accessible standalone SVGs and pie CSV from preserved JSON; no network."""
import pathlib,json,math,csv,html
R=pathlib.Path(__file__).resolve().parent; D=R/'data'; m=json.loads((D/'provenance.json').read_text()); langs=m['languages']; total=sum(langs.values())
W,H=960,530
C={'ink':'#182c37','muted':'#485f6a','grid':'#dbe4e7','teal':'#007f78','orange':'#bd581c','bg':'#fafcfb'}
def esc(t):return html.escape(str(t))
def text(x,y,t,size=18,color=None,anchor='start',weight='400'):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color or C["ink"]}" text-anchor="{anchor}" font-weight="{weight}">{esc(t)}</text>'
def svg(name,title,desc,sub,body,foot):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="530" viewBox="0 0 960 530" role="img" aria-labelledby="title desc"><title id="title">{esc(title)}</title><desc id="desc">{esc(desc)}</desc><rect width="960" height="530" rx="18" fill="{C["bg"]}"/><g font-family="system-ui, -apple-system, Segoe UI, Noto Sans CJK SC, sans-serif">'
 s+=text(38,47,title,25,weight='700')+text(38,79,sub,15,C['muted'])+body
 s+=text(38,481,foot,14,C['muted'])+text(38,507,'来源：GitHub REST API · duckdb/ducklake · 数据与方法见附表',14,C['muted'])+'</g></svg>'
 (R/name).write_text(s)
# Line: seven complete local days, linear scale beginning at zero.
counts=m['daily_counts']; vals=list(counts.values()); ymax=max(4,math.ceil(max(vals)/4)*4); x0,x1,y0,y1=84,900,398,124; b=''
for j in range(5):
 v=ymax*j/4;y=y0-(y0-y1)*j/4;b+=f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{C["grid"]}"/>'+text(66,y+6,f'{v:g}',15,C['muted'],'end')
b+=text(38,111,'次提交',14,C['muted']); pts=[]
for i,(day,v) in enumerate(counts.items()):
 x=x0+(x1-x0)*i/6;y=y0-(y0-y1)*v/ymax;pts.append((x,y,v));b+=text(x,432,day[5:].replace('-','/'),16,C['muted'],'middle')
b+=f'<polyline fill="none" stroke="{C["teal"]}" stroke-width="3" points="'+ ' '.join(f'{x},{y}' for x,y,v in pts)+'"/>'
for x,y,v in pts:b+=f'<circle cx="{x}" cy="{y}" r="5" fill="{C["teal"]}"/>'+text(x,y-15,v,17,C['teal'],'middle','700')
series='；'.join(f'{k}：{v}' for k,v in counts.items())
svg('line-commits.svg','最近 7 个完整自然日的提交记录',series+'。按 committer 时间计数，合计 '+str(sum(vals))+' 次。','2026/10/02–10/08 · Asia/Shanghai（UTC+8）· 固定 main 分支快照',b,'按 commit.committer.date 分日；含合并提交，不等同于 push 次数或开发产出。')
# Bars: five non-C++ languages, zero-based linear scale, values in bytes.
non_go={k:v for k,v in langs.items() if k != 'C++'}
b=''; x0=168; span=580; maxv=30000
for j in range(7):
 x=x0+span*j/6;b+=f'<line x1="{x}" y1="112" x2="{x}" y2="415" stroke="{C["grid"]}"/>'+text(x,439,f'{maxv*j/6/1000:g}k',14,C['muted'],'middle')
for i,(k,v) in enumerate(non_go.items()):
 y=126+59*i;b+=text(150,y+23,k,17,C['ink'],'end')+f'<rect x="{x0}" y="{y}" width="{span*v/maxv:.4f}" height="31" rx="1" fill="{C["teal"]}"/>'+text(910,y+23,f'{v:,}',17,C['ink'],'end')
svg('bar-language-bytes.svg','五种非 C++ 语言的字节数', '；'.join(f'{k} {v:,} 字节' for k,v in non_go.items())+'。横轴从零起，单位为字节。','即时快照 · 排除 C++ 以看清较小分类 · 线性刻度，k = 1,000 字节',b,f'本图合计 {sum(non_go.values()):,} 字节；C++ 的 {langs["C++"]:,} 字节未在本图绘制。')
# Pie: explicit, exhaustive, mutually exclusive C++ versus sum of remaining five categories.
go=langs['C++']; other=total-go; shares=[('C++',go),('其他五种语言',other)]
with (D/'pie-language-shares.csv').open('w') as f:
 w=csv.writer(f,lineterminator="\n");w.writerow(['category','bytes','share_percent']);w.writerows((k,v,v/total*100) for k,v in shares)
cx,cy,r=254,278,153; start=-math.pi/2; angle=2*math.pi*go/total; end=start+angle
xstart,ystart=cx+r*math.cos(start),cy+r*math.sin(start);xe,ye=cx+r*math.cos(end),cy+r*math.sin(end)
b=f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{C["orange"]}"/><path d="M {cx} {cy} L {xstart} {ystart} A {r} {r} 0 1 1 {xe} {ye} Z" fill="{C["teal"]}"/>'
for i,(k,v) in enumerate(shares):
 y=185+i*107; color=C['teal'] if i==0 else C['orange']; b+=f'<rect x="464" y="{y}" width="18" height="18" rx="3" fill="{color}"/>'+text(496,y+17,k,20,weight='700')+text(496,y+49,f'{v/total*100:.3f}% · {v:,} 字节',21,color)
b+=text(464,398,'其他 = Python + CMake + Shell',15,C['muted'])+text(464,422,'             + PLpgSQL + Makefile',15,C['muted'])
svg('pie-language-share.svg','同一字节总量中的 C++ 占比',f'C++ {go:,} 字节，{go/total*100:.3f}%；其他五种语言合计 {other:,} 字节，{other/total*100:.3f}%。两者互斥且穷尽分母 {total:,} 字节。','即时快照 · 两个互斥分类 · 与柱状图来自同一完整语言快照',b,f'分母 = API 返回的全部语言字节之和：{total:,}；百分比四舍五入至 3 位小数。')
print('SVGs generated; daily counts:',counts,'language total:',total,'C++ %:',go/total*100)
