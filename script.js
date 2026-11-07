/* =====================================================================
   EDITE AQUI — informações do convite (Kimie & David · 11/12/2026)
   Valores entre [colchetes] aparecem destacados no site como "a preencher".
   ===================================================================== */
const CONFIG = {
  inicio: '2026-12-11T15:00:00-03:00', // cerimônia (horário de Brasília)
  fim: '2026-12-11T22:00:00-03:00',    // fim estimado (só para a agenda)
  local: '[Nome do local]',
  endereco: '[Endereço completo · Cidade – UF]',
  mapa: '',            // link do Google Maps do local (opcional; vazio = busca pelo endereço)
  traje: '[Esporte fino]',
  prazo: '[30 de novembro]',
  pix: '[chave-pix-aqui]',
  pixNome: '[Nome do titular]',
  listaPresentes: '',  // link de lista de presentes (opcional)
  whatsapp: '',        // quem recebe as confirmações: só dígitos, 55 + DDD + número
  planilha: '',        // URL do Google Apps Script (opcional, ver HANDOFF.md)
  pessoasPadrao: 4,    // máximo de pessoas no RSVP quando o link não tem ?n=
};

(() => {
  const $ = (s) => document.querySelector(s);
  const enc = encodeURIComponent;
  const preenchido = (v) => !!v && !String(v).startsWith('[');

  // Link personalizado: ?para=Nome&n=2
  const q = new URLSearchParams(location.search);
  const convidado = (q.get('para') || '').trim().slice(0, 60);
  const vagas = Math.min(Math.max(parseInt(q.get('n'), 10) || CONFIG.pessoasPadrao, 1), 20);

  $('#abrir').addEventListener('click', () => {
    try { sessionStorage.setItem('aberto', '1'); } catch (e) {}
  });

  // Textos [data-cfg]
  document.querySelectorAll('[data-cfg]').forEach((el) => {
    const v = String(CONFIG[el.dataset.cfg] || '');
    el.textContent = v;
    el.classList.toggle('todo', !preenchido(v));
  });

  if (convidado) {
    $('#nome-envelope').textContent = convidado;
    $('#para-envelope').hidden = false;
    $('#saudacao').textContent = convidado + ',';
    $('#saudacao').hidden = false;
    $('#rsvp-nome').value = convidado;
  }

  // Mapa e agenda
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

  // Contagem regressiva
  const alvo = new Date(CONFIG.inicio).getTime();
  const dois = (n) => String(n).padStart(2, '0');
  let timer;
  const tick = () => {
    const s = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
    if (s === 0) {
      $('#relogio').hidden = true;
      $('#faltam').hidden = true;
      $('#contagem-fim').hidden = false;
      clearInterval(timer);
      return;
    }
    $('#cd-dias').textContent = Math.floor(s / 86400);
    $('#cd-horas').textContent = dois(Math.floor((s % 86400) / 3600));
    $('#cd-min').textContent = dois(Math.floor((s % 3600) / 60));
    $('#cd-seg').textContent = dois(s % 60);
  };
  timer = setInterval(tick, 1000);
  tick();

  // PIX
  $('#btn-pix').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(CONFIG.pix); } catch (err) {
      const t = document.createElement('textarea');
      t.value = CONFIG.pix; document.body.appendChild(t); t.select();
      document.execCommand('copy'); t.remove();
    }
    b.textContent = 'Chave copiada ✓';
    setTimeout(() => { b.textContent = 'Copiar chave'; }, 2500);
  });
  if (CONFIG.listaPresentes) {
    $('#link-lista').href = CONFIG.listaPresentes;
    $('#link-lista').hidden = false;
  }

  // RSVP: envia para a planilha (se configurada) ou abre o WhatsApp com a mensagem pronta
  const form = $('#form-rsvp');
  const pessoas = $('#rsvp-pessoas');
  for (let i = 1; i <= vagas; i++) pessoas.add(new Option(i === 1 ? '1 (só eu)' : String(i), String(i)));
  form.addEventListener('change', () => form.classList.toggle('nao-vai', form.elements.vai.value === 'nao'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    d.nome = (d.nome || '').trim();
    if (!d.nome) { form.elements.nome.focus(); return; }
    const vai = d.vai === 'sim';
    if (!vai) { d.pessoas = '0'; d.restricoes = ''; }
    d.convite = convidado;
    const linhas = vai
      ? ['Oi, Kimie e David! Confirmo presença no casamento 💍', 'Nome: ' + d.nome, 'Pessoas: ' + d.pessoas]
      : ['Oi, Kimie e David! Infelizmente não vou poder ir ao casamento.', 'Nome: ' + d.nome];
    if (d.restricoes) linhas.push('Restrições: ' + d.restricoes);
    if (d.recado) linhas.push('Recado: ' + d.recado);

    const botao = form.querySelector('[type=submit]');
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    let enviado = false;
    if (CONFIG.planilha) {
      try {
        await fetch(CONFIG.planilha, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(d) });
        enviado = true;
      } catch (err) {
        botao.disabled = false;
        botao.textContent = 'Enviar confirmação';
        alert('Não foi possível enviar agora. Tente de novo em instantes.');
        return;
      }
    } else if (CONFIG.whatsapp) {
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + enc(linhas.join('\n')), '_blank');
      enviado = true;
    }
    form.hidden = true;
    $('#obrigado').hidden = false;
    $('#obrigado-titulo').textContent = vai ? 'Obrigado! Até lá 💛' : 'Obrigado por avisar 💛';
    $('#obrigado-texto').textContent = !enviado
      ? '(Modo de teste: a confirmação ainda não está conectada.)'
      : CONFIG.planilha ? (vai ? 'Sua presença está confirmada.' : 'Vamos sentir sua falta!')
      : 'Agora é só tocar em “enviar” no WhatsApp para concluir.';
  });

  // Botão flutuante "Confirmar presença" (escondido na capa e no RSVP)
  const fab = $('#flutuante');
  const visivel = {};
  const obs = new IntersectionObserver((ents) => {
    ents.forEach((en) => { visivel[en.target.id] = en.isIntersecting; });
    fab.classList.toggle('mostrar', !visivel.inicio && !visivel.rsvp);
  });
  obs.observe($('#inicio'));
  obs.observe($('#rsvp'));

  // Animação suave ao rolar. Só esconde o conteúdo depois que o observer
  // responde (classe io-ok): se ele falhar em algum navegador, tudo fica visível.
  const rev = new IntersectionObserver((ents) => {
    document.documentElement.classList.add('io-ok');
    ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('visivel'); rev.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.secao > *').forEach((el) => { el.classList.add('revelar'); rev.observe(el); });
})();
