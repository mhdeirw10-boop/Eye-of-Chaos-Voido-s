'use strict';

const apps = [
  {id:'orbit-notes',name:'Orbit Notes',developer:'Nova Labs',category:'apps',categoryLabel:'تطبيقات',icon:'✎',color:'#b6e9ff',platform:'Android / Web',version:'1.2.0',release:202609,featured:true,description:'مساحة بسيطة لتدوين الأفكار وتنظيم الملاحظات اليومية.',details:'تصميم مفاهيمي لتطبيق ملاحظات يركّز على تدوين الأفكار بسرعة وترتيبها في مكان واحد. هذا الإدراج للعرض فقط ولا يمثل تطبيقًا منشورًا فعليًا.',downloadUrl:''},
  {id:'pixel-drift',name:'Pixel Drift',developer:'Indie North',category:'games',categoryLabel:'ألعاب',icon:'▧',color:'#ffc5df',platform:'Android / Web',version:'0.8.4',release:202608,featured:true,description:'لعبة أركيد تجريبية تعتمد على الحركة والتوقيت.',details:'فكرة لعبة قصيرة تعتمد على سرعة الاستجابة وتجاوز العقبات. الاسم والوصف وبيانات الإصدار تجريبية لأغراض اختبار واجهة المتجر.',downloadUrl:''},
  {id:'filespark',name:'FileSpark',developer:'Open Shelf',category:'tools',categoryLabel:'أدوات',icon:'⌘',color:'#ffe19a',platform:'Android',version:'1.0.3',release:202607,featured:true,description:'مفهوم واجهة لتنظيم الملفات وإدارتها.',details:'نموذج مفاهيمي لأداة تنظيم ملفات. بطاقة المتجر لا تمنح التطبيق صلاحيات للوصول إلى ملفات الجهاز ولا تتضمن وظائف ملفات فعلية.',downloadUrl:''},
  {id:'moss-garden',name:'Moss Garden',developer:'Small Worlds',category:'games',categoryLabel:'ألعاب',icon:'❋',color:'#c8f0b0',platform:'Web',version:'0.4.1',release:202606,featured:false,description:'تجربة هادئة لبناء حديقة صغيرة واكتشاف عناصر جديدة.',details:'تجربة ألعاب هادئة ومفهومية عن ترتيب حديقة صغيرة. هذا العنصر غير متاح للتنزيل في النسخة الحالية.',downloadUrl:''},
  {id:'typewave',name:'TypeWave',developer:'Studio Delta',category:'apps',categoryLabel:'تطبيقات',icon:'T',color:'#d8c7ff',platform:'Android / Web',version:'2.1.0',release:202610,featured:true,description:'مفهوم محرر نصوص خفيف للكتابة والتركيز.',details:'تصوّر لمحرر نصوص يوفّر مساحة كتابة بسيطة. لا توجد حاليًا حزمة APK أو نسخة ويب فعلية مرتبطة بهذا الإدراج.',downloadUrl:''},
  {id:'webbench',name:'WebBench',developer:'Void Workshop',category:'tools',categoryLabel:'أدوات',icon:'⌘',color:'#b9f2df',platform:'Web',version:'0.1.0',release:202610,featured:true,description:'أداة تجريبية لفحص واجهات المواقع.',details:'إدراج تجريبي ضمن أدوات المطورين. لا يقوم هذا العنصر بفحص المواقع حاليًا، وهو موجود لاختبار شكل معلومات التطبيقات داخل Void Store.',downloadUrl:''},
  {id:'night-signal',name:'Night Signal',developer:'Black Lantern',category:'games',categoryLabel:'ألعاب',icon:'☾',color:'#b8c7ff',platform:'Android',version:'0.2.0',release:202605,featured:false,description:'مغامرة غامضة قصيرة في عالم لا يكشف كل أسراره.',details:'فكرة لعبة غموض ورعب نفسي تعتمد على الاستكشاف. لا توجد ملفات لعبة فعلية متصلة بهذا الإدراج.',downloadUrl:''},
  {id:'quick-unit',name:'Quick Unit',developer:'Pocket Logic',category:'tools',categoryLabel:'أدوات',icon:'⇄',color:'#ffd2a8',platform:'Web',version:'1.0.0',release:202604,featured:false,description:'واجهة مفاهيمية لتحويل الوحدات الشائعة بسرعة.',details:'عنصر تجريبي لفئة الأدوات. لم تُربط به بعد أداة تحويل فعلية أو ملف تنزيل.',downloadUrl:''},
  {id:'void-notes',name:'Void Notes',developer:'Void Workshop',category:'apps',categoryLabel:'تطبيقات',icon:'▤',color:'#fde68a',platform:'VoidOS / Web',version:'1.0.0',release:202610,featured:true,description:'ملاحظات محلية مع البحث والوسوم والتصدير والاستيراد.',details:'تطبيق مدمج يعمل محليًا داخل VoidOS. يمكنك حفظ الملاحظات والبحث فيها وتصدير نسخة JSON احتياطية. افتح التطبيق من الشاشة الرئيسية أو شغّله من هذا الإدراج.',downloadUrl:'../void-notes/index.html'},
  {id:'void-calculator',name:'Void Calculator',developer:'Void Workshop',category:'tools',categoryLabel:'أدوات',icon:'⌗',color:'#93c5fd',platform:'VoidOS / Web',version:'1.0.0',release:202610,featured:true,description:'حاسبة للعمليات الأساسية والأقواس والجذر والتربيع.',details:'حاسبة محلية تعمل دون اتصال بعد تحميل الملفات. تدعم العمليات الحسابية الأساسية وبعض الوظائف الإضافية، وليست آلة علمية متخصصة.',downloadUrl:'../void-calculator/index.html'},
  {id:'void-planner',name:'Void Planner',developer:'Void Workshop',category:'apps',categoryLabel:'تطبيقات',icon:'✓',color:'#5eead4',platform:'VoidOS / Web',version:'1.0.0',release:202610,featured:true,description:'إدارة مهام مع موعد وأولوية وحالة إنجاز.',details:'قائمة مهام محلية مع فلاتر للمهام المتبقية والمكتملة وإحصاءات بسيطة. لا توجد تذكيرات تعمل في الخلفية أو مزامنة خادم.',downloadUrl:'../void-planner/index.html'},
  {id:'void-files',name:'Void Files',developer:'Void Workshop',category:'tools',categoryLabel:'أدوات',icon:'▣',color:'#bfdbfe',platform:'VoidOS / Web',version:'1.0.0',release:202610,featured:true,description:'معاينة الملفات التي تختارها وتصدير نسخة بيانات محلية.',details:'مدير ملفات محدود بصلاحيات المتصفح: لا يستطيع استعراض تخزين الهاتف بالكامل. يتيح معاينة ملفات نصية مختارة وتصدير/استعادة إعدادات وملاحظات ومهام VoidOS.',downloadUrl:'../void-files/index.html'},
  {id:'void-calendar',name:'Void Calendar',developer:'Void Workshop',category:'apps',categoryLabel:'تطبيقات',icon:'▦',color:'#e9d5ff',platform:'VoidOS / Web',version:'1.0.0',release:202610,featured:true,description:'تقويم شهري مع أحداث محلية ومؤشر للأيام المزدحمة.',details:'تقويم شهري يتيح إنشاء الأحداث وحذفها والتنقل بين الأشهر واستعراض الأحداث القادمة. البيانات محلية ولا توجد تنبيهات خلفية أو مزامنة.',downloadUrl:'../void-calendar/index.html'}
];

const $ = id => document.getElementById(id);
const STORAGE = {favorites:'voidStoreV1Favorites', library:'voidStoreV1Library', theme:'voidStoreV1Theme', account:'voidStoreV1DemoAccount', session:'voidStoreV1DemoSession'};
let activeFilter = 'all';
let currentAppId = null;
let accountMode = 'signup';
let toastTimer = null;

function readList(key){ try { const v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[]; } catch { return []; } }
function writeList(key, value){ try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast('تعذّر الحفظ في هذا المتصفح.'); return false; } }
function escapeHtml(value){ return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function categoryText(category){ return ({apps:'تطبيقات',games:'ألعاب',tools:'أدوات'})[category]||'متنوع'; }
function toast(message){ const el=$('toast'); el.textContent=message; el.classList.remove('hidden'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.add('hidden'),2600); }
function setView(view){
  activeFilter = view;
  document.querySelectorAll('.category-button').forEach(b=>b.classList.toggle('active', b.dataset.filter===view));
  if(view==='favorites'){$('viewTitle').textContent='مفضلتي';$('viewDescription').textContent='التطبيقات التي حفظتها على هذا الجهاز.';}
  else if(view==='library'){$('viewTitle').textContent='مكتبتي';$('viewDescription').textContent='قائمة محلية للعناصر التي أضفتها يدويًا؛ ليست قائمة تثبيت فعلية.';}
  else {$('viewTitle').textContent=view==='all'?'اكتشف التطبيقات':categoryText(view);$('viewDescription').textContent=view==='all'?'اختر ما يناسبك من التطبيقات والألعاب والأدوات.':`تصفّح ${categoryText(view)} المتاحة في المكتبة التجريبية.`;}
  document.querySelector('.catalog-section').scrollIntoView({behavior:'smooth',block:'start'});
  renderApps();
}
function getFilteredApps(){
  const q=$('searchInput').value.trim().toLocaleLowerCase();
  let list=apps.filter(a=>{
    const filterMatch=activeFilter==='all'||activeFilter===a.category||(activeFilter==='favorites'&&readList(STORAGE.favorites).includes(a.id))||(activeFilter==='library'&&readList(STORAGE.library).includes(a.id));
    const text=[a.name,a.developer,a.description,a.details,a.categoryLabel].join(' ').toLocaleLowerCase();
    return filterMatch&&(!q||text.includes(q));
  });
  const sort=$('sortSelect').value;
  if(sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  else if(sort==='newest') list.sort((a,b)=>b.release-a.release);
  else list.sort((a,b)=>Number(b.featured)-Number(a.featured)||b.release-a.release);
  return list;
}
function renderApps(){
  const list=getFilteredApps(); const favorites=readList(STORAGE.favorites);
  $('resultCount').textContent=String(list.length);
  $('appGrid').innerHTML=list.map(a=>`<article class="app-card" data-card="${escapeHtml(a.id)}">
    <button class="favorite-button ${favorites.includes(a.id)?'is-favorite':''}" data-favorite="${escapeHtml(a.id)}" type="button" aria-label="${favorites.includes(a.id)?'إزالة من المفضلة':'إضافة إلى المفضلة'}" title="${favorites.includes(a.id)?'إزالة من المفضلة':'إضافة إلى المفضلة'}">${favorites.includes(a.id)?'♥':'♡'}</button>
    <div class="card-main" data-open="${escapeHtml(a.id)}" tabindex="0" role="button" aria-label="تفاصيل ${escapeHtml(a.name)}"><div class="app-icon" style="background:${a.color}">${escapeHtml(a.icon)}</div><div><h3 class="app-title">${escapeHtml(a.name)}</h3><span class="app-dev">${escapeHtml(a.developer)}</span></div></div>
    <p class="app-description">${escapeHtml(a.description)}</p><div class="card-meta"><span class="category-tag">${escapeHtml(a.categoryLabel)}</span><span>${escapeHtml(a.platform)} · v${escapeHtml(a.version)}</span></div><button class="card-open" data-open="${escapeHtml(a.id)}" type="button">عرض التفاصيل ←</button></article>`).join('');
  $('emptyState').classList.toggle('hidden',list.length!==0); $('appGrid').classList.toggle('hidden',list.length===0);
}
function openApp(id){
  const app=apps.find(a=>a.id===id); if(!app)return; currentAppId=id;
  $('modalIcon').textContent=app.icon; $('modalIcon').style.background=app.color; $('modalCategory').textContent=app.categoryLabel; $('modalTitle').textContent=app.name; $('modalDeveloper').textContent='بواسطة '+app.developer; $('modalVersion').textContent=app.version; $('modalPlatform').textContent=app.platform; $('modalCategoryName').textContent=app.categoryLabel; $('modalDescription').textContent=app.description; $('modalLongDescription').textContent=app.details;
  $('modalDownloadButton').textContent=app.downloadUrl?'تنزيل التطبيق':'التنزيل غير متاح'; $('modalDownloadButton').disabled=!app.downloadUrl; $('modalDownloadButton').style.opacity=app.downloadUrl?'1':'.65';
  refreshDetailButtons(); $('modalStatus').textContent=''; $('appModal').classList.remove('hidden'); $('modalDownloadButton').focus();
}
function refreshDetailButtons(){ if(!currentAppId)return; const fav=readList(STORAGE.favorites).includes(currentAppId), lib=readList(STORAGE.library).includes(currentAppId); $('modalFavoriteButton').textContent=fav?'♥ في المفضلة':'♡ المفضلة'; $('modalLibraryButton').textContent=lib?'✓ موجود في مكتبتي':'＋ إلى مكتبتي'; }
function toggleSaved(key,id,label){let list=readList(key);const exists=list.includes(id);list=exists?list.filter(x=>x!==id):[...list,id];if(writeList(key,list)){renderApps();refreshDetailButtons();toast(exists?`تمت الإزالة من ${label}.`:`تمت الإضافة إلى ${label}.`);}}
function resetFilters(){ $('searchInput').value=''; $('sortSelect').value='featured'; setView('all'); }

$('appGrid').addEventListener('click',e=>{const fav=e.target.closest('[data-favorite]');if(fav){e.stopPropagation();toggleSaved(STORAGE.favorites,fav.dataset.favorite,'المفضلة');return;}const open=e.target.closest('[data-open]');if(open)openApp(open.dataset.open);});
$('appGrid').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-open]')){e.preventDefault();openApp(e.target.dataset.open);}});
$('searchInput').addEventListener('input',renderApps); $('sortSelect').addEventListener('change',renderApps);
document.querySelectorAll('.category-button').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.category-button').forEach(x=>x.classList.toggle('active',x===b));$('viewTitle').textContent=activeFilter==='all'?'اكتشف التطبيقات':categoryText(activeFilter);$('viewDescription').textContent=activeFilter==='all'?'اختر ما يناسبك من التطبيقات والألعاب والأدوات.':`تصفّح ${categoryText(activeFilter)} المتاحة في المكتبة التجريبية.`;renderApps();}));
$('showFavoritesHero').addEventListener('click',()=>setView('favorites')); $('resetFilters').addEventListener('click',resetFilters);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close==='app'?'appModal':'accountModal').classList.add('hidden')));
$('modalFavoriteButton').addEventListener('click',()=>currentAppId&&toggleSaved(STORAGE.favorites,currentAppId,'المفضلة'));
$('modalLibraryButton').addEventListener('click',()=>currentAppId&&toggleSaved(STORAGE.library,currentAppId,'مكتبتي'));
$('modalDownloadButton').addEventListener('click',()=>{const app=apps.find(a=>a.id===currentAppId);if(!app)return;if(app.downloadUrl){window.location.href=app.downloadUrl;}else{$('modalStatus').textContent='لا يوجد ملف تنزيل حقيقي مرتبط بهذا العنصر بعد.';}});
$('themeButton').addEventListener('click',()=>{const light=!document.body.classList.contains('light');document.body.classList.toggle('light',light);try{localStorage.setItem(STORAGE.theme,light?'light':'dark');}catch{};});
try{document.body.classList.toggle('light',localStorage.getItem(STORAGE.theme)==='light');}catch{}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('appModal').classList.add('hidden');$('accountModal').classList.add('hidden');}if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('searchInput').focus();}});

// حساب محلي تجريبي فقط؛ لا تستخدم كلمة مرور حقيقية.
function getAccount(){try{return JSON.parse(localStorage.getItem(STORAGE.account)||'null');}catch{return null;}}
function isLoggedIn(){const a=getAccount();try{return !!(a&&localStorage.getItem(STORAGE.session)===a.username);}catch{return false;}}
function accountNote(message){$('accountNotice').textContent=message;$('accountNotice').classList.remove('hidden');}
function showProfile(){const a=getAccount();if(!a)return;$('profileName').textContent=a.username;$('profileEmail').textContent=a.email;$('profileAvatar').textContent=(a.username||'V').slice(0,1).toUpperCase();$('editUsername').value=a.username;$('accountButtonText').textContent=a.username;}
function switchAccountMode(mode){accountMode=mode;const logged=isLoggedIn();$('signupForm').classList.toggle('hidden',logged||mode!=='signup');$('loginForm').classList.toggle('hidden',logged||mode!=='login');$('profilePanel').classList.toggle('hidden',!logged);$('accountSwitch').classList.toggle('hidden',logged);$('switchPrompt').textContent=mode==='signup'?'لديك حساب بالفعل؟':'ليس لديك حساب؟';$('switchModeButton').textContent=mode==='signup'?'تسجيل الدخول':'إنشاء حساب';if(logged)showProfile();}
$('accountButton').addEventListener('click',()=>{$('accountModal').classList.remove('hidden');$('accountNotice').classList.add('hidden');switchAccountMode(isLoggedIn()?'profile':getAccount()?'login':'signup');});
$('switchModeButton').addEventListener('click',()=>switchAccountMode(accountMode==='signup'?'login':'signup'));
async function hashStorePassword(password,saltHex){if(!crypto?.subtle)throw new Error('تشفير كلمات المرور غير متاح في هذا السياق؛ افتح VoidOS عبر HTTPS أو localhost.');const bytes=new TextEncoder().encode(password);const key=await crypto.subtle.importKey('raw',bytes,'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(saltHex),iterations:150000,hash:'SHA-256'},key,256);return Array.from(new Uint8Array(bits),b=>b.toString(16).padStart(2,'0')).join('');}
function randomSalt(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');}
$('signupForm').addEventListener('submit',async e=>{e.preventDefault();if(getAccount()){accountNote('يوجد حساب تجريبي محفوظ بالفعل. سجّل الدخول أو احذف الحساب الحالي.');return;}const username=$('signupUsername').value.trim(),email=$('signupEmail').value.trim(),password=$('signupPassword').value;if(username.length<2||password.length<8){accountNote('اسم المستخدم يجب أن يتكون من حرفين على الأقل وكلمة المرور من 8 أحرف على الأقل.');return;}try{const salt=randomSalt(),hash=await hashStorePassword(password,salt);localStorage.setItem(STORAGE.account,JSON.stringify({username,email,salt,hash,iterations:150000,createdAt:new Date().toISOString()}));localStorage.setItem(STORAGE.session,username);switchAccountMode('profile');accountNote('تم إنشاء الحساب التجريبي محليًا. تُحفظ بصمة كلمة المرور بدل النص الأصلي، لكن الحساب لا يزال محليًا وغير مناسب للمعلومات الحساسة.');toast('مرحبًا بك في Void Store.');}catch(err){accountNote(err.message||'تعذّر إنشاء الحساب في هذا المتصفح.');}});
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();const a=getAccount(),username=$('loginUsername').value.trim(),password=$('loginPassword').value;if(!a||a.username!==username){accountNote('اسم المستخدم أو كلمة المرور غير صحيحة.');return;}try{let valid=false;if(a.salt&&a.hash){valid=(await hashStorePassword(password,a.salt))===a.hash;}else if(typeof a.password==='string'){valid=a.password===password;if(valid){const salt=randomSalt(),hash=await hashStorePassword(password,salt);localStorage.setItem(STORAGE.account,JSON.stringify({username:a.username,email:a.email||'',salt,hash,iterations:150000,migratedAt:new Date().toISOString()}));}}if(!valid){accountNote('اسم المستخدم أو كلمة المرور غير صحيحة.');return;}localStorage.setItem(STORAGE.session,a.username);switchAccountMode('profile');accountNote('تم تسجيل الدخول إلى الحساب التجريبي المحلي.');}catch(err){accountNote(err.message||'تعذّر التحقق من الحساب.');}});
$('editProfileForm').addEventListener('submit',e=>{e.preventDefault();const a=getAccount(),name=$('editUsername').value.trim();if(!a||name.length<2){accountNote('اكتب اسمًا من حرفين على الأقل.');return;}a.username=name;try{localStorage.setItem(STORAGE.account,JSON.stringify(a));localStorage.setItem(STORAGE.session,name);showProfile();accountNote('تم تحديث اسم المستخدم.');}catch{accountNote('تعذّر تحديث الحساب.');}});
$('logoutButton').addEventListener('click',()=>{try{localStorage.removeItem(STORAGE.session);}catch{}$('accountButtonText').textContent='حسابي';switchAccountMode('login');accountNote('تم تسجيل الخروج.');});
$('deleteAccountButton').addEventListener('click',()=>{if(confirm('هل تريد حذف الحساب التجريبي المحلي؟')){try{localStorage.removeItem(STORAGE.account);localStorage.removeItem(STORAGE.session);}catch{}$('signupForm').reset();$('accountButtonText').textContent='حسابي';switchAccountMode('signup');accountNote('تم حذف الحساب التجريبي.');}});

renderApps();
// Consume a one-shot search request sent by the CHAOS kernel.
try {
  const pending = JSON.parse(localStorage.getItem('voidos_store_pending_search_v1') || 'null');
  if (pending && pending.query && Date.now() - Number(pending.created || 0) < 120000) {
    localStorage.removeItem('voidos_store_pending_search_v1');
    $('searchInput').value = String(pending.query).slice(0, 100);
    activeFilter = 'all';
    document.querySelectorAll('.category-button').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
    renderApps();
    toast(pending.intent === 'download' ? 'بحث CHAOS جاهز؛ اختر عنصرًا متاحًا فعليًا للتشغيل.' : 'تم فتح نتائج البحث المطلوبة من CHAOS.');
  }
} catch (_) {}
      
