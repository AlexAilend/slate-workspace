export function createDocumentViewer({$, $$, byId, DOC_REFS, esc, getState, showApp, showHome, render, open, closeAll}){
let docReturnTarget='home';
let pdfUrl=null,pdfPending=null;
async function ensureDocPdf(){
 if(pdfUrl)return pdfUrl;
 if(!pdfPending)pdfPending=Promise.all(["reference-1.bin", "reference-2.bin", "reference-3.bin"].map(async part=>{
  const response=await fetch(new URL(part,import.meta.url));
  if(!response.ok)throw new Error('PDF unavailable');
  return response.arrayBuffer();
 })).then(buffers=>{pdfUrl=URL.createObjectURL(new Blob(buffers,{type:'application/pdf'}));return pdfUrl}).finally(()=>{pdfPending=null});
 return pdfPending;
}
function releaseDocPdf(){if(pdfUrl){URL.revokeObjectURL(pdfUrl);pdfUrl=null}}

let docOpenToken=0;
const invalidateDocs=()=>{docOpenToken++};
window.addEventListener('pagehide',releaseDocPdf);
let currentDocQ=null,currentDocPage=1;
function docSupportLabel(s){return s==='direct'?'Дослівно з документації':s==='principle'?'Принцип з документації':'Тематичний матеріал'}
function renderDocEvidence(qid){let box=$('#docEvidence');if(!qid||!DOC_REFS[qid]){box.classList.add('hidden');box.innerHTML='';return}let d=DOC_REFS[qid],q=byId[qid],cls=d.support||'principle';let notes=cls==='gap'?'<div class="docGapNote">У цьому FortiOS 7.6 Administrator Study Guide немає дослівного формулювання, яке повністю підтверджує цю відповідь. Нижче наведено дослівний фрагмент найближчого тематичного матеріалу з цієї книги.</div>':cls==='principle'?'<div class="docGapNote">Нижче наведено дослівний фрагмент документації, але повна відповідь визначається також exhibit, конфігурацією або поєднанням кількох правил.</div>':'';let sourceNote=d.note?`<div class="docGapNote">⚠️ ${esc(d.note)}</div>`:'';let refs=d.refs||[];box.innerHTML=`<div class="docEvidenceHead"><div style="flex:1"><div class="docEvidenceTitle">📖 Питання #${qid}</div><div class="docEvidenceAnswer"><b>Правильна відповідь:</b> ${esc(d.answer)}</div></div><span class="docEvidenceStatus ${cls}">${docSupportLabel(cls)}</span></div>${notes}${sourceNote}${refs.map((r,i)=>`<div class="docEvidenceQuote"><b>Стор. ${r.page} • ${esc(r.section)}</b>${esc(r.excerpt)}</div>`).join('')}<div class="docPageBtns">${refs.map((r,i)=>`<button class="docPageBtn ${r.page===currentDocPage?'active':''}" data-docpage="${r.page}">Відкрити стор. ${r.page}</button>`).join('')}</div>`;box.classList.remove('hidden');$$('[data-docpage]').forEach(b=>b.onclick=()=>jumpDocPage(+b.dataset.docpage))}
function jumpDocPage(page){currentDocPage=page||1;const token=docOpenToken;ensureDocPdf().then(url=>{if(token!==docOpenToken||$('#docApp').classList.contains('appHidden'))return;$('#docFrame').src=url+`#page=${currentDocPage}&zoom=page-width`;renderDocEvidence(currentDocQ)})}
function openDocs(from,qid=null){docReturnTarget=from||((getState().mode&&getState().order.length)?'app':'home');currentDocQ=qid?+qid:null;let d=currentDocQ?DOC_REFS[currentDocQ]:null;currentDocPage=d&&d.refs&&d.refs.length?d.refs[0].page:1;const token=++docOpenToken;closeAll();$('#startScreen').classList.add('appHidden');$('#topApp').classList.add('appHidden');$('#mainApp').classList.add('appHidden');$('#docApp').classList.remove('appHidden');renderDocEvidence(currentDocQ);$('#docLoading').style.display='grid';$('#docLoading').innerHTML='<div class="docLoadBox"><b>Завантаження документації…</b><span>PDF завантажується окремо; це може зайняти трохи часу.</span></div>';$('#docFrame').classList.remove('ready');ensureDocPdf().then(url=>{if(token!==docOpenToken||$('#docApp').classList.contains('appHidden')){if($('#docApp').classList.contains('appHidden'))releaseDocPdf();return}$('#docFrame').src=url+`#page=${currentDocPage}&zoom=page-width`;$('#docFrame').classList.add('ready');$('#docLoading').style.display='none'}).catch(()=>{if(token!==docOpenToken)return;$('#docLoading').innerHTML='<div class="docLoadBox"><b>Не вдалося відкрити PDF</b><span>Не вдалося завантажити документацію. Спробуй відкрити файл у сучасному Chrome, Edge або Firefox.</span></div>'})}
function closeDocs(){docOpenToken++;const f=$('#docFrame');f.classList.remove('ready');f.src='about:blank';$('#docApp').classList.add('appHidden');$('#docEvidence').classList.add('hidden');setTimeout(()=>{if($('#docApp').classList.contains('appHidden'))releaseDocPdf()},0);if(docReturnTarget==='result'&&getState().mode==='exam'&&getState().order.length){showApp();render();open('resultModal')}else if(docReturnTarget==='app'&&getState().mode&&getState().order.length){showApp();render()}else showHome()}

return {openDocs,closeDocs,invalidateDocs};
}
