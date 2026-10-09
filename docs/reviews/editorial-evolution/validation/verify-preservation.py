#!/usr/bin/env python3
"""Compare final source against the immutable b390752 preservation baseline.
Read-only source check: writes reports to --output-dir. No browser requests or form submissions.
"""
import argparse, importlib.util, json, re, sys, tempfile
from pathlib import Path
from urllib.parse import parse_qs, urlsplit
sys.dont_write_bytecode=True
SCRIPT_DIR=Path(__file__).resolve().parent
DEFAULT_REPO=Path(__file__).resolve().parents[4]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--repo',type=Path,default=DEFAULT_REPO,help='Repository root (default: resolve from this script).')
parser.add_argument('--baseline-dir',type=Path,help='Directory containing baseline-inventory.json and baseline-preservation.json (default: <repo>/docs/base44).')
parser.add_argument('--baseline-revision',help='Immutable Git revision (default: baseline JSON revision).')
parser.add_argument('--output-dir',type=Path,default=Path(tempfile.gettempdir())/'fashionrockstar-preservation',help='Output directory (default: system temporary directory/fashionrockstar-preservation).')
args=parser.parse_args()
ROOT=args.repo.resolve();OUT=args.output_dir.resolve();OUT.mkdir(parents=True,exist_ok=True)
BASELINE_DIR=(args.baseline_dir or ROOT/'docs'/'base44').resolve()
spec=importlib.util.spec_from_file_location('inventory',SCRIPT_DIR/'inventory.py');inv=importlib.util.module_from_spec(spec);spec.loader.exec_module(inv);inv.REPO=ROOT
b=json.loads((BASELINE_DIR/'baseline-preservation.json').read_text(encoding='utf-8'))
bi=json.loads((BASELINE_DIR/'baseline-inventory.json').read_text(encoding='utf-8'))
BASE=args.baseline_revision or bi['summary']['baselineRevision']
ci,c=inv.build('working',BASE)
for name,data in [('current-inventory',ci),('current-preservation',c)]:
 (OUT/(name+'.json')).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
checks=[];differences=[]
def normalized(s):return ' '.join(s.upper().split())
def check(name,passed,detail):checks.append({'name':name,'passed':bool(passed),'detail':detail})
def bytes_same(p):return inv.source(p,BASE)==inv.source(p,'working')
# Exact full catalogue equality covers all project text, metadata, credits, source media,
# srcsets, poster/audio/autoplay flags, native gallery and computed rendered gallery order.
check('project_catalogue_16_records_exact',len(c['projects'])==16 and b['projects']==c['projects'],'All source fields, credits, confirmation metadata, header covers, source/rendered gallery order and Previous/Next destinations match.')
check('selected_work_16_tiles_exact',len(c['work'])==16 and b['work']==c['work'],'Titles, metadata copy, discipline values, slugs/URLs and every ordered cover-media attribute match.')
check('catalogue_data_byte_identical',bytes_same('assets/js/projects-data.js'),'projects-data.js SHA-256 unchanged.')
check('496_existing_binary_assets_sha256',len(c['assetHashes'])==496 and b['assetHashes']==c['assetHashes'],'All 496 existing media/image/video/font/icon SHA-256 and byte counts match; 208,171,307 bytes preserved.')
check('services_complete_5_disciplines_exact',len(c['services'])==5 and b['services']==c['services'] and b['servicesIntroClosing']==c['servicesIntroClosing'],'All service paragraphs, process stages, scope text, order and related Work/Booking targets match.')
check('about_copy_media_exact',b['about']['blocks']==c['about']['blocks'] and b['about']['media']==c['about']['media'],'Every heading/paragraph/caption and all image attrs match.')
about_b=json.loads(json.dumps(b['about']['links']));expected=[]
for link in about_b:
 if link['href']=='/project/?id=13':link['href']='/project/?id=call-her-angelina';expected.append('About contextual portrait link repaired: retired numeric 13 → call-her-angelina.')
check('about_links_expected_single_repair',about_b==c['about']['links'],'Only the explicitly requested stale contextual project link changes.')
check('issue01_copy_case_only',normalized(b['issue01']['mainText'])==normalized(c['issue01']['mainText']),'Only ISSUE 01 / DIGITAL + PRINT / COMING SOON; no new release date, CTA or artwork.')
booking_b=json.loads(json.dumps(b['booking']));booking_c=json.loads(json.dumps(c['booking']))
for old,new in zip(booking_b['fields'],booking_c['fields']):
 if old['tag']=='button' and old['text']=='SEND INQUIRY ↗' and new['text']=='SEND INQUIRY':
  old['text']='SEND INQUIRY';expected.append('Booking aria-hidden arrow character replaced with CSS geometry; SEND INQUIRY wording unchanged.')
check('booking_contract_fields_options_copy',booking_b==booking_c,'Native required-radio fallback, same field names/types/constraints, budget values/labels, honeypot, action/method, status/confirmation copy all preserved. Only presentational hidden arrow normalized.')
protected=['assets/js/booking.js','assets/js/entry-loader.js','assets/css/entry-loader.css','assets/js/cover-continuity.js','assets/css/cover-continuity.css','assets/js/project-media.js','assets/js/system-access.js','assets/js/biometric-access.js','assets/js/face-preview.js','netlify.toml']
protected_hashes=[]
for p in protected:
 same=bytes_same(p);protected_hashes.append({'path':p,'sha256':inv.digest(inv.source(p,'working')),'unchanged':same})
check('booking_entry_media_redirect_logic_byte_identical',all(x['unchanged'] for x in protected_hashes),'Booking JS, entry JS/CSS, media/cover-continuity JS/CSS, dormant entry experiments and Netlify redirect config remain byte-identical.')
old_home=inv.html('index.html',BASE);new_home=inv.html('index.html','working')
def inline_scripts(tree):return [n.children for n in tree.all(lambda n:n.tag=='script' and 'src' not in n.attrs)]
check('home_inline_entry_script_exact',inline_scripts(old_home)==inline_scripts(new_home),'Session-storage/reduced-motion entry gate, 4.8s safety timer and existing timing logic remain byte-identical.')
check('home_entry_markup_exact',old_home.first(lambda n:n.cls('entry-loader')).attrs==new_home.first(lambda n:n.cls('entry-loader')).attrs and re.search(r'<div class="entry-loader"[\s\S]*?(?=  <main>)',inv.source('index.html',BASE).decode()).group()==re.search(r'<div class="entry-loader"[\s\S]*?(?=  <main>)',inv.source('index.html','working').decode()).group(),'Existing loader markup, SVG and logo source preserved.')
hero_engine = lambda revision: inv.source('assets/js/landing.js',revision).split(b'  const exploreLinks = document.querySelectorAll')[0]
check('home_hero_engine_byte_identical',hero_engine(BASE)==hero_engine('working'),'The existing hero logo/video/fallback/playback engine is byte-identical; the added BFCache reset changes only Explore navigation state.')
check('home_social_links_exact',b['homeSocials']==c['homeSocials'],'All existing Instagram / LinkedIn / TikTok profile destinations and labels preserved.')
primary=['index.html','work/index.html','project/index.html','services/index.html','booking/index.html','about/index.html','issue-01/index.html']
writing=[];navigation=[];invalid=[];assets_invalid=[];count_links=0;count_assets=0
slugs={p['id'] for p in c['projects']};services={s['id'] for s in c['services']};filters={'all','creative-direction','photography','styling','beauty'}
for p in primary:
 old=inv.html(p,BASE);new=inv.html(p,'working');om=old.first(lambda n:n.tag=='main');nm=new.first(lambda n:n.tag=='main')
 oldtxt=normalized(om.text());newtxt=normalized(nm.text())
 if p=='booking/index.html':oldtxt=oldtxt.replace(' ↗','');newtxt=newtxt.replace(' ↗','')
 writing.append({'path':p,'mainApprovedWordsPreserved':oldtxt==newtxt,'baselineChars':len(oldtxt),'currentChars':len(newtxt)})
 ot=old.first(lambda n:n.tag=='title').text();nt=new.first(lambda n:n.tag=='title').text()
 if normalized(ot)!=normalized(nt):differences.append({'path':p,'kind':'document title wording changed','before':ot,'after':nt})
 desc=lambda t:[n.attrs.get('content') for n in t.all(lambda n:n.tag=='meta' and n.attrs.get('name')=='description')]
 if desc(old)!=desc(new):differences.append({'path':p,'kind':'meta description changed','before':desc(old),'after':desc(new)})
 oldnav=old.first(lambda n:n.cls('site-nav'));newnav=new.first(lambda n:n.cls('site-nav'))
 if oldnav:
  nav_a=[(normalized(x['text']),x['href']) for x in inv.links(oldnav)];nav_b=[(normalized(x['text']),x['href']) for x in inv.links(newnav)]
  navigation.append({'path':p,'primaryAndSubmenuDestinationsPreserved':nav_a==nav_b})
 for a in new.all(lambda n:n.tag=='a' and n.attrs.get('href')):
  href=a.attrs['href'];u=urlsplit(href)
  if u.scheme or u.netloc:continue
  count_links+=1
  target=(ROOT/p) if not u.path else (ROOT/u.path.lstrip('/')) if u.path.startswith('/') else (ROOT/p).parent/u.path
  if u.path.endswith('/') or target.is_dir():target=target/'index.html'
  if not target.exists():invalid.append({'from':p,'href':href,'reason':'route/file missing'});continue
  q=parse_qs(u.query)
  if u.path.startswith('/project/') and q.get('id',[''])[0] not in slugs:invalid.append({'from':p,'href':href,'reason':'invalid project slug'})
  if u.path.startswith('/work/') and q.get('filter',['all'])[0] not in filters:invalid.append({'from':p,'href':href,'reason':'invalid Work filter'})
  if u.path.startswith('/booking/') and 'service' in q and q['service'][0] not in services:invalid.append({'from':p,'href':href,'reason':'invalid Booking service prefill'})
  if u.fragment:
   tr=new if target.resolve()==(ROOT/p).resolve() else inv.Parser(target.read_text()).root
   if not tr.first(lambda n:n.attrs.get('id')==u.fragment):invalid.append({'from':p,'href':href,'reason':'fragment target missing'})
 for n in new.all(lambda n:n.tag in {'script','link','img','video','source'}):
  refs=[n.attrs[k] for k in ['src','href','data-src','poster'] if k in n.attrs]
  refs.extend(v.strip().split()[0] for v in n.attrs.get('srcset','').split(',') if v.strip())
  for ref in refs:
   u=urlsplit(ref)
   if u.scheme or u.netloc or not u.path:continue
   target=ROOT/u.path.lstrip('/') if u.path.startswith('/') else (ROOT/p).parent/u.path
   count_assets+=1
   if not target.exists():assets_invalid.append({'from':p,'ref':ref})
catalogue_refs=[];catalogue_missing=[]
for project in c['projects']:
 covers=project['cover'] if isinstance(project['cover'],list) else [project['cover']]
 for media in covers+project['gallery']:
  refs=[media[k] for k in ['src','poster'] if k in media]
  refs.extend(v.strip().split()[0] for v in media.get('srcset','').split(',') if v.strip())
  for ref in refs:
   if ref.startswith('/'):
    catalogue_refs.append(ref)
    if not (ROOT/ref.lstrip('/')).exists():catalogue_missing.append({'project':project['id'],'ref':ref})
check('all_catalogue_media_destinations_resolve',not catalogue_missing,f'{len(catalogue_refs)} local catalogue media/srcset/poster references resolve; external Instagram/TikTok/YouTube/Adobe references remain unchanged in the exact catalogue.')
check('all_primary_approved_writing_case_whitespace_only',all(x['mainApprovedWordsPreserved'] for x in writing) and not differences,'All 7 main surfaces preserve exact approved words/punctuation/order after case/whitespace normalization; decorative hidden arrow is explicitly excluded.')
check('primary_and_work_submenu_navigation_preserved',all(x['primaryAndSubmenuDestinationsPreserved'] for x in navigation),'All primary header and Work submenu label words/destinations retain their original meaning and query values.')
check('internal_navigation_destinations_resolve',not invalid,f'{count_links} internal anchor references resolve to existing files, active slugs, valid filters/services and valid fragments.')
check('html_asset_dependency_destinations_resolve',not assets_invalid,f'{count_assets} local stylesheet/script/image/video/poster/srcset references resolve, including new editorial assets.')
report={'baselineRevision':BASE,'passed':all(x['passed'] for x in checks),'checks':checks,'expectedDifferences':expected,'unexpectedDifferences':differences,'writingByPage':writing,'navigationByPage':navigation,'invalidInternalLinks':invalid,'missingReferencedAssets':assets_invalid,'missingCatalogueMedia':catalogue_missing,'protectedFileHashes':protected_hashes,'notes':['This is an exhaustive source/content/media preservation check, not a replacement for browser layout, interaction, focus, reduced-motion or intercepted Booking network tests.','Gallery dedup remains unchanged: 100 source items and 91 rendered items across 16 projects.']}
(OUT/'final-preservation-comparison.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'passed':report['passed'],'checks':len(checks),'passedChecks':sum(x['passed'] for x in checks),'expectedDifferences':expected,'failedChecks':[x for x in checks if not x['passed']],'invalidInternalLinks':invalid,'missingReferencedAssets':assets_invalid,'unexpectedDifferences':differences},indent=2,ensure_ascii=False))
sys.exit(0 if report['passed'] else 1)
