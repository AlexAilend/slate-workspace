import {mount} from './app.js';
const controls=[...document.querySelectorAll('#startStudy,#startExam,#startDocs')];
controls.forEach(b=>b.disabled=true);
async function readJSON(file){const r=await fetch(new URL('./'+file,import.meta.url));if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}
try{
 const [questions,references]=await Promise.all([readJSON('questions.json'),readJSON('references.json')]);
 if(!Array.isArray(questions)||!questions.length)throw new Error('Invalid question bank');
 mount(questions,references);controls.forEach(b=>b.disabled=false);
}catch(error){
 console.error('Workspace initialization failed',error);
 const p=document.createElement('p');p.className='boot-error';p.textContent='Не вдалося завантажити дані. Перевір з’єднання та онови сторінку.';
 const retry=document.createElement('button');retry.className='btn';retry.textContent='Спробувати ще раз';retry.onclick=()=>location.reload();p.append(' ',retry);document.querySelector('.startWrap').append(p);
}
