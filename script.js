/* =====================================================================
   EDITE AQUI: informações do convite (Kimie & David · 11/12/2026)
   Valores entre [colchetes] aparecem destacados no site como "a preencher".
   ===================================================================== */
const CONFIG = {
  inicio: '2026-12-11T15:00:00-03:00', // cerimônia (horário de Brasília)
  fim: '2026-12-11T22:00:00-03:00',    // fim estimado (só para a agenda)
  local: 'Edifício Santa Margherita',
  endereco: 'Rua Tamandaré, 655 - Liberdade, São Paulo - SP, 01525-001',
  mapa: '',            // link do Google Maps do local (opcional; vazio = busca pelo endereço)
  traje: 'Esporte fino',
  prazo: '20 de novembro',
  pix: '+5541999063756',
  pixNome: '',         // titular da chave (opcional; vazio = linha escondida)
  listaPresentes: '',  // link de lista de presentes (opcional)
  whatsapp: '5541999063756',      // quem recebe as confirmações: só dígitos, 55 + DDD + número
  planilha: '',        // URL do Google Apps Script (opcional, ver HANDOFF.md)
};

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const html = document.documentElement;
  const enc = encodeURIComponent;
  const preenchido = (v) => !!v && !String(v).startsWith('[');
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const aleat = (a, b) => a + Math.random() * (b - a);

  /* ---------- Link personalizado ----------
     ?c=<nomes em base64>, gerado em links.html (os nomes não ficam legíveis na URL;
     é disfarce, não segurança). Também aceita ?para=Ana|Bruno sem codificar. */
  const b64dec = (s) => {
    try {
      s = s.replace(/-/g, '+').replace(/_/g, '/');
      s += '==='.slice((s.length + 3) % 4);
      return new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)));
    } catch (e) { return ''; }
  };
  const juntar = (l) => (l.length > 1 ? l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1] : l[0] || '');
  const q = new URLSearchParams(location.search);
  const nomes = ((q.get('c') ? b64dec(q.get('c')) : q.get('para')) || '')
    .split('|').map((s) => s.trim().slice(0, 40)).filter(Boolean).slice(0, 12);
  const convidado = juntar(nomes);

  $$('[data-cfg]').forEach((el) => {
    const v = String(CONFIG[el.dataset.cfg] || '');
    el.textContent = v;
    el.classList.toggle('todo', !preenchido(v));
  });
  if (!CONFIG.pixNome) $('[data-cfg=\"pixNome\"]').parentElement.hidden = true;
  if (convidado) {
    $('#nome-envelope').textContent = convidado;
    $('#para-envelope').hidden = false;
    $('#saudacao').textContent = convidado + ',';
    $('#saudacao').hidden = false;
  }

  /* ---------- Pétalas e confete (canvas) ---------- */
  const tela = $('#petalas');
  const ctx = tela.getContext('2d');
  const CORES_P = ['#EBC3C3', '#F3D6CF', '#DDA9A6', '#E9D3B4', '#CF9696'];
  const CORES_C = ['#7B2D3B', '#A9854F', '#DCC7A6', '#C98B8B', '#F3D6CF'];
  let W = 0, H = 0, parts = [], rodando = false, ambiente = false, heroVisivel = true;
  const ajusta = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    tela.width = W * dpr; tela.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  ajusta();
  addEventListener('resize', ajusta);
  const formas = {
    petala(r) { ctx.beginPath(); ctx.moveTo(0, -r); ctx.bezierCurveTo(r, -r * .5, r * .7, r * .8, 0, r); ctx.bezierCurveTo(-r * .7, r * .8, -r, -r * .5, 0, -r); ctx.fill(); },
    coracao(r) { ctx.beginPath(); ctx.moveTo(0, r * .7); ctx.bezierCurveTo(-r * 1.3, -r * .15, -r * .5, -r * 1.1, 0, -r * .35); ctx.bezierCurveTo(r * .5, -r * 1.1, r * 1.3, -r * .15, 0, r * .7); ctx.fill(); },
    confete(r) { ctx.fillRect(-r * .5, -r * .22, r, r * .44); },
  };
  const petala = (x, y, chuva) => ({
    x, y, tipo: 'petala', r: aleat(5, 10), cor: CORES_P[Math.random() * CORES_P.length | 0], alfa: aleat(.6, .95),
    vx: aleat(-.6, .6), vy: chuva ? aleat(1.4, 3.2) : aleat(.5, 1.1), g: .01, vmax: chuva ? 3 : 1.2, atrito: .995,
    osc: aleat(0, 6.3), vosc: aleat(.02, .05), balanco: aleat(.4, 1.1), rot: aleat(0, 6.3), vr: aleat(-.04, .04), vida: 0,
  });
  const quadro = () => {
    ctx.clearRect(0, 0, W, H);
    if (ambiente && parts.length < 16 && Math.random() < .035) parts.push(petala(aleat(0, W), -20, false));
    parts = parts.filter((p) => p.y < H + 40 && p.x > -60 && p.x < W + 60 && p.vida < 1200);
    for (const p of parts) {
      p.vida++;
      p.vy = Math.min(p.vy + p.g, p.vmax);
      p.vx *= p.atrito;
      p.osc += p.vosc;
      p.x += p.vx + Math.sin(p.osc) * p.balanco;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, .45 + .55 * Math.abs(Math.cos(p.osc)));
      ctx.globalAlpha = p.alfa;
      ctx.fillStyle = p.cor;
      formas[p.tipo](p.r);
      ctx.restore();
    }
    if (parts.length || ambiente) requestAnimationFrame(quadro);
    else { rodando = false; ctx.clearRect(0, 0, W, H); }
  };
  const anima = () => { if (!rodando && !calmo) { rodando = true; requestAnimationFrame(quadro); } };
  const chuva = (qtd) => {
    if (calmo) return;
    for (let i = 0; i < qtd; i++) parts.push(petala(aleat(0, W), aleat(-H * .6, -10), true));
    anima();
  };
  const explosao = (x, y, qtd = 80) => {
    if (calmo) return;
    for (let i = 0; i < qtd; i++) {
      const ang = aleat(-Math.PI * .95, -Math.PI * .05), vel = aleat(4, 12);
      parts.push({
        x, y, tipo: Math.random() < .4 ? 'coracao' : 'confete', r: aleat(6, 11), cor: CORES_C[Math.random() * CORES_C.length | 0], alfa: 1,
        vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel, g: .22, vmax: 4.5, atrito: .985,
        osc: aleat(0, 6.3), vosc: aleat(.05, .12), balanco: .5, rot: aleat(0, 6.3), vr: aleat(-.2, .2), vida: 0,
      });
    }
    anima();
  };
  const farelos = (x, y) => { // farelinhos de cera quando o selo racha
    if (calmo) return;
    for (let i = 0; i < 16; i++) {
      const ang = aleat(-Math.PI * .9, -Math.PI * .1), vel = aleat(1.5, 4.5);
      parts.push({
        x: x + aleat(-30, 30), y, tipo: 'confete', r: aleat(2, 4.5), cor: ['#7B2D3B', '#561A25', '#9E3E4C'][Math.random() * 3 | 0], alfa: 1,
        vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel, g: .25, vmax: 6, atrito: .98,
        osc: 0, vosc: .1, balanco: .2, rot: aleat(0, 6.3), vr: aleat(-.3, .3), vida: 0,
      });
    }
    anima();
  };

  /* ---------- Envelope ---------- */
  $('#abrir').addEventListener('click', (e) => {
    try { sessionStorage.setItem('aberto', '1'); } catch (err) {}
    if (navigator.vibrate) navigator.vibrate(18);
    const rs = e.currentTarget.getBoundingClientRect();
    setTimeout(() => farelos(rs.left + rs.width / 2, rs.top + rs.height * .56), 330);
    window.scrollTo(0, 0);
    setTimeout(() => chuva(48), 1500);
    setTimeout(() => {
      ambiente = heroVisivel && !calmo;
      anima();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 3000);
  });

  /* ---------- Capa: nomes letra a letra ---------- */
  let li = 0;
  $$('.hero-nomes > *').forEach((parte) => {
    if (parte.classList.contains('ecom')) { li++; return; }
    const txt = parte.textContent;
    parte.textContent = '';
    for (const ch of txt) {
      const s = document.createElement('span');
      s.className = 'l';
      s.textContent = ch;
      s.style.setProperty('--i', li++);
      parte.appendChild(s);
    }
  });

  /* ---------- Contagem regressiva (dígitos que rolam) ---------- */
  const alvo = new Date(CONFIG.inicio).getTime();
  const dois = (x) => String(x).padStart(2, '0');
  const rolar = (el, v) => {
    if (el.dataset.v === v) return;
    el.dataset.v = v;
    if (calmo) { el.textContent = v; return; }
    el.querySelectorAll('.sai').forEach((s) => s.remove());
    const velho = el.querySelector('.dig');
    if (velho) velho.className = 'dig sai';
    const novo = document.createElement('span');
    novo.className = 'dig entra';
    novo.textContent = v;
    el.appendChild(novo);
  };
  let timer;
  const tick = () => {
    const s = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
    if (!s) {
      $('#relogio').hidden = true;
      $('#faltam').hidden = true;
      $('#contagem-fim').hidden = false;
      clearInterval(timer);
      return;
    }
    rolar($('#cd-d'), String(Math.floor(s / 86400)));
    rolar($('#cd-h'), dois(Math.floor((s % 86400) / 3600)));
    rolar($('#cd-m'), dois(Math.floor((s % 3600) / 60)));
    rolar($('#cd-s'), dois(s % 60));
  };
  timer = setInterval(tick, 1000);
  tick();

  /* ---------- Mapa e agenda ---------- */
  const onde = [CONFIG.local, CONFIG.endereco].filter(preenchido).join(', ');
  $('#btn-mapa').href = CONFIG.mapa || 'https://www.google.com/maps/search/?api=1&query=' + enc(onde || 'Brasil');
  const utc = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const agenda = $('#btn-agenda');
  if (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
    agenda.href = 'evento.ics';
    agenda.removeAttribute('target');
  } else {
    agenda.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + enc('Casamento Kimie & David 💍')
      + '&dates=' + utc(CONFIG.inicio) + '/' + utc(CONFIG.fim)
      + '&location=' + enc(onde)
      + '&details=' + enc('Cerimônia às 15h. Convite: ' + location.origin + location.pathname);
  }
  const versoAgenda = $('#verso-agenda');
  versoAgenda.href = agenda.href;
  if (!agenda.hasAttribute('target')) versoAgenda.removeAttribute('target');

  /* ---------- Presentes (discreto) ---------- */
  const toast = $('#toast');
  let toastT;
  const avisa = (msg) => {
    toast.textContent = msg;
    toast.classList.add('mostrar');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('mostrar'), 2200);
  };
  const copiar = async (txt) => {
    try { await navigator.clipboard.writeText(txt); } catch (e) {
      const t = document.createElement('textarea');
      t.value = txt; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
  };
  $('#pix-toggle').addEventListener('click', (e) => {
    const aberto = $('#pix-painel').classList.toggle('aberto');
    e.currentTarget.setAttribute('aria-expanded', String(aberto));
  });
  $('#btn-pix').addEventListener('click', async () => { await copiar(CONFIG.pix); avisa('Chave PIX copiada ✓'); });
  if (CONFIG.listaPresentes) {
    $('#link-lista').href = CONFIG.listaPresentes;
    $('#link-lista').hidden = false;
  }

  /* ---------- Efeito de onda nos botões ---------- */
  document.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.botao');
    if (!b || calmo) return;
    const r = b.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2.2;
    const o = document.createElement('span');
    o.className = 'onda';
    o.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(o);
    setTimeout(() => o.remove(), 700);
  });

  /* ---------- Rolagem suave nos links internos ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    const destino = a && document.getElementById(a.getAttribute('href').slice(1));
    if (!destino) return;
    e.preventDefault();
    destino.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' });
  });

  /* ---------- Galeria em tela cheia (deslize para os lados) ---------- */
  const fotos = $$('.foto');
  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  let atual = 0, x0 = null, arrastou = false;
  const mostra = (i, dir) => {
    atual = (i + fotos.length) % fotos.length;
    lbImg.src = $('img', fotos[atual]).src;
    lbImg.className = 'lb-img';
    void lbImg.offsetWidth; // reinicia a animação
    if (dir) lbImg.classList.add(dir);
    $('#lb-cont').textContent = `${atual + 1} / ${fotos.length}`;
  };
  const fechaLb = () => {
    lb.classList.add('saindo');
    setTimeout(() => {
      lb.hidden = true;
      lb.classList.remove('saindo');
      html.classList.remove('lb-aberto');
      fotos[atual].focus({ preventScroll: true });
    }, calmo ? 0 : 280);
  };
  fotos.forEach((f, i) => f.addEventListener('click', () => {
    mostra(i);
    lb.hidden = false;
    html.classList.add('lb-aberto');
    $('.lb-fechar').focus({ preventScroll: true });
  }));
  $('.lb-fechar').addEventListener('click', fechaLb);
  $('.lb-prox').addEventListener('click', () => mostra(atual + 1, 'prox'));
  $('.lb-ant').addEventListener('click', () => mostra(atual - 1, 'ant'));
  lb.addEventListener('click', (e) => { if (e.target === lb && !arrastou) fechaLb(); arrastou = false; });
  lb.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  lb.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    arrastou = Math.abs(dx) > 45;
    if (arrastou) mostra(atual + (dx < 0 ? 1 : -1), dx < 0 ? 'prox' : 'ant');
  });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') fechaLb();
    if (e.key === 'ArrowRight') mostra(atual + 1, 'prox');
    if (e.key === 'ArrowLeft') mostra(atual - 1, 'ant');
  });

  /* ---------- RSVP: só as pessoas do convite, cartão que vira ---------- */
  const form = $('#form-rsvp');
  const cena = $('.rsvp-cena');
  const verso = $('#obrigado');
  verso.inert = true;
  const varios = nomes.length > 1;
  if (nomes.length) $('#campo-nome').hidden = true; // nomes já vêm no link
  if (varios) {
    $('.txt-sim').textContent = 'Vamos, com certeza!';
    $('.txt-nao').textContent = 'Não poderemos ir';
    $('#quem').hidden = false;
    $('#quem-info').textContent = `Este convite é para ${nomes.length} pessoas. Desmarque quem não puder ir.`;
    nomes.forEach((nome) => {
      const l = document.createElement('label');
      l.className = 'pessoa';
      l.innerHTML = '<input type="checkbox" checked><span class="check" aria-hidden="true"></span><span class="nome-p"></span>';
      $('input', l).value = nome;
      $('.nome-p', l).textContent = nome;
      $('#quem-lista').appendChild(l);
    });
  }
  const atualiza = () => {
    $$('.escolha, .pessoa').forEach((l) => l.classList.toggle('marcada', $('input', l).checked));
    form.classList.toggle('nao-vai', form.elements.vai.value === 'nao');
  };
  form.addEventListener('change', atualiza);
  atualiza();
  const treme = (el) => {
    el.classList.remove('erro');
    void el.offsetWidth;
    el.classList.add('erro');
    setTimeout(() => el.classList.remove('erro'), 500);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const vai = d.vai === 'sim';
    const nomeLivre = (d.nome || '').trim();
    if (!nomes.length && !nomeLivre) { treme(form.elements.nome); form.elements.nome.focus(); return; }
    const convite = nomes.length ? nomes : [nomeLivre];
    const quem = !vai ? [] : varios ? $$('#quem-lista input:checked').map((i) => i.value) : convite;
    if (vai && !quem.length) { treme($('#quem-lista')); avisa('Marque quem vai 🙂'); return; }
    const naoVao = convite.filter((x) => !quem.includes(x));
    const plural = (vai ? quem.length : convite.length) > 1;
    const linhas = vai
      ? [`Oi, Kimie e David! ${plural ? 'Confirmamos' : 'Confirmo'} presença no casamento 💍`, 'Quem vai: ' + juntar(quem)]
      : [`Oi, Kimie e David! Infelizmente não ${plural ? 'poderemos' : 'poderei'} ir ao casamento.`, 'Convite: ' + juntar(convite)];
    if (vai && naoVao.length) linhas.push('Não vai: ' + juntar(naoVao));
    if (vai && d.restricoes) linhas.push('Restrições: ' + d.restricoes);
    if (d.recado) linhas.push('Recado: ' + d.recado);
    const dados = {
      convite: juntar(convite), vai: vai ? 'sim' : 'não', quem: juntar(quem), pessoas: quem.length,
      nao_vao: juntar(naoVao), restricoes: vai ? d.restricoes || '' : '', recado: d.recado || '',
    };

    const botao = $('[type=submit]', form);
    const r = botao.getBoundingClientRect();
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    let enviado = false;
    if (CONFIG.planilha) {
      try {
        await fetch(CONFIG.planilha, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(dados) });
        enviado = true;
      } catch (err) {
        botao.disabled = false;
        botao.textContent = 'Enviar confirmação';
        avisa('Não foi possível enviar agora. Tente de novo.');
        return;
      }
    } else if (CONFIG.whatsapp) {
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + enc(linhas.join('\n')), '_blank');
      enviado = true;
    }
    $('.verso-icone').textContent = vai ? '🥂' : '💌';
    $('#obrigado-titulo').textContent = vai ? 'Obrigado! Até lá' : 'Obrigado por avisar';
    $('#obrigado-texto').textContent = !enviado
      ? '(Modo de teste: a confirmação ainda não está conectada.)'
      : CONFIG.planilha ? (vai ? 'Sua presença está confirmada.' : 'Vamos sentir sua falta!')
      : 'Agora é só tocar em “enviar” no WhatsApp para concluir.';
    versoAgenda.hidden = !vai;
    cena.classList.add('virado');
    setTimeout(() => cena.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'center' }), 150);
    form.inert = true;
    verso.inert = false;
    botao.disabled = false;
    botao.textContent = 'Enviar confirmação';
    if (vai) setTimeout(() => explosao(r.left + r.width / 2, r.top, 90), 500);
  });
  $('#rsvp-editar').addEventListener('click', () => {
    cena.classList.remove('virado');
    form.inert = false;
    verso.inert = true;
  });

  /* ---------- Botão flutuante e pétalas da capa ---------- */
  const fab = $('#flutuante');
  const vis = {};
  const io = new IntersectionObserver((ents) => {
    ents.forEach((en) => { vis[en.target.id] = en.isIntersecting; });
    fab.classList.toggle('mostrar', !vis.inicio && !vis.rsvp);
    heroVisivel = !!vis.inicio;
    ambiente = heroVisivel && html.classList.contains('aberto') && !calmo;
    if (ambiente) anima();
  });
  io.observe($('#inicio'));
  io.observe($('#rsvp'));

  /* ---------- Barra de progresso ---------- */
  const barra = $('#progresso');
  let pedido = false;
  const progresso = () => {
    pedido = false;
    const max = html.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  };
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(progresso); } }, { passive: true });
  progresso();

  /* ---------- Animações de rolagem (GSAP) ----------
     Sem GSAP (CDN fora do ar) ou com "reduzir movimento", o site fica estático e tudo visível. */
  const g = window.gsap;
  const ST = window.ScrollTrigger;
  if (!g || !ST || calmo) return;
  g.registerPlugin(ST);
  const entra = (alvos, vars, gatilho, inicio = 'top 88%') =>
    g.from(alvos, { duration: 1.1, ease: 'power3.out', ...vars, scrollTrigger: { trigger: gatilho || alvos, start: inicio } });

  // Títulos: palavras sobem de dentro de uma máscara
  $$('.dividir').forEach((h) => {
    const palavras = h.textContent.trim().split(/\s+/);
    h.textContent = '';
    palavras.forEach((w, i) => {
      const m = document.createElement('span');
      const mi = document.createElement('span');
      m.className = 'm';
      mi.className = 'mi';
      mi.textContent = w;
      m.appendChild(mi);
      h.appendChild(m);
      if (i < palavras.length - 1) h.appendChild(document.createTextNode(' '));
    });
    entra($$('.mi', h), { yPercent: 115, rotate: 4, stagger: .07 }, h);
  });

  $$('.revela').forEach((el) => entra(el, { y: 36, autoAlpha: 0 }, el, 'top 90%'));

  // Capa: parallax da foto e do texto
  g.to('.hero-midia', { yPercent: 22, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  g.to('.hero-texto', { y: -90, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '25% top', end: '85% top', scrub: true } });

  // Ramos: se desenham e flutuam
  $$('.secao .ramo').forEach((ramo) => {
    g.fromTo(ramo, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, ease: 'power1.inOut', scrollTrigger: { trigger: ramo.parentElement, start: 'top 75%' } });
    g.to(ramo, { yPercent: -35, ease: 'none', scrollTrigger: { trigger: ramo.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Linha do tempo se preenche e os marcadores acendem
  g.fromTo('.lt-progresso', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#linha-tempo', start: 'top 70%', end: 'bottom 65%', scrub: .6 } });
  $$('.lt-item').forEach((it) => {
    entra(it, { x: -26, autoAlpha: 0 }, it, 'top 85%');
    ST.create({ trigger: it, start: 'top 65%', onEnter: () => it.classList.add('ativo'), onLeaveBack: () => it.classList.remove('ativo') });
  });

  // Galeria: cortina + zoom
  fotos.forEach((f, i) => {
    const gatilho = { trigger: f, start: 'top 92%' };
    g.fromTo(f, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, delay: (i % 2) * .12, ease: 'power4.out', scrollTrigger: gatilho });
    g.from($('img', f), { scale: 1.35, duration: 1.8, delay: (i % 2) * .12, ease: 'power3.out', clearProps: 'transform', scrollTrigger: gatilho });
  });

  // Local: cartão entra em 3D e o dia conta até 11
  entra('.cartao', { rotateX: 28, y: 70, autoAlpha: 0, transformPerspective: 900, transformOrigin: '50% 100%', duration: 1.3 }, '.cartao');
  g.from('.dia', { textContent: 1, snap: { textContent: 1 }, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: '.cartao', start: 'top 80%' } });
  entra('.infos > div', { y: 40, autoAlpha: 0, stagger: .15 }, '.infos', 'top 92%');

  addEventListener('load', () => ST.refresh());
  if (document.fonts) document.fonts.ready.then(() => ST.refresh());
})();
