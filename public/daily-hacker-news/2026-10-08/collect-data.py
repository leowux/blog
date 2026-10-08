#!/usr/bin/env python3
"""Re-fetch public GitHub data. Requires gh authenticated externally; creates no credentials.
Run from any directory. Data and provenance are written beside this script.
"""
import os, json, subprocess, datetime as dt, pathlib, csv
from urllib.parse import urlencode
ROOT=pathlib.Path(__file__).resolve().parent; DATA=ROOT/'data'; DATA.mkdir(exist_ok=True)
def project(d,name):
    # Preserve only public fields required for replication, excluding names/emails.
    if name.startswith('commits-page-'):
        return [{'sha':c['sha'],'commit':{'committer':{'date':c['commit']['committer']['date']}},'html_url':c['html_url']} for c in d]
    if name=='default-branch-head.json':
        return {'sha':d['sha'],'html_url':d['html_url'],'commit':{'committer':{'date':d['commit']['committer']['date']}}}
    if name=='repository.json':
        return {k:d[k] for k in ['full_name','html_url','description','default_branch','stargazers_count','forks_count','open_issues_count','created_at','updated_at','pushed_at','language','license']}
    return d
UTC=dt.timezone.utc; CST=dt.timezone(dt.timedelta(hours=8)); logs=[]
def now(): return dt.datetime.now(UTC).isoformat(timespec='seconds')
def get(endpoint,name):
    started=now()
    p=subprocess.run(['gh','api',endpoint],capture_output=True,text=True,check=True)
    (DATA/name).write_text(json.dumps(project(json.loads(p.stdout),name),ensure_ascii=False,indent=2)+'\n')
    logs.append({'url':'https://api.github.com/'+endpoint,'file':'data/'+name,'started_utc':started,'completed_utc':now()})
    return json.loads(p.stdout)
repo=get('repos/docker/docker-agent','repository.json'); branch=repo['default_branch']
head=get('repos/docker/docker-agent/commits/'+branch,'default-branch-head.json')['sha']
languages=get('repos/docker/docker-agent/languages','languages.json')
start=dt.datetime(2026,10,1,tzinfo=CST); end=dt.datetime(2026,10,8,tzinfo=CST)
commits=[]; page=1
while True:
    params={'sha':head,'since':start.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ'),'until':end.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ'),'per_page':100,'page':page}
    batch=get('repos/docker/docker-agent/commits?'+urlencode(params),f'commits-page-{page}.json'); commits.extend(batch)
    if len(batch)<100: break
    page+=1
unique={c['sha']:c for c in commits}; counts={(start+dt.timedelta(days=i)).date().isoformat():0 for i in range(7)}; rows=[]
for sha,c in unique.items():
    timestamp=c['commit']['committer']['date']; t=dt.datetime.fromisoformat(timestamp.replace('Z','+00:00'))
    if start<=t<end:
        day=t.astimezone(CST).date().isoformat(); counts[day]+=1
        rows.append({'sha':sha,'committer_timestamp_utc':timestamp,'date_asia_shanghai':day,'url':c['html_url']})
with (DATA/'daily-commits.csv').open('w') as f:
    w=csv.writer(f,lineterminator="\n");w.writerow(['date_asia_shanghai','commits']);w.writerows(counts.items())
with (DATA/'counted-commits.csv').open('w') as f:
    w=csv.DictWriter(f,lineterminator='\n',fieldnames=['sha','committer_timestamp_utc','date_asia_shanghai','url']);w.writeheader();w.writerows(rows)
total=sum(languages.values())
with (DATA/'language-bytes.csv').open('w') as f:
    w=csv.writer(f,lineterminator="\n");w.writerow(['language','bytes','share_percent']);w.writerows((k,v,round(v/total*100,8)) for k,v in languages.items())
meta={'preservation_note':'Commit and repository JSON preserve selected public API fields needed to verify statistics; contributor names, emails, messages and unrelated fields are excluded. Language response is complete.', 'repository':'docker/docker-agent','default_branch':branch,'pinned_head_sha':head,'window_start_inclusive':start.isoformat(),'window_end_exclusive':end.isoformat(),'timezone':'Asia/Shanghai (UTC+08:00)','commit_method':'GitHub REST List commits, pinned default-branch head; paginated 100/page to final short page. Deduplicate SHA, filter commit.committer.date into the half-open window, bin in Asia/Shanghai. Includes merge commits and all reachable history, not first-parent-only. Commit timestamps are not push times or counts of newly authored changes.','raw_commits_returned':len(commits),'unique_commits_returned':len(unique),'counted_commits':len(rows),'commit_api_pages':page,'daily_counts':counts,'language_method':'GitHub REST languages reports bytes per detected language. All returned language categories are mutually exclusive for this denominator; denominator is their sum. Not lines, files, performance, quality, users, or complete repository storage. Snapshot is not a historical October 7 measurement and language analysis may lag.','language_denominator_bytes':total,'languages':languages,'fetch_completed_utc':now(),'fetch_completed_asia_shanghai':dt.datetime.now(CST).isoformat(timespec='seconds'),'requests':logs}
(DATA/'provenance.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(meta,ensure_ascii=False,indent=2))
