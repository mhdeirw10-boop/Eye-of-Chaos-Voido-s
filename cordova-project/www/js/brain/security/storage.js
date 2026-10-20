// CHAOS Security Storage — safe JSON storage helpers and bounded audit log.
(function(g){'use strict';const PREFIX='chaos_security_audit_v1';
 function read(key,fallback){try{const raw=localStorage.getItem(key);if(raw===null)return fallback;return JSON.parse(raw)}catch{return fallback}}
 function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
 function audit(kind,detail){const rows=read(PREFIX,[]);rows.unshift({time:new Date().toISOString(),kind:String(kind).slice(0,80),detail:String(detail??'').slice(0,300)});write(PREFIX,rows.slice(0,100))}
 g.ChaosSecurityStorage={version:'1.7.0',read,write,audit,auditLog(){return read(PREFIX,[])}};
})(window);
