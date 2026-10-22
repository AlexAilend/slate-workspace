// Validate persisted state before using it to index the question bank.
export function writeState(key,state){try{localStorage.setItem(key,JSON.stringify(state))}catch{}}
export function readState(key,questions){
 try{
  const x=JSON.parse(localStorage.getItem(key));
  const bank=new Map(questions.map(q=>[q.id,q]));
  if(!x||!['study','exam'].includes(x.mode)||!Number.isInteger(x.seed)||!Array.isArray(x.order)||!x.order.length||new Set(x.order).size!==x.order.length||x.order.some(id=>!bank.has(id))||!Number.isInteger(x.idx)||x.idx<0||x.idx>=x.order.length||!x.answers||typeof x.answers!=='object'||Array.isArray(x.answers))return null;
  for(const [id,a] of Object.entries(x.answers)){
   const q=bank.get(Number(id));const allowed=q?.type==='order'?q.candidates:q?.choices?.map(c=>c.id);
   if(!q||!Array.isArray(a)||new Set(a).size!==a.length||a.length>q.correct.length||a.some(v=>!allowed.includes(v)))return null;
  }
  if(x.finished&&x.order.some(id=>(x.answers[id]||[]).length!==bank.get(id).correct.length))return null;
  return {...x,finished:!!x.finished,lastExamCount:Math.max(1,Math.min(questions.length,Number(x.lastExamCount)||10))};
 }catch{return null}
}
