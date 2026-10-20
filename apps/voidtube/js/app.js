(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const grid = $("#videoGrid");
  const empty = $("#emptyState");
  const searchInput = $("#searchInput");
  const MAX_DURATION_SECONDS = 60 * 60;
  const state = {
    view: "home", category: "الكل", query: "", sort: "default",
    currentVideo: null, comments: [], localVideos: [],
    liked: readSet("voidtube_liked"), disliked: readSet("voidtube_disliked"),
    saved: readSet("voidtube_saved"), subscriptions: readSet("voidtube_subscriptions"),
    history: readArray("voidtube_history"), localVoteDeltas: readObject("voidtube_vote_deltas")
  };
  function readSet(key){ try{return new Set(JSON.parse(localStorage.getItem(key)||"[]"));}catch(_){return new Set();} }
  function readArray(key){ try{return JSON.parse(localStorage.getItem(key)||"[]");}catch(_){return [];} }
  function readObject(key){try{return JSON.parse(localStorage.getItem(key)||"{}");}catch(_){return {};}}
  function persist(){
    try{
      localStorage.setItem("voidtube_liked",JSON.stringify([...state.liked]));
      localStorage.setItem("voidtube_disliked",JSON.stringify([...state.disliked]));
      localStorage.setItem("voidtube_saved",JSON.stringify([...state.saved]));
      localStorage.setItem("voidtube_subscriptions",JSON.stringify([...state.subscriptions]));
      localStorage.setItem("voidtube_history",JSON.stringify(state.history.slice(0,100)));
      localStorage.setItem("voidtube_vote_deltas",JSON.stringify(state.localVoteDeltas));
    }catch(_){toast("تعذر حفظ التغييرات على هذا المتصفح.");}
  }
  function allVideos(){return [...(window.VOIDTUBE_VIDEOS||[]),...state.localVideos];}
  function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function formatViews(n){return new Intl.NumberFormat("ar").format(n||0)+" مشاهدة";}
  function formatCount(n){return new Intl.NumberFormat("ar").format(Math.max(0,n||0));}
  function getVoteDelta(id){return state.localVoteDeltas[id]||{likes:0,dislikes:0};}
  function likeCount(v){return Math.max(0,(v.likes||0)+getVoteDelta(v.id).likes);}
  function dislikeCount(v){return Math.max(0,(v.dislikes||0)+getVoteDelta(v.id).dislikes);}
  function channelVideoCount(channelId){return allVideos().filter(v=>v.channelId===channelId).length;}
  function filteredVideos(){
    let videos=allVideos();
    if(state.view==="trending") videos.sort((a,b)=>(b.views||0)-(a.views||0));
    if(state.view==="saved") videos=videos.filter(v=>state.saved.has(v.id));
    if(state.view==="liked") videos=videos.filter(v=>state.liked.has(v.id));
    if(state.view==="disliked") videos=videos.filter(v=>state.disliked.has(v.id));
    if(state.view==="subscriptions") videos=videos.filter(v=>state.subscriptions.has(v.channelId));
    if(state.view==="history") videos=videos.filter(v=>state.history.includes(v.id)).sort((a,b)=>state.history.indexOf(a.id)-state.history.indexOf(b.id));
    if(state.category!=="الكل") videos=videos.filter(v=>v.category===state.category);
    if(state.query){const q=state.query.toLocaleLowerCase("ar");videos=videos.filter(v=>[v.title,v.channel,v.category].some(s=>String(s||"").toLocaleLowerCase("ar").includes(q)));}
    if(state.sort==="views") videos.sort((a,b)=>(b.views||0)-(a.views||0));
    if(state.sort==="title") videos.sort((a,b)=>a.title.localeCompare(b.title,"ar"));
    return videos;
  }
  function cardHTML(v){
    const thumb=v.thumb?`<img loading="lazy" src="${escapeHTML(v.thumb)}" alt="" onerror="this.style.display='none'">`:"";
    return `<article class="video-card" tabindex="0" role="button" data-open="${escapeHTML(v.id)}" aria-label="تشغيل ${escapeHTML(v.title)}">
      <div class="thumbnail">${thumb}<span class="thumb-play">▶</span><span class="duration">${escapeHTML(v.duration||"محلي")}</span></div>
      <div class="card-info"><div class="channel-avatar">${escapeHTML((v.channel||"V").slice(0,1))}</div><div class="card-text"><h3>${escapeHTML(v.title)}</h3><div class="channel-name">${escapeHTML(v.channel||"قناة محلية")}</div><div class="video-meta">${formatViews(v.views)} · ${escapeHTML(v.age||"مضاف من الجهاز")}</div></div><button class="card-menu" data-quick-save="${escapeHTML(v.id)}" aria-label="حفظ الفيديو" title="حفظ الفيديو">⋮</button></div>
    </article>`;
  }
  function render(){
    const videos=filteredVideos();
    grid.innerHTML=videos.map(cardHTML).join("");
    empty.hidden=videos.length>0;
    grid.hidden=videos.length===0;
    $("#resultCount").textContent=videos.length?`${formatCount(videos.length)} فيديو في هذه القائمة`:"لا توجد نتائج";
    const titles={home:"فيديوهات مقترحة",trending:"الأكثر مشاهدة",saved:"الفيديوهات المحفوظة",liked:"الفيديوهات التي أعجبتني",disliked:"الفيديوهات التي لم تعجبني",subscriptions:"قنواتي المشترَك بها",history:"سجل المشاهدة"};
    $("#sectionTitle").textContent=state.category!=="الكل"?state.category:(titles[state.view]||"نتائج البحث");
    document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view));
    document.querySelectorAll(".chip").forEach(b=>b.classList.toggle("selected",b.dataset.category===state.category));
  }
  function toast(message){
    const el=$("#toast");el.textContent=message;el.classList.add("show");
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400);
  }
  function getVideo(id){return allVideos().find(v=>v.id===id);}
  function renderPlayerActions(){
    const id=state.currentVideo;const v=getVideo(id);if(!v)return;
    $("#playerLike").classList.toggle("on",state.liked.has(id));
    $("#playerLike").setAttribute("aria-pressed",String(state.liked.has(id)));
    $("#playerLike").innerHTML=(state.liked.has(id)?"♥ أعجبني ":"♡ أعجبني ")+`<span class="action-count" id="likeCount">${formatCount(likeCount(v))}</span>`;
    $("#playerDislike").classList.toggle("on",state.disliked.has(id));
    $("#playerDislike").setAttribute("aria-pressed",String(state.disliked.has(id)));
    $("#playerDislike").innerHTML=(state.disliked.has(id)?"⊖ لم يعجبني ":"⊖ لم يعجبني ")+`<span class="action-count" id="dislikeCount">${formatCount(dislikeCount(v))}</span>`;
    $("#playerSave").classList.toggle("on",state.saved.has(id));
    $("#playerSave").textContent=state.saved.has(id)?"✓ محفوظ":"▣ حفظ";
    const isSubscribed=state.subscriptions.has(v.channelId);
    $("#subscribeButton").classList.toggle("subscribed",isSubscribed);
    $("#subscribeButton").textContent=isSubscribed?"✓ مشترك":"＋ اشتراك";
    $("#subscribeButton").setAttribute("aria-pressed",String(isSubscribed));
    $("#subscriberCount").textContent=`${formatCount((v.subscribers||0)+(isSubscribed?1:0))} مشترك تجريبي`;
  }
  function openPlayer(id){
    const v=getVideo(id);if(!v)return;
    state.currentVideo=id;state.comments=[];
    state.history=[id,...state.history.filter(x=>x!==id)].slice(0,100);persist();
    $("#playerTitle").textContent=v.title;
    $("#playerMeta").textContent=`${v.channel||"قناة محلية"} · ${formatViews(v.views)}`;
    $("#playerDescription").textContent=v.description||"لا يوجد وصف لهذا الفيديو.";
    renderPlayerActions();
    $("#commentsList").innerHTML="";
    const frame=$("#playerFrame");
    if(v.src){
      frame.innerHTML="";
      const video=document.createElement("video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=v.src;
      video.addEventListener("loadedmetadata",()=>{
        if(Number.isFinite(video.duration)&&video.duration>MAX_DURATION_SECONDS){
          video.pause();video.removeAttribute("src");video.load();
          frame.innerHTML='<div class="video-placeholder">مدة هذا الفيديو تتجاوز الحد المسموح: 60 دقيقة.</div>';
          toast("هذا الفيديو أطول من الحد الأقصى.");
        }
      });
      video.onerror=()=>{frame.innerHTML='<div class="video-placeholder">تعذر تحميل المقطع. قد تحتاج إلى اتصال بالإنترنت أو أن صيغة الملف غير مدعومة.</div>';};
      frame.appendChild(video);
    }else{
      frame.innerHTML='<div class="video-placeholder"><div style="font-size:40px">▶</div><p>هذه بطاقة تجريبية بلا ملف فيديو.</p><small>أضف ملف فيديو محليًا من زر «إضافة فيديو» لاختبار المشغّل.</small></div>';
    }
    $("#playerModal").hidden=false;document.body.style.overflow="hidden";persist();
  }
  function closePlayer(){
    $("#playerModal").hidden=true;document.body.style.overflow="";
    const v=$("#playerFrame video");if(v){v.pause();v.removeAttribute("src");v.load();}
    state.currentVideo=null;
  }
  function toggleInSet(set,id){set.has(id)?set.delete(id):set.add(id);persist();render();if(state.currentVideo===id)renderPlayerActions();}
  function changeVote(id,type){
    const v=getVideo(id);if(!v)return;
    const oldLiked=state.liked.has(id),oldDisliked=state.disliked.has(id);
    if(type==="like"){
      if(oldLiked)state.liked.delete(id);else{state.liked.add(id);state.disliked.delete(id);}
    }else{
      if(oldDisliked)state.disliked.delete(id);else{state.disliked.add(id);state.liked.delete(id);}
    }
    const delta=getVoteDelta(id);
    // Store changes relative to the original demo counts so the visible count updates consistently.
    state.localVoteDeltas[id]={likes:(delta.likes||0)+(state.liked.has(id)?1:0)-(oldLiked?1:0),dislikes:(delta.dislikes||0)+(state.disliked.has(id)?1:0)-(oldDisliked?1:0)};
    persist();render();renderPlayerActions();
  }
  function subscribeCurrentChannel(){
    const v=getVideo(state.currentVideo);if(!v)return;
    if(state.subscriptions.has(v.channelId)){state.subscriptions.delete(v.channelId);toast("ألغيت الاشتراك التجريبي.");}
    else{state.subscriptions.add(v.channelId);toast("اشتركت بالقناة محليًا.");}
    persist();render();renderPlayerActions();
  }
  document.addEventListener("click",e=>{
    const open=e.target.closest("[data-open]");if(open){openPlayer(open.dataset.open);return;}
    const save=e.target.closest("[data-quick-save]");if(save){e.stopPropagation();toggleInSet(state.saved,save.dataset.quickSave);toast(state.saved.has(save.dataset.quickSave)?"أُضيف إلى المحفوظات":"أُزيل من المحفوظات");return;}
    const nav=e.target.closest("[data-view]");if(nav){state.view=nav.dataset.view;state.category="الكل";state.query="";searchInput.value="";render();$("#sidebar").classList.remove("open");return;}
    const category=e.target.closest("[data-category]");if(category){state.category=category.dataset.category;state.view="home";render();return;}
  });
  grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".video-card")){e.preventDefault();openPlayer(e.target.dataset.open);}});
  $("#searchForm").addEventListener("submit",e=>{e.preventDefault();state.query=searchInput.value.trim();state.view="home";render();});
  searchInput.addEventListener("input",()=>{if(!searchInput.value.trim()){state.query="";render();}});
  $("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;render();});
  $("#resetFilters").addEventListener("click",()=>{state.view="home";state.category="الكل";state.query="";searchInput.value="";render();});
  $("#closePlayer").addEventListener("click",closePlayer);
  $("#playerModal").addEventListener("click",e=>{if(e.target===$("#playerModal"))closePlayer();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#playerModal").hidden)closePlayer();});
  $("#playerLike").addEventListener("click",()=>{if(state.currentVideo)changeVote(state.currentVideo,"like");});
  $("#playerDislike").addEventListener("click",()=>{if(state.currentVideo)changeVote(state.currentVideo,"dislike");});
  $("#subscribeButton").addEventListener("click",subscribeCurrentChannel);
  $("#playerSave").addEventListener("click",()=>{if(state.currentVideo)toggleInSet(state.saved,state.currentVideo);});
  $("#commentForm").addEventListener("submit",e=>{
    e.preventDefault();const value=$("#commentInput").value.trim();if(!value)return;
    state.comments.unshift(value);$("#commentsList").innerHTML=state.comments.map(c=>`<div class="comment">${escapeHTML(c)}</div>`).join("");$("#commentInput").value="";
  });
  $("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");try{localStorage.setItem("voidtube_light",document.body.classList.contains("light")?"1":"0");}catch(_){}});
  try{if(localStorage.getItem("voidtube_light")==="1")document.body.classList.add("light");}catch(_){}
  $("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  $("#uploadTrigger").addEventListener("click",()=>$("#localVideoInput").click());
  $("#localVideoInput").addEventListener("change",e=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;
    if(!file.type.startsWith("video/")){toast("اختَر ملف فيديو صالحًا.");e.target.value="";return;}
    // Reject oversized local files by metadata after loading a temporary object URL.
    const url=URL.createObjectURL(file);
    const probe=document.createElement("video");probe.preload="metadata";probe.src=url;
    probe.onloadedmetadata=()=>{
      const duration=probe.duration;
      URL.revokeObjectURL(url);
      if(!Number.isFinite(duration)||duration>MAX_DURATION_SECONDS){
        toast("لم تتم إضافة الفيديو: يجب ألا تتجاوز مدته 60 دقيقة.");e.target.value="";return;
      }
      const localUrl=URL.createObjectURL(file);
      state.localVideos.unshift({id:"local-"+Date.now(),title:file.name.replace(/\.[^.]+$/,""),channel:"من جهازي",channelId:"local-device-channel",category:"تقنية",views:0,age:"مضاف الآن",duration:Math.floor(duration/60)+":"+String(Math.floor(duration%60)).padStart(2,"0"),durationSeconds:duration,thumb:"",src:localUrl,description:"فيديو محلي للتجربة فقط. لا يُرفع إلى أي خادم.",likes:0,dislikes:0,subscribers:0});
      state.view="home";state.category="الكل";state.query="";searchInput.value="";render();toast("أُضيف الفيديو لهذه الجلسة فقط.");e.target.value="";
    };
    probe.onerror=()=>{URL.revokeObjectURL(url);toast("تعذر قراءة الفيديو. جرّب صيغة أخرى.");e.target.value="";};
  });
  $("#year").textContent=new Date().getFullYear();
  render();
})();
