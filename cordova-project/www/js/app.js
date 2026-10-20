// CHAOS SYSTEM — Local-first conversation manager (v1.3)
// Chat history is deliberately separate from all memory stores.
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const $ = id => document.getElementById(id);
  const input = $('cmd'), output = $('out'), sendButton = $('sendBtn');
  const historySidebar = $('historySidebar'), historyList = $('historyList');
  const menuButton = $('menu'), openHistoryButton = $('openHistorySidebar');
  const closeHistoryButton = $('closeHistorySidebar'), newChatButton = $('newChatBtn');
  const searchInput = $('historySearch');
  const CHAT_KEY = 'chaos_chat_history', CURRENT_KEY = 'chaos_current_session';
  let sessions = loadSessions(), currentSession = getCurrentSession(), requestInProgress = false;
  if (window.ChaosHauntingPersona) window.ChaosHauntingPersona.onVisit();

  function loadSessions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(s => s && typeof s.id === 'string').map(s => ({
        id: s.id, title: typeof s.title === 'string' && s.title.trim() ? s.title : 'محادثة جديدة',
        createdAt: Number(s.createdAt) || Date.now(), updatedAt: Number(s.updatedAt) || Number(s.createdAt) || Date.now(),
        messages: Array.isArray(s.messages) ? s.messages.filter(m => m && (m.role === 'user' || m.role === 'assistant')).map(m => ({
          role: m.role, content: String(m.content ?? ''), timestamp: Number(m.timestamp) || Date.now()
        })) : []
      }));
    } catch (e) { console.error('[CHAOS] chat history read failed', e); return []; }
  }
  function saveSessions() {
    try { localStorage.setItem(CHAT_KEY, JSON.stringify(sessions)); return true; }
    catch (e) { console.error('[CHAOS] chat history save failed', e); announce('تعذر الحفظ؛ قد تكون مساحة التخزين ممتلئة. صدّر نسخة احتياطية أو احذف بيانات غير لازمة.'); return false; }
  }
  function announce(message) { const status = $('terminalStatus'); if (status) status.textContent = message; }
  function createSession() {
    const now = Date.now();
    const session = { id: 'session_' + now.toString(36) + '_' + Math.random().toString(36).slice(2, 8), title: 'محادثة جديدة', createdAt: now, updatedAt: now, messages: [] };
    sessions.unshift(session); saveSessions(); setCurrent(session.id); return session;
  }
  function setCurrent(id) { try { localStorage.setItem(CURRENT_KEY, id); } catch (_) {} }
  function getCurrentSession() {
    let id = null; try { id = localStorage.getItem(CURRENT_KEY); } catch (_) {}
    const found = id ? sessions.find(s => s.id === id) : null;
    return found || sessions[0] || createSession();
  }
  function languageIsEnglish() { return !!(window.ChaosTerminalLanguage && window.ChaosTerminalLanguage.getLanguage() === 'en'); }
  function renderCurrentSession() {
    if (!output) return;
    if (!currentSession || !currentSession.messages.length) {
      output.textContent = languageIsEnglish()
        ? '> CHAOS SYSTEM ONLINE\n> Local-first mode. Type help for capabilities.\n> Memory: save: fact | recall: keyword | memories\n> Web: search: topic (internet required)'
        : '> CHAOS SYSTEM متصل\n> الوضع المحلي أولًا. اكتب help لعرض الإمكانات.\n> الذاكرة: احفظ: معلومة | تذكر: كلمة | ذكرياتي\n> الويب: بحث: موضوع (يتطلب اتصالًا بالإنترنت)';
      output.scrollTop = 0; return;
    }
    const lines = [];
    currentSession.messages.forEach(m => { lines.push(m.role === 'user' ? (languageIsEnglish() ? '[YOU]' : '[أنت]') : '[CHAOS SYSTEM]'); lines.push(m.content); lines.push(''); });
    output.textContent = lines.join('\n').trimEnd(); output.scrollTop = output.scrollHeight;
  }
  function renderHistory() {
    if (!historyList) return;
    historyList.replaceChildren();
    const term = (searchInput?.value || '').trim().toLocaleLowerCase();
    const filtered = sessions.filter(s => !term || s.title.toLocaleLowerCase().includes(term) || s.messages.some(m => m.content.toLocaleLowerCase().includes(term)));
    if (!filtered.length) {
      const empty = document.createElement('li'); empty.className = 'history-empty';
      empty.textContent = term ? 'لا توجد نتائج مطابقة.' : 'لا توجد محادثات محفوظة.'; historyList.appendChild(empty); return;
    }
    filtered.forEach(s => {
      const item = document.createElement('li'); item.className = 'history-item' + (currentSession?.id === s.id ? ' active' : '');
      const select = document.createElement('button'); select.type = 'button'; select.className = 'history-select'; select.dataset.sessionId = s.id;
      select.textContent = `${s.title} · ${s.messages.length} رسالة`; select.title = s.title;
      const actions = document.createElement('div'); actions.className = 'history-actions';
      const rename = document.createElement('button'); rename.type = 'button'; rename.className = 'history-action'; rename.textContent = 'إعادة تسمية'; rename.setAttribute('aria-label', 'إعادة تسمية ' + s.title);
      rename.addEventListener('click', () => { const next = prompt('اكتب اسم المحادثة الجديد:', s.title); if (next === null) return; const value = next.trim(); if (!value) { announce('اسم المحادثة لا يمكن أن يكون فارغًا.'); return; } s.title = value.slice(0, 80); s.updatedAt = Date.now(); saveSessions(); renderHistory(); });
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'history-action danger'; remove.textContent = 'حذف'; remove.setAttribute('aria-label', 'حذف ' + s.title);
      remove.addEventListener('click', () => { if (!confirm(`حذف المحادثة «${s.title}» نهائيًا؟ لا يؤثر هذا على الذكريات المحفوظة.`)) return; sessions = sessions.filter(x => x.id !== s.id); if (currentSession?.id === s.id) currentSession = sessions[0] || createSession(); setCurrent(currentSession.id); saveSessions(); renderCurrentSession(); renderHistory(); announce('تم حذف المحادثة المحددة.'); });
      actions.append(rename, remove); item.append(select, actions); historyList.appendChild(item);
    });
  }
  function setHistoryOpen(open) { if (!historySidebar) return; historySidebar.classList.toggle('active', open); if (menuButton) menuButton.setAttribute('aria-expanded', String(open)); if (openHistoryButton) openHistoryButton.setAttribute('aria-expanded', String(open)); if (open) searchInput?.focus(); }
  const toggleHistory = () => setHistoryOpen(!historySidebar?.classList.contains('active'));
  menuButton?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleHistory(); });
  openHistoryButton?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleHistory(); });
  closeHistoryButton?.addEventListener('click', () => setHistoryOpen(false));
  newChatButton?.addEventListener('click', () => { currentSession = createSession(); renderCurrentSession(); renderHistory(); setHistoryOpen(false); input?.focus(); });
  searchInput?.addEventListener('input', renderHistory);
  historyList?.addEventListener('click', e => { const btn = e.target.closest('[data-session-id]'); if (!btn) return; const selected = sessions.find(s => s.id === btn.dataset.sessionId); if (!selected) return; currentSession = selected; setCurrent(selected.id); renderCurrentSession(); renderHistory(); setHistoryOpen(false); });
  document.addEventListener('click', e => { if (!historySidebar?.classList.contains('active')) return; if (historySidebar.contains(e.target) || menuButton?.contains(e.target) || openHistoryButton?.contains(e.target)) return; setHistoryOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setHistoryOpen(false); if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setHistoryOpen(true); } });

  async function getResponse(query) {
    const q = query.trim();
    if (window.ChaosSecurity?.inspectQuery) { const security = window.ChaosSecurity.inspectQuery(q); if (!security.safe) { window.ChaosSecurity.audit?.('terminal-input-blocked', security.code || security.reason); return 'رفضت طبقة الأمان الطلب: ' + security.reason; } }
    if (window.CHAOS?.routeIntent) { const routed = window.CHAOS.routeIntent(q); if (routed?.handled) return routed.message; }
    if (/^(help|مساعدة|الأوامر|اوامر)$/i.test(q)) return [
      'الأوامر المتاحة:',
      '• احفظ: معلومة — حفظ ذكرى يدوية', '• تذكر: كلمة — البحث في الذكريات اليدوية', '• ذكرياتي — عرض الذكريات', '• حدّث ذكرى: النص القديم => النص الجديد — تحديث بعد التأكيد', '• احذف من الذاكرة: النص — حذف نص مطابق بعد التأكيد',
      '• بحث: موضوع — بحث صريح عبر ويكيبيديا عند توفر الإنترنت', '• تعلّم نمط: نص — حفظ إحصاءات حروف محليًا بعد طلبك فقط', '• حالة الكيان — عرض مرحلة السرد المحلية', '• status — حالة الوحدات والتخزين', '• diagnostics — تقرير تشخيصي',
      '• clear — مسح عرض المحادثة الحالية ورسائلها (مع تأكيد)',
      'تنبيه: هذه نسخة محلية قائمة على قواعد وأوامر؛ ليست نموذجًا لغويًا عامًا، ولا تنفذ أوامر نظام التشغيل.'
    ].join('\n');
    if (/^(status|diagnostics|تشخيص|حالة النظام)$/i.test(q)) {
      if (window.ChaosDiagnostics) return window.ChaosDiagnostics.report();
      return 'وحدة التشخيص غير متصلة. تحقق من تحميل js/brain/diagnostics.js.';
    }
    const searchMatch = q.match(/^(?:بحث|ابحث في الويب|search|search web)\s*[:：]\s*(.+)$/i);
    if (searchMatch) {
      const topic = searchMatch[1].trim();
      if (!topic) return 'اكتب موضوع البحث بعد النقطتين.';
      if (!navigator.onLine) return 'لا يوجد اتصال بالشبكة حاليًا. لم يُنفّذ البحث، ويمكنك المحاولة عند الاتصال.';
      if (typeof ChaosWebSearch === 'undefined') return 'وحدة البحث غير متصلة.';
      const result = await ChaosWebSearch.searchWeb(topic);
      return result ? ChaosWebSearch.formatSearchResponse(result, topic) : 'لم أتمكن من الحصول على نتيجة. قد يكون الاتصال محجوبًا أو واجهة البحث غير متاحة. لم أخترع نتيجة بديلة.';
    }
    const learnMatch = q.match(/^(?:تعلّم نمط|تعلم نمط|learn pattern)\s*[:：]\s*(.+)$/is);
    if (learnMatch) {
      if (!window.ChaosTextEngine) return 'محرك الأنماط غير متصل.';
      return window.ChaosTextEngine.trainOnText(learnMatch[1]);
    }
    if (/^(?:حالة الكيان|persona status|haunting status)$/i.test(q)) {
      if (!window.ChaosHauntingPersona) return 'وحدة الشخصية غير متصلة.';
      const st = window.ChaosHauntingPersona.status();
      return `مرحلة السرد: ${st.name} (${st.stage})\nالزيارات المحلية: ${st.visits}\nالتفاعلات: ${st.interactions}\nمفعّلة: ${st.enabled ? 'نعم' : 'لا'}\n${st.description}`;
    }
    if (/^(clear|مسح المحادثة)$/i.test(q)) {
      if (!confirm('مسح رسائل المحادثة الحالية؟ لن تُحذف المحادثات الأخرى أو الذكريات.')) return 'تم إلغاء المسح.';
      currentSession.messages = []; currentSession.updatedAt = Date.now(); saveSessions(); renderCurrentSession(); renderHistory(); return '__CHAT_CLEARED__';
    }
    if (window.ChaosSavedMemory?.handleQuery) { const memoryResponse = window.ChaosSavedMemory.handleQuery(q); if (memoryResponse !== null) return memoryResponse; }
    if (typeof window.ChaosCommands?.execute === 'function') {
      const response = await window.ChaosCommands.execute(q);
      if (typeof response === 'string' && /Bleeding Sanity: تعذر على النواة تحليل|لا يوجد رد من الأوامر/.test(response)) {
        const memories = window.ChaosSavedMemory?.search(q.split(/\s+/).filter(w => w.length > 2).slice(0, 4).join(' ')) || [];
        if (memories.length) {
          const memoryFallback = 'لم أجد إجابة في قاعدة الأوامر. توجد آثار محفوظة قد تكون ذات صلة، لكنها ليست تحققًا مستقلًا من صحة المعلومات.';
          return window.ChaosHauntingPersona ? window.ChaosHauntingPersona.respond(q, memoryFallback) : memoryFallback + '\n' + memories.slice(0, 5).map((m, i) => `${i + 1}. ${m.text}`).join('\n');
        }
        return window.ChaosHauntingPersona ? window.ChaosHauntingPersona.respond(q, response) : response;
      }
      return response;
    }
    return 'وحدة الأوامر غير متصلة. تحقق من تحميل js/brain/commands.js.';
  }
  async function submitQuery() {
    if (!input || requestInProgress) return;
    const query = input.value.trim(); if (!query) return; input.value = '';
    if (window.ChaosHauntingPersona) window.ChaosHauntingPersona.observe();
    const session = currentSession || createSession(); currentSession = session;
    session.messages.push({ role: 'user', content: query, timestamp: Date.now() }); session.updatedAt = Date.now();
    if (session.messages.filter(m => m.role === 'user').length === 1 && session.title === 'محادثة جديدة') session.title = query.length > 42 ? query.slice(0, 42) + '…' : query;
    saveSessions(); renderCurrentSession(); renderHistory(); requestInProgress = true; if (sendButton) sendButton.disabled = true; if (input) input.disabled = true;
    try {
      const response = await getResponse(query);
      if (response !== '__CHAT_CLEARED__') session.messages.push({ role: 'assistant', content: String(response ?? ''), timestamp: Date.now() });
    } catch (error) { console.error('[CHAOS] request failed', error); session.messages.push({ role: 'assistant', content: 'تعذر إكمال الطلب. افحص الاتصال أو افتح الإعدادات وشغّل التشخيص. لم يتم تجاهل الخطأ بصمت.', timestamp: Date.now() }); }
    finally { session.updatedAt = Date.now(); saveSessions(); requestInProgress = false; if (sendButton) sendButton.disabled = false; if (input) { input.disabled = false; input.focus(); } renderCurrentSession(); renderHistory(); }
  }
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submitQuery(); } });
  sendButton?.addEventListener('click', submitQuery);
  renderCurrentSession(); renderHistory();
  console.info('[CHAOS] local-first conversation manager ready.');
});
