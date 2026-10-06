/* Local storage backend for the GitHub Pages version of Team Leave Register.
   Implements the small subset of the page's data API the app uses, saved in this browser. */
(function(){
"use strict";
const KEY="teamLeaveRegister.v1";
let data;
try{data=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){data={};}
const subs=new Set();
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
function persist(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){alertSave();}subs.forEach(f=>f());}
function alertSave(){const t=document.getElementById("toast");if(t){t.textContent="Couldn't save in this browser. Download a backup now.";t.hidden=false;}}
const col=c=>data[c]||(data[c]={});
const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const qsnap=c=>{const docs=Object.entries(col(c)).map(([id,v])=>({id,exists:true,data:()=>clone(v),metadata:{fromCache:false,hasPendingWrites:false}}));return{docs,size:docs.length,empty:!docs.length};};
function docRef(c,id){return{id,path:c+"/"+id,
  get:async()=>{const v=col(c)[id];return{id,exists:!!v,data:()=>clone(v)};},
  set:async v=>{col(c)[id]=clone(v);persist();},
  update:async v=>{const cur=col(c)[id];if(!cur)throw{code:"invalid_argument",message:"Document not found"};col(c)[id]={...cur,...clone(v)};persist();},
  delete:async()=>{delete col(c)[id];persist();},
  onSnapshot(cb){const f=()=>{const v=col(c)[id];cb({id,exists:!!v,data:()=>clone(v)});};subs.add(f);setTimeout(f,0);return()=>subs.delete(f);}};}
function colRef(c){return{path:c,doc:id=>docRef(c,id||newId()),
  add:async v=>{const id=newId();col(c)[id]=clone(v);persist();return docRef(c,id);},
  get:async()=>qsnap(c),
  onSnapshot(cb){const f=()=>cb(qsnap(c));subs.add(f);setTimeout(f,0);return()=>subs.delete(f);}};}
const db={collection:colRef,doc:p=>{const [c,id]=p.split("/");return docRef(c,id);}};
window.addEventListener("storage",e=>{if(e.key!==KEY)return;try{data=JSON.parse(e.newValue)||{};}catch(_){data={};}subs.forEach(f=>f());});
const me={id:"local-manager",name:"",email:null,isOwner:true,canEdit:true,avatarUrl:"",color:"#0B6E55"};
const user={me:async()=>({...me}),id:async()=>me.id,isOwner:async()=>true,canEdit:async()=>true,can:async()=>true,search:async()=>[],
  profiles:async ids=>Object.fromEntries([].concat(ids).map(i=>[i,{id:i,name:"",avatarUrl:"",color:"",email:null,isMe:i===me.id,guest:false}]))};
const downloads={save:async({filename,data:d})=>{const b=d instanceof Blob?d:new Blob([d],{type:/\.csv$/.test(filename)?"text/csv":"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=filename;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);return{status:"saved"};}};
window.STANDALONE=true;
window.claude={use:async n=>({db,user,downloads})[n]||null};
window.LeaveStore={
  backup:()=>JSON.stringify({app:"team-leave-register",format:1,exportedAt:new Date().toISOString(),data},null,2),
  restore:txt=>{const o=JSON.parse(txt);if(!o||o.app!=="team-leave-register"||!o.data)throw new Error("This file isn't a Team Leave Register backup.");data=o.data;persist();},
  counts:()=>({staff:Object.keys(col("staff")).length,leave:Object.keys(col("requests")).length})
};
})();
