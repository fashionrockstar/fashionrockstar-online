#!/usr/bin/env python3
"""Read-only source/content/media inventory using only the Python standard library."""
import argparse, hashlib, json, subprocess, tempfile
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, parse_qs
REPO=Path(__file__).resolve().parents[4]
DEFAULT_REV='b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad'
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Node:
 def __init__(self,tag='',attrs=None,parent=None): self.tag,self.attrs,self.parent,self.children=tag,dict(attrs or []),parent,[]
 def all(self,predicate=lambda x:True):
  out=[]
  for n in self.children:
   if isinstance(n,Node):
    if predicate(n):out.append(n)
    out.extend(n.all(predicate))
  return out
 def text(self):
  def chunks(n):
   if isinstance(n,str):return n
   if n.tag in {'script','style','svg'}:return ''
   return ' '.join(chunks(c) for c in n.children)
  return ' '.join(chunks(self).split())
 def cls(self,c): return c in self.attrs.get('class','').split()
 def first(self,predicate):return next(iter(self.all(predicate)),None)
class Parser(HTMLParser):
 def __init__(self,html):
  super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root];self.feed(html)
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs,self.stack[-1]);self.stack[-1].children.append(n)
  if tag not in VOID:self.stack.append(n)
 def handle_startendtag(self,tag,attrs):
  self.handle_starttag(tag,attrs)
  if tag not in VOID:self.stack.pop()
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):self.stack[-1].children.append(data)
def digest(data):return hashlib.sha256(data).hexdigest()
def cmd(*args):return subprocess.check_output(args,cwd=REPO)
def source(path,revision):return (REPO/path).read_bytes() if revision=='working' else cmd('git','show',f'{revision}:{path}')
def html(path,rev):return Parser(source(path,rev).decode()).root
def media_nodes(node):return [dict(tag=n.tag,**n.attrs) for n in node.all(lambda n:n.tag in {'img','video','source'})]
def links(node):return [{'text':n.text(),'href':n.attrs.get('href'),'ariaLabel':n.attrs.get('aria-label')} for n in node.all(lambda n:n.tag=='a')]
def blocks(node):return [{'tag':n.tag,'id':n.attrs.get('id'),'text':n.text()} for n in node.all(lambda n:n.tag in {'h1','h2','h3','p','figcaption','legend','summary'})]
def media_keys(item):return [f"{item['type']}:{src}" for src in [item.get('src'),*[s.strip().split()[0] for s in item.get('srcset','').split(',') if s.strip()]] if src]
def build(rev, baseline_revision=DEFAULT_REV):
 paths=[p for p in cmd('git','ls-tree','-r','--name-only',baseline_revision).decode().splitlines() if not p.startswith('docs/')]
 routes=[]; pages={}
 for p in paths:
  if not p.endswith('index.html'):continue
  tree=html(p,rev);main=tree.first(lambda n:n.tag=='main');title=tree.first(lambda n:n.tag=='title')
  route='/' if p=='index.html' else '/'+p[:-10]
  canonical=tree.first(lambda n:n.tag=='link' and n.attrs.get('rel')=='canonical')
  body=tree.first(lambda n:n.tag=='body')
  routes.append({'route':route,'file':p,'title':title.text() if title else None,'canonical':canonical.attrs.get('href') if canonical else None,'bodyClass':body.attrs.get('class') if body else None,'scripts':[n.attrs.get('src') for n in tree.all(lambda n:n.tag=='script' and n.attrs.get('src'))],'stylesheets':[n.attrs.get('href') for n in tree.all(lambda n:n.tag=='link' and n.attrs.get('rel')=='stylesheet')],'mainBlocks':blocks(main) if main else [],'links':links(tree)})
  pages[p]=tree
 raw=source('assets/js/projects-data.js',rev).decode();projects=json.loads(raw[raw.index('['):raw.rindex(']')+1])
 work=pages['work/index.html'];tiles=work.all(lambda n:n.cls('work-tile'))
 work_inventory=[]
 for idx,tile in enumerate(tiles):
  title=tile.first(lambda n:n.tag=='b');meta=tile.first(lambda n:n.cls('work-tile__details'))
  work_inventory.append({'order':idx+1,'id':tile.attrs.get('data-project-id'),'url':tile.attrs.get('href'),'disciplines':tile.attrs.get('data-disciplines'),'title':title.text() if title else None,'details':meta.text() if meta else None,'rowClass':tile.parent.attrs.get('class'),'coverMedia':media_nodes(tile)})
 for idx,p in enumerate(projects):
  covers=p['cover'] if isinstance(p['cover'],list) else [p['cover']];keys=set(k for c in covers for k in media_keys(c));gallery=[m for m in p['gallery'] if not any(k in keys for k in media_keys(m))]
  p['inventoryOrder']=idx+1;p['url']='/project/?id='+p['id'];p['renderedGalleryOrder']=[m['src'] for m in gallery];p['headerCoverOrder']=[c['src'] for c in covers];p['previousProject']=projects[(idx-1)%len(projects)]['id'];p['nextProject']=projects[(idx+1)%len(projects)]['id']
 services_tree=pages['services/index.html'];services=[]
 for s in services_tree.all(lambda n:n.cls('service') and n.tag=='details'):
  services.append({'id':s.attrs.get('id'),'name':s.attrs.get('name'),'title':s.first(lambda n:n.cls('service-title')).text(),'overview':blocks(s.first(lambda n:n.cls('service-overview'))),'stages':[blocks(n) for n in s.all(lambda n:n.cls('service-stage'))],'scope':blocks(s.first(lambda n:n.cls('service-scope'))),'links':links(s)})
 booking=pages['booking/index.html'];form=booking.first(lambda n:n.tag=='form');fields=[]
 attrs={'type','name','id','value','required','autocomplete','inputmode','placeholder','rows','maxlength','tabindex','selected','disabled','aria-label'}
 for n in form.all(lambda n:n.tag in {'input','textarea','select','button'}):
  fields.append({'tag':n.tag,'attrs':{k:v for k,v in n.attrs.items() if k in attrs},'options':[{'value':o.attrs.get('value'),'selected':'selected' in o.attrs,'text':o.text()} for o in n.all(lambda n:n.tag=='option')],'label':n.parent.text() if n.parent.tag=='label' else None,'text':n.text() if n.tag=='button' else None})
 booking_semantics={'formAttrs':form.attrs,'fields':fields,'copy':blocks(form),'serviceModeWithJS':'multi-select checkboxes, at least one required by setCustomValidity','serviceModeNoJS':'native radios, first required; one service','prefill':'URL query service matches exactly any service value','serialize':'FormData project-type array joined with commas; URLSearchParams(formData)','submit':'fetch POST /booking/ application/x-www-form-urlencoded, 20-second AbortController timeout','duplicateProtection':'pending and received guards; button and fields disabled while pending','success':'response.ok required; any cross-origin response URL rejected; hide project section and focus confirmation; prevent subsequent submit','failure':'SUBMISSION FAILED — PLEASE TRY AGAIN.; focus role=status; restore original disabled fields and button','backend':'Netlify static form: booking; form-name hidden=booking; honeypot company-website'}
 preservation={
  'work':[dict(id=t['id'],url=t['url'],disciplines=t['disciplines'],title=t['title'],details=t['details'],coverMedia=t['coverMedia']) for t in work_inventory],
  'projects':projects,'services':services,
  'servicesIntroClosing':blocks(services_tree.first(lambda n:n.cls('services-intro')))+blocks(services_tree.first(lambda n:n.cls('services-closing'))),
  'about':{'blocks':blocks(pages['about/index.html'].first(lambda n:n.tag=='main')),'links':links(pages['about/index.html'].first(lambda n:n.tag=='main')),'media':media_nodes(pages['about/index.html'].first(lambda n:n.tag=='main'))},
  'issue01':{'blocks':blocks(pages['issue-01/index.html'].first(lambda n:n.tag=='main')),'mainText':pages['issue-01/index.html'].first(lambda n:n.tag=='main').text()},
  'booking':booking_semantics,
  'homeSocials':links(pages['index.html'].first(lambda n:n.tag=='footer'))
 }
 hashes=[];asset_hashes=[]
 for p in paths:
  if p.startswith('mockups/'):continue
  data=source(p,rev)
  rec={'path':p,'bytes':len(data),'sha256':digest(data)}
  hashes.append(rec)
  if p.startswith(('assets/media/','assets/images/','assets/video/','assets/fonts/','assets/icons/')):asset_hashes.append(rec)
 preservation['assetHashes']=asset_hashes
 # Report stale project links and media destinations missing from the checkout.
 slugs={p['id'] for p in projects};stale=[]
 for r in routes:
  for link in r['links']:
   href=link['href'] or ''
   if href.startswith('/project/?id='):
    slug=parse_qs(urlsplit(href).query).get('id',[''])[0]
    if slug not in slugs:stale.append({'route':r['route'],'link':link})
 summary={'revision':rev,'baselineRevision':baseline_revision,'primaryRoutes':[r['route'] for r in routes if not r['route'].startswith('/mockups/')],'projectCount':len(projects),'workTileCount':len(tiles),'projectOrder':[p['id'] for p in projects],'services':[s['id'] for s in services],'assetCount':len(asset_hashes),'assetBytes':sum(a['bytes'] for a in asset_hashes),'staleProjectLinks':stale,'workCatalogueOrderMatches': [p['id'] for p in projects]==[t['id'] for t in work_inventory]}
 return {'summary':summary,'routes':routes,'work':work_inventory,'projects':projects,'services':services,'booking':booking_semantics,'fileHashes':hashes},preservation
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--repo',type=Path,default=REPO,help='Repository root (default: resolve from this script).')
 parser.add_argument('--revision',default='working',help='Source revision to inventory, or working (default).')
 parser.add_argument('--baseline-revision',default=DEFAULT_REV,help='Immutable revision defining the preserved file set.')
 parser.add_argument('--prefix',type=Path,default=Path(tempfile.gettempdir())/'fashionrockstar-preservation'/'current',help='Output path prefix for -inventory.json and -preservation.json.')
 a=parser.parse_args();REPO=a.repo.resolve();prefix=a.prefix.resolve();prefix.parent.mkdir(parents=True,exist_ok=True)
 inventory,preservation=build(a.revision,a.baseline_revision)
 for suffix,obj in [('inventory',inventory),('preservation',preservation)]:Path(str(prefix)+'-'+suffix+'.json').write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
 print(json.dumps(inventory['summary'],indent=2,ensure_ascii=False))
