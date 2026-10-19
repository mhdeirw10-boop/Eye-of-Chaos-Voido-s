// Add-on settings panel. The original settings inline code is intentionally unchanged.
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.settings-container');
  if (!main) return;
  const CHAT_KEY = 'chaos_chat_history';
  const CURRENT_KEY = 'chaos_current_session';
  const MEMORY_KEY = 'chaos_saved_memories_v1';
  const extension = document.createElement('section');
  extension.className = 'settings-extension';
  extension.innerHTML = `
    <div class="setting-card">
      <h3>الذكريات المحفوظة يدويًا — CHAOS SYSTEM</h3>
      <p>احفظ معلومات تختارها بنفسك ليستطيع النظام استرجاعها بأوامر الذاكرة. هذا السجل مستقل عن سجل المحادثات وعن سجل التفاعلات التلقائي.</p>
      <textarea id="savedMemoryInput" maxlength="2000" placeholder="اكتب معلومة تريد من CHAOS SYSTEM تذكّرها..."></textarea>
      <input id="savedMemorySearch" type="search" class="extension-search" placeholder="ابحث داخل الذكريات المحفوظة…" autocomplete="off">
      <div class="extension-actions"><button type="button" class="extension-btn" id="saveManualMemory">حفظ الذكرى</button></div>
      <p class="extension-muted" id="savedMemoryCount"></p>
      <ul class="saved-memory-list" id="savedMemoryList"></ul>
      <div class="extension-status" id="savedMemoryStatus" role="status" aria-live="polite"></div>
    </div>
    <div class="setting-card">
      <h3>إدارة سجل المحادثات والبيانات</h3>
      <p>سجل المحادثات منفصل عن ذاكرة CHAOS SYSTEM. التصدير ينشئ نسخة JSON محلية؛ ومسح المحادثات لا يمس الذكريات أو ذاكرة النظام.</p>
      <p class="extension-muted" id="chatHistoryCount"></p>
      <div class="extension-actions">
        <button type="button" class="extension-btn" id="exportChaosData">تصدير المحادثات والذكريات JSON</button>
        <button type="button" class="extension-btn" id="chooseChaosBackup">استيراد نسخة احتياطية JSON</button>
        <button type="button" class="extension-btn danger" id="clearChatHistory">مسح سجل المحادثات فقط</button>
        <input id="chaosBackupFile" type="file" accept="application/json,.json" hidden>
      </div>
      <div class="extension-status" id="chatDataStatus" role="status" aria-live="polite"></div>
    </div>
    <div class="setting-card">
      <h3>التعلم المحلي الاختياري</h3>
      <p>عند التفعيل، يمكن لأمر «تعلّم نمط: نص» حفظ إحصاءات حروف محدودة محليًا. لا يجري التدريب تلقائيًا عند إرسال الرسائل، ولا ينشئ ذلك نموذجًا لغويًا.</p>
      <label class="extension-toggle"><input type="checkbox" id="localLearningToggle" checked> السماح بالتعلم اليدوي</label>
      <p class="extension-muted" id="localLearningStatus" role="status"></p>
    </div>
    <div class="setting-card">
      <h3>شخصية CHAOS SYSTEM السردية</h3>
      <p>تغيّر تدريجي خيالي في نبرة الردود اعتمادًا على عدد الزيارات والتفاعلات المحلية فقط. لا تستخدم الموقع أو الحساسات ولا تدّعي وعيًا حقيقيًا.</p>
      <label class="extension-toggle"><input type="checkbox" id="hauntingPersonaToggle" checked> تفعيل التصاعد السردي</label>
      <p class="extension-muted" id="hauntingPersonaStatus" role="status"></p>
      <div class="extension-actions"><button type="button" class="extension-btn" id="resetHauntingPersona">إعادة ضبط مرحلة الشخصية</button></div>
    </div>
    <div class="setting-card">
      <h3>تشخيص CHAOS SYSTEM</h3>
      <p>يفحص توفر التخزين والوحدات الأساسية والاتصال المعلن من المتصفح. لا يرفع التقرير إلى أي جهة.</p>
      <div class="extension-actions"><button type="button" class="extension-btn" id="runChaosDiagnostics">تشغيل التشخيص</button></div>
      <pre id="chaosDiagnosticsOutput" class="diagnostics-output" aria-live="polite">لم يُشغّل التشخيص بعد.</pre>
    </div>`;
  const statusLog = document.getElementById('statusLog');
  main.appendChild(extension);

  const $ = id => document.getElementById(id);
  function readJSON(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value == null ? fallback : value; }
    catch (_) { return fallback; }
  }
  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function renderMemories() {
    const allMemories = window.ChaosSavedMemory ? window.ChaosSavedMemory.list() : readJSON(MEMORY_KEY, []);
    const search = ($('savedMemorySearch')?.value || '').trim().toLocaleLowerCase();
    const memories = allMemories.filter(memory => !search || String(memory.text || '').toLocaleLowerCase().includes(search));
    $('savedMemoryCount').textContent = `عدد الذكريات اليدوية: ${memories.length} / 100`;
    const list = $('savedMemoryList'); list.textContent = '';
    if (!memories.length) { const li = document.createElement('li'); li.className = 'extension-muted'; li.textContent = 'لا توجد ذكريات محفوظة بعد.'; list.appendChild(li); return; }
    memories.forEach(memory => {
      const li = document.createElement('li'); li.className = 'saved-memory-item';
      const content = document.createElement('div'); content.className = 'saved-memory-text';
      content.appendChild(document.createTextNode(memory.text));
      const date = document.createElement('small'); date.className = 'saved-memory-date';
      date.textContent = memory.createdAt ? new Date(memory.createdAt).toLocaleString() : '';
      content.appendChild(date);
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'extension-btn danger'; remove.textContent = 'حذف';
      remove.addEventListener('click', () => {
        if (!confirm('هل تريد حذف هذه الذكرى المحفوظة نهائيًا؟')) return;
        const ok = window.ChaosSavedMemory ? window.ChaosSavedMemory.remove(memory.id) : false;
        $('savedMemoryStatus').textContent = ok ? 'تم حذف الذكرى.' : 'تعذر حذف الذكرى.';
        renderMemories();
      });
      li.append(content, remove); list.appendChild(li);
    });
  }
  function renderChatCount() {
    const chats = readJSON(CHAT_KEY, []);
    const count = Array.isArray(chats) ? chats.length : 0;
    const messages = Array.isArray(chats) ? chats.reduce((sum, chat) => sum + (Array.isArray(chat.messages) ? chat.messages.length : 0), 0) : 0;
    $('chatHistoryCount').textContent = `المحادثات المحفوظة: ${count} — الرسائل: ${messages}`;
  }
  $('savedMemorySearch').addEventListener('input', renderMemories);
  $('saveManualMemory').addEventListener('click', () => {
    const result = window.ChaosSavedMemory ? window.ChaosSavedMemory.add($('savedMemoryInput').value) : { ok:false, message:'وحدة الذاكرة غير متصلة.' };
    $('savedMemoryStatus').textContent = result.message;
    if (result.ok) $('savedMemoryInput').value = '';
    renderMemories();
  });
  $('exportChaosData').addEventListener('click', () => {
    const data = {
      format: 'eye-of-chaos-backup',
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      chatHistory: readJSON(CHAT_KEY, []),
      currentSessionId: localStorage.getItem(CURRENT_KEY),
      savedMemories: readJSON(MEMORY_KEY, []),
      automaticLongTermMemory: readJSON('chaos_persistent_long_term', null),
      webMemory: readJSON('chaos_web_memory', null),
      shortTermBuffer: readJSON('chaos_short_term_buffer', null),
      legacyLongTermMemory: readJSON('chaos_long_term_memory', null),
      memoryEnabled: localStorage.getItem('chaosMemoryEnabled'),
      theme: localStorage.getItem('chaosTheme'),
      hauntingEnabled: localStorage.getItem('chaosHauntingEnabled'),
      learningEnabled: localStorage.getItem('chaosLearningEnabled')
    };
    downloadJSON('eye-of-chaos-data-backup.json', data);
    $('chatDataStatus').textContent = 'تم تجهيز نسخة JSON للتنزيل. احتفظ بها في مكان آمن.';
  });
  $('clearChatHistory').addEventListener('click', () => {
    if (!confirm('سيتم حذف سجل محادثات CHAOS SYSTEM المحلي فقط. لن تُحذف الذكريات. هل تريد المتابعة؟')) return;
    localStorage.removeItem(CHAT_KEY); localStorage.removeItem(CURRENT_KEY);
    $('chatDataStatus').textContent = 'تم مسح سجل المحادثات فقط. افتح CHAOS SYSTEM لإنشاء جلسة جديدة.';
    renderChatCount();
  });
  $('chooseChaosBackup').addEventListener('click', () => $('chaosBackupFile').click());
  $('chaosBackupFile').addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('حجم النسخة أكبر من 10 ميغابايت.');
      const backup = JSON.parse(await file.text());
      if (!backup || typeof backup !== 'object' || Array.isArray(backup)) throw new Error('بنية ملف النسخة غير صحيحة.');
      if (!Array.isArray(backup.chatHistory) || !Array.isArray(backup.savedMemories)) throw new Error('الملف لا يحتوي على سجل المحادثات والذكريات بالصيغة المتوقعة.');
      if (!confirm(`سيتم استبدال سجل المحادثات والذكريات اليدوية الحالية بالبيانات الموجودة في الملف «${file.name}». قد لا يمكن التراجع دون نسخة أخرى. هل تريد المتابعة؟`)) return;
      const validChats = backup.chatHistory.filter(c => c && typeof c.id === 'string' && Array.isArray(c.messages)).map(c => ({
        id: c.id, title: typeof c.title === 'string' ? c.title.slice(0, 80) : 'محادثة مستوردة',
        createdAt: Number(c.createdAt) || Date.now(), updatedAt: Number(c.updatedAt) || Number(c.createdAt) || Date.now(),
        messages: c.messages.filter(m => m && (m.role === 'user' || m.role === 'assistant')).map(m => ({ role:m.role, content:String(m.content ?? '').slice(0,50000), timestamp:Number(m.timestamp)||Date.now() })).slice(0,5000)
      }));
      const validMemories = backup.savedMemories.filter(m => m && typeof m.text === 'string').slice(0,100).map(m => ({
        id: typeof m.id === 'string' ? m.id : 'import_' + Math.random().toString(36).slice(2),
        text: m.text.slice(0,2000), source: typeof m.source === 'string' ? m.source : 'import',
        createdAt: Number(m.createdAt) || Date.now(), updatedAt: Number(m.updatedAt) || Number(m.createdAt) || Date.now()
      }));
      localStorage.setItem(CHAT_KEY, JSON.stringify(validChats));
      localStorage.setItem(MEMORY_KEY, JSON.stringify(validMemories));
      if (backup.currentSessionId && validChats.some(c => c.id === backup.currentSessionId)) localStorage.setItem(CURRENT_KEY, backup.currentSessionId);
      else localStorage.removeItem(CURRENT_KEY);
      const mapping = { automaticLongTermMemory:'chaos_persistent_long_term', webMemory:'chaos_web_memory', shortTermBuffer:'chaos_short_term_buffer', legacyLongTermMemory:'chaos_long_term_memory' };
      Object.entries(mapping).forEach(([field,key]) => { if (Object.prototype.hasOwnProperty.call(backup,field)) { if (backup[field] === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(backup[field])); } });
      if (typeof backup.memoryEnabled === 'string') localStorage.setItem('chaosMemoryEnabled', backup.memoryEnabled === 'false' ? 'false' : 'true');
      if (typeof backup.theme === 'string') localStorage.setItem('chaosTheme', backup.theme);
      if (typeof backup.hauntingEnabled === 'string') localStorage.setItem('chaosHauntingEnabled', backup.hauntingEnabled === 'false' ? 'false' : 'true');
      if (typeof backup.learningEnabled === 'string') localStorage.setItem('chaosLearningEnabled', backup.learningEnabled === 'false' ? 'false' : 'true');
      $('chatDataStatus').textContent = `تم استيراد ${validChats.length} محادثة و${validMemories.length} ذكرى. أعد تحميل الصفحات المفتوحة لتظهر البيانات.`;
      renderMemories(); renderChatCount();
    } catch (error) { $('chatDataStatus').textContent = 'فشل الاستيراد: ' + (error.message || 'ملف غير صالح.'); }
    finally { event.target.value = ''; }
  });
  const learningToggle = $('localLearningToggle');
  if (learningToggle) {
    learningToggle.checked = localStorage.getItem('chaosLearningEnabled') !== 'false';
    learningToggle.addEventListener('change', () => {
      localStorage.setItem('chaosLearningEnabled', learningToggle.checked ? 'true' : 'false');
      $('localLearningStatus').textContent = learningToggle.checked ? 'التعلم اليدوي مسموح، لكنه لا يعمل إلا عند استخدام الأمر الصريح.' : 'تم إيقاف حفظ أنماط لغوية جديدة.';
    });
    $('localLearningStatus').textContent = learningToggle.checked ? 'التعلم اليدوي مسموح عند الطلب فقط.' : 'التعلم المحلي متوقف.';
  }

  const hauntingToggle = $('hauntingPersonaToggle');
  const hauntingStatus = $('hauntingPersonaStatus');
  if (hauntingToggle) {
    hauntingToggle.checked = localStorage.getItem('chaosHauntingEnabled') !== 'false';
    const renderHauntingStatus = () => {
      const state = window.ChaosHauntingPersona ? window.ChaosHauntingPersona.status() : null;
      hauntingStatus.textContent = state ? `المرحلة الحالية: ${state.name} — الزيارات: ${state.visits} — التفاعلات: ${state.interactions}` : 'ستُقرأ حالة الشخصية عند فتح الطرفية.';
    };
    hauntingToggle.addEventListener('change', () => {
      localStorage.setItem('chaosHauntingEnabled', hauntingToggle.checked ? 'true' : 'false');
      hauntingStatus.textContent = hauntingToggle.checked ? 'تم تفعيل التصاعد السردي المحلي.' : 'تم إيقاف التصاعد السردي؛ تبقى بقية وظائف النظام مستقلة.';
    });
    $('resetHauntingPersona')?.addEventListener('click', () => {
      if (!confirm('إعادة عداد الزيارات والتفاعلات إلى الصفر؟ لن تُحذف المحادثات أو الذكريات.')) return;
      if (window.ChaosHauntingPersona) window.ChaosHauntingPersona.reset();
      else { try { localStorage.removeItem('chaos_haunting_state_v1'); } catch (_) {} }
      hauntingStatus.textContent = 'أُعيد ضبط عدادات الشخصية. ستبدأ المرحلة من جديد عند فتح الطرفية.';
    });
    renderHauntingStatus();
  }

  $('runChaosDiagnostics').addEventListener('click', () => {
    const output = $('chaosDiagnosticsOutput');
    output.textContent = window.ChaosDiagnostics ? window.ChaosDiagnostics.report() : 'وحدة التشخيص غير متاحة في هذه الصفحة.';
  });

  // Confirm the existing purge button without rewriting its original implementation.
  const purge = $('clearMemoryBtn');
  if (purge) purge.addEventListener('click', event => {
    if (!confirm('سيتم مسح ذاكرة التفاعلات طويلة المدى وذاكرة الويب والذكريات اليدوية المحفوظة. لن يُمس سجل المحادثات أو إعداد تفعيل الذاكرة. هل تريد المتابعة؟')) {
      event.preventDefault(); event.stopImmediatePropagation();
      if (statusLog) statusLog.textContent = 'تم إلغاء عملية مسح الذاكرة.';
      return;
    }
    if (window.ChaosSavedMemory) window.ChaosSavedMemory.clear();
    else localStorage.removeItem(MEMORY_KEY);
    ['chaos_web_memory', 'chaos_short_term_buffer', 'chaos_long_term_memory'].forEach(key => localStorage.removeItem(key));
    setTimeout(renderMemories, 0);
  }, true);
  renderMemories(); renderChatCount();
});
