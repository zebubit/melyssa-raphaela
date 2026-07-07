/* Player de música compartilhado entre todas as páginas do site da Melyssa.
   Lembra a posição e o estado (tocando/pausado) via sessionStorage,
   então a música "segue" você ao navegar entre as páginas, sem reiniciar. */
(function(){
  var audio=document.getElementById('audio');
  if(!audio) return;
  var btn=document.getElementById('music');
  var ouvir=document.getElementById('ouvirBtn');
  var KEY_T='mely_t', KEY_P='mely_play';

  // retoma a posição de onde parou na página anterior
  var t=parseFloat(sessionStorage.getItem(KEY_T)||'0');
  if(t>0 && isFinite(t)){ try{ audio.currentTime=t; }catch(e){} }

  function setPlaying(on){ if(btn) btn.classList.toggle('playing', on); sessionStorage.setItem(KEY_P, on?'1':'0'); }
  function play(){ audio.play().then(function(){ setPlaying(true); }).catch(function(){}); }
  function pause(){ audio.pause(); setPlaying(false); }
  function toggle(){ if(audio.paused) play(); else pause(); }

  if(btn) btn.addEventListener('click', toggle);
  if(ouvir) ouvir.addEventListener('click', function(e){ e.preventDefault(); toggle(); });

  // salva a posição continuamente e ao sair da página
  audio.addEventListener('timeupdate', function(){ sessionStorage.setItem(KEY_T, audio.currentTime); });
  window.addEventListener('pagehide', function(){ sessionStorage.setItem(KEY_T, audio.currentTime); });

  // se já estava tocando, tenta continuar (a navegação costuma contar como gesto do usuário)
  if(sessionStorage.getItem(KEY_P)==='1'){ play(); }

  // garante o início no primeiro toque/clique em qualquer lugar
  function once(){ if(audio.paused) play(); window.removeEventListener('pointerdown', once); }
  window.addEventListener('pointerdown', once, {once:true});
})();
