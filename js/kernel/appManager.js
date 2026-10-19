/* VoidOS App Manager v2.0.0. Central catalogue for the web-shell launcher. */
(function(g){'use strict';const apps=[
{id:'terminal',title:'CHAOS Terminal',path:'terminal/index.html',icon:'⌘',core:true,permissions:['storage']},
{id:'characters',title:'أرشيف الشخصيات',path:'characters.html',icon:'👁',core:true,permissions:['storage']},
{id:'chapters',title:'أرشيف الفصول',path:'chapters.html',icon:'▤',core:true,permissions:['storage']},
{id:'settings',title:'إعدادات النظام',path:'settings.html',icon:'⚙',core:true,permissions:['storage']},
{id:'tube',title:'VoidTube',path:'apps/voidtube/index.html',icon:'▶',core:false,permissions:['storage']},
{id:'store',title:'Void Store',path:'apps/void-store/index.html',icon:'▦',core:true,permissions:['network','storage']},
{id:'notes',title:'Void Notes',path:'apps/void-notes/index.html',icon:'▤',core:false,permissions:['storage']},
{id:'calculator',title:'Void Calculator',path:'apps/void-calculator/index.html',icon:'⌗',core:true,permissions:['storage']},
{id:'planner',title:'Void Planner',path:'apps/void-planner/index.html',icon:'✓',core:false,permissions:['storage','notifications']},
{id:'files',title:'Void Files',path:'apps/void-files/index.html',icon:'▣',core:false,permissions:['storage']},
{id:'calendar',title:'Void Calendar',path:'apps/void-calendar/index.html',icon:'▦',core:false,permissions:['storage','notifications']},
{id:'browser',title:'VoidBrowserX',path:'apps/void-browserx/index.html',icon:'🌐',core:false,permissions:['network','storage']},
{id:'manager',title:'مدير التطبيقات',path:'apps/void-manager/index.html',icon:'▤',core:true,permissions:['storage']}
];function list(){return apps.map(a=>({...a,state:g.VoidPermissionManager?.get(a.id)||{enabled:true,grants:{}}}))}function get(id){const a=apps.find(x=>x.id===String(id).toLowerCase());return a?{...a,state:g.VoidPermissionManager?.get(a.id)||{enabled:true,grants:{}}}:null}function byPath(path){return apps.find(a=>a.path===path)||null}g.VoidAppManager={version:'2.0.0',list,get,byPath}})(window);
  
