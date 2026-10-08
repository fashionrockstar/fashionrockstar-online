const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname, '../../..');
const source=fs.readFileSync(path.join(root,'assets/js/cover-continuity.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/cover-continuity.css'),'utf8');
async function scenario({direction='open',reduce=false,broken=false,stale=false,mismatch=false}={}){
 const origin='https://preview.example',work=origin+'/work/?filter=photography',project=origin+'/project/?id=13';const current=direction==='open'?project:work;
 const journey={id:'13',workUrl:work,projectUrl:project,coverPath:'/cover.webp',scrollX:0,scrollY:812,savedAt:Date.now()};
 const arrival={id:'13',direction,to:current,from:direction==='open'?work:project,eligible:true,savedAt:Date.now()-(stale?40000:0)};
 const storage=new Map([['frsr:cover-journey:v1',JSON.stringify(journey)],['frsr:cover-transition:v1',JSON.stringify(arrival)]]),handlers={};
 let finishDecode,rejectDecode,scroll=0,holdFinished=false;
 const image={src:origin+(mismatch?'/other.webp':'/cover.webp'),complete:false,naturalWidth:0,style:{removeProperty(){}},dataset:{},closest:()=>null,getBoundingClientRect:()=>({width:800,height:533,top:100,bottom:633}),decode:()=>new Promise((a,b)=>{finishDecode=a;rejectDecode=b})};
 const root={dataset:{},hasAttribute:k=>k==='data-cover-waiting'&&'coverWaiting'in root.dataset};
 const document={documentElement:root,fonts:{status:'loaded'},querySelector:s=>s.includes('img')?image:null,querySelectorAll:()=>[],addEventListener(){},getAnimations:()=>[{animationName:'frsr-cover-hold',finish(){holdFinished=true}},{animationName:'frsr-cover-in',finish(){throw Error('Must preserve movement')}}]};
 const window={addEventListener:(n,cb)=>(handlers[n]??=[]).push(cb),removeEventListener(){},scrollTo:({top})=>scroll=top};
 vm.runInNewContext(source,{document,window,matchMedia:()=>({matches:reduce}),URL,Date,location:{href:current,origin},sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},innerHeight:900,scrollX:0,scrollY:0});
 let skipped=false,resolveReady,resolveFinished;const ready=new Promise(r=>resolveReady=r),finished=new Promise(r=>resolveFinished=r);
 handlers.pagereveal[0]({viewTransition:{ready,finished,skipTransition(){skipped=true}}});
 const shouldAnimate=!reduce&&!stale&&!mismatch;assert.equal(skipped,!shouldAnimate);
 if(shouldAnimate){assert.equal(image.style.viewTransitionName,'frsr-cover');assert(root.hasAttribute('data-cover-waiting'));resolveReady();await new Promise(r=>setImmediate(r));assert.equal(root.dataset.coverMotion,direction);assert(!holdFinished);if(broken)rejectDecode(Error('failed'));else finishDecode();await new Promise(r=>setImmediate(r));assert(holdFinished);resolveFinished();await new Promise(r=>setImmediate(r));assert(!root.hasAttribute('data-cover-waiting'));}
 if(direction==='return'&&!stale)assert.equal(scroll,812);
}
(async()=>{for(const args of [{},{direction:'return'},{broken:true},{reduce:true},{stale:true},{mismatch:true}])await scenario(args);assert(css.includes('frsr-cover-hold 1800ms'));assert(css.includes('::view-transition-old(frsr-cover) { opacity: 1; }'));console.log('PASS: cold open/return use the source snapshot; decode/error releases only the hold; 1.8s bound; reduced/stale/mismatch fallback; scroll restoration; cleanup');})().catch(e=>{console.error(e);process.exitCode=1});
