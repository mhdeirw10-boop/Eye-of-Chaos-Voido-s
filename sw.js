/* Eye of Chaos offline shell. This is a cache, not a server or AI model. */
'use strict';
const CACHE_NAME = 'eye-of-chaos-shell-v2-0-0';
const SHELL = [
  "./",
  "./CHANGELOG_v1_2_1.md",
  "./CHANGELOG_v1_3_0.md",
  "./CHANGELOG_v1_4_0.md",
  "./CHANGELOG_v1_4_1.md",
  "./CHANGELOG_v1_5_0.md",
  "./CHANGELOG_v1_6_0.md",
  "./CHANGELOG_v1_7_0.md",
  "./CHANGELOG_v1_8_0.md",
  "./CHANGELOG_v1_9_0.md",
  "./CHANGELOG_v2_0_0.md",
  "./README.md",
  "./assets/character-sair-placeholder.svg",
  "./assets/character-yasin-placeholder.svg",
  "./assets/eye-of-chaos-192.png",
  "./assets/eye-of-chaos-512.png",
  "./assets/eye-of-chaos-icon.svg",
  "./apps/voidtube/assets/README.txt",
  "./apps/voidtube/css/styles.css",
  "./apps/voidtube/index.html",
  "./apps/voidtube/js/app.js",
  "./apps/voidtube/js/videos.js",
  "./apps/void-store/css/style.css",
  "./apps/void-store/index.html",
  "./apps/void-store/js/app.js",
  "./apps/void-notes/index.html",
  "./apps/void-calculator/index.html",
  "./apps/void-browserx/index.html",
  "./apps/void-browserx/README_AR.txt",
  "./apps/void-manager/index.html",
  "./apps/void-planner/index.html",
  "./apps/void-files/index.html",
  "./apps/void-calendar/index.html",
  "./chapters.html",
  "./characters.html",
  "./core.js",
  "./css/lang.css",
  "./css/layout.css",
  "./css/settings-enhancements.css",
  "./css/theme.css",
  "./index.html",
  "./js/app.js",
  "./js/chaos-layer.js",
  "./js/brain/security/policy.js",
  "./js/brain/security/input.js",
  "./js/brain/security/storage.js",
  "./js/brain/security/index.js",
  "./js/brain/aiPersona.js",
  "./js/brain/canon.js",
  "./js/brain/commands.js",
  "./js/brain/context.js",
  "./js/brain/coreEngine.js",
  "./js/brain/diagnostics.js",
  "./js/brain/emotions.js",
  "./js/brain/engine/games/GDScript Analyzer.js",
  "./js/brain/engine/games/Game Loop & States.js",
  "./js/brain/engine/games/NPC/behaviorDirector.js",
  "./js/brain/engine/games/NPC/learningCore.js",
  "./js/brain/engine/games/NPC/memoryLink.js",
  "./js/brain/engine/games/Nodes & Movement.js",
  "./js/brain/engine/games/Physics & Collisions.js",
  "./js/brain/engine/web_builder/commerceLogic.js",
  "./js/brain/engine/web_builder/siteStructureGenerator.js",
  "./js/brain/engine/web_builder/uiStylingEngine.js",
  "./js/brain/generator.js",
  "./js/brain/hauntingPersona.js",
  "./js/brain/hippocampus/NPC Memory.js",
  "./js/brain/hippocampus/hippocampus.js",
  "./js/brain/hippocampus/longTerm.js",
  "./js/brain/hippocampus/memory.js",
  "./js/brain/hippocampus/personaMemory.js",
  "./js/brain/hippocampus/savedMemory.js",
  "./js/brain/hippocampus/shortTerm.js",
  "./js/brain/hippocampus/webMemory.js",
  "./js/brain/keyboard/textEngine.js",
  "./js/brain/keyboard/virtualKey.js",
  "./js/brain/knowledge.js",
  "./js/brain/translator.js",
  "./js/brain/webSearch.js",
  "./js/chapters.js",
  "./js/characters.js",
  "./js/config.js",
  "./js/settingsEnhancements.js",
  "./js/terminalLanguage.js",
  "./languageRules.js",
  "./manifest.webmanifest",
  "./settings.html",
  "./terminal.html",
  "./js/kernel/eventBus.js",
  "./js/kernel/resultBus.js",
  "./js/kernel/serviceRegistry.js",
  "./js/kernel/permissionManager.js",
  "./js/kernel/appManager.js",
  "./js/kernel/browserPolicy.js",
  "./js/kernel/intentEngine.js",
  "./js/kernel/taskRouter.js",
  "./js/kernel/diagnostics.js",
  "./js/kernel/kernel.js",
  "./terminal/index.html",
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(SHELL.map(async path => { try { await cache.add(path); } catch (error) { /* optional legacy asset: skip without blocking install */ } }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => { const names = await caches.keys(); await Promise.all(names.filter(name => name.startsWith('eye-of-chaos-shell-') && name !== CACHE_NAME).map(name => caches.delete(name))); await self.clients.claim(); })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) {
      event.waitUntil(fetch(request).then(response => { if (response && response.ok) cache.put(request, response.clone()); }).catch(() => {}));
      return cached;
    }
    try { const response = await fetch(request); if (response && response.ok) cache.put(request, response.clone()); return response; }
    catch (error) { if (request.mode === 'navigate') { const fallback = await cache.match('./index.html'); if (fallback) return fallback; } throw error; }
  })());
});
