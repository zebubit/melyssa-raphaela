/* ==========================================================================
   MELYSSA · camada PREMIUM (JS compartilhado)
   - barra de progresso de scroll
   - grão de filme
   - botões magnéticos (desktop only)
   - contadores animados (data-count)
   Sem sequestro de scroll: mobile continua com rolagem nativa e leve.
   ========================================================================== */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = matchMedia('(min-width:1024px) and (pointer:fine)').matches;

  /* grão + barra de progresso (injetados) */
  if(!document.getElementById('grain') && !reduce){
    var g=document.createElement('div'); g.id='grain'; document.body.appendChild(g);
  }
  var bar=document.getElementById('progress');
  if(!bar){ bar=document.createElement('div'); bar.id='progress'; document.body.appendChild(bar); }
  var barTick=false;
  function updBar(){
    var h=document.documentElement;
    var max=(h.scrollHeight-h.clientHeight)||1;
    bar.style.width=((h.scrollTop||document.body.scrollTop)/max*100)+'%';
    barTick=false;
  }
  addEventListener('scroll',function(){ if(!barTick){ barTick=true; requestAnimationFrame(updBar); } },{passive:true});
  updBar();

  /* botões magnéticos — só desktop e sem reduced-motion */
  if(isDesktop && !reduce){
    document.querySelectorAll('.btn').forEach(function(b){
      b.classList.add('magnetic');
      b.addEventListener('mousemove',function(e){
        var r=b.getBoundingClientRect();
        var x=(e.clientX-(r.left+r.width/2))*0.3;
        var y=(e.clientY-(r.top+r.height/2))*0.4;
        b.style.setProperty('--mx',x+'px'); b.style.setProperty('--my',y+'px');
      });
      b.addEventListener('mouseleave',function(){ b.style.setProperty('--mx','0px'); b.style.setProperty('--my','0px'); });
    });
  }

  /* acessibilidade: elementos com role="button" (não nativos) respondem a Enter/Espaço */
  document.querySelectorAll('[role="button"][tabindex]').forEach(function(el){
    el.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){ e.preventDefault(); el.click(); }
    });
  });

  /* contadores animados quando entram na tela */
  var counters=document.querySelectorAll('[data-count]');
  if(counters.length){
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el=e.target, target=parseFloat(el.getAttribute('data-count'))||0;
        var suffix=el.getAttribute('data-suffix')||'', prefix=el.getAttribute('data-prefix')||'';
        if(reduce){ el.textContent=prefix+target+suffix; cio.unobserve(el); return; }
        var t0=null, dur=1400;
        function step(ts){
          if(!t0) t0=ts; var p=Math.min((ts-t0)/dur,1);
          var eased=1-Math.pow(1-p,3);
          el.textContent=prefix+Math.round(target*eased)+suffix;
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    },{threshold:.5});
    counters.forEach(function(c){ cio.observe(c); });
  }
})();
