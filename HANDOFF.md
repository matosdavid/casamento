# HANDOFF: convite de casamento Kimie & David 💍

> Documento para continuar o trabalho em outra sessão do Claude Code.
> Numa sessão nova, cole o prompt do fim deste arquivo junto com as informações e a pasta de fotos.

## Resumo

| | |
|---|---|
| Evento | Casamento **Kimie & David**, sexta-feira, **11/12/2026, 15h** (horário de Brasília) |
| Site no ar | https://matosdavid.github.io/casamento/ |
| Repositório | https://github.com/matosdavid/casamento (público, branch `main`) |
| Hospedagem | GitHub Pages: publica a raiz da `main` a cada push (~1 min) |
| Stack | HTML + CSS + JS puro, sem build. Fontes Cormorant Garamond + Jost (Google Fonts) |
| Status | Primeira versão no ar, com **fotos e textos provisórios** (destacados no site com borda tracejada) |

## Por que GitHub Pages (e não Streamlit)

- **GitHub Pages:** grátis, no ar 24h sem "dormir", HTTPS, aguenta muito acesso, deploy = `git push`. Ideal para site estático como um convite.
- **Streamlit Community Cloud:** feito para apps de dados em Python. O app **hiberna** depois de um período sem acesso e o convidado cai numa tela pedindo para "acordar" o app. Ruim para convite.
- Alternativas equivalentes ao Pages, se um dia precisar: Cloudflare Pages, Netlify, Vercel (grátis para site estático).
- URL curta: a do Pages já é curta. Para algo mais bonito (convite impresso / QR code), um domínio `.com.br` custa ~R$ 40/ano no registro.br e se liga ao Pages com um arquivo `CNAME`. Encurtadores (bit.ly, tinyurl) também funcionam.

## Estrutura

```
index.html      página do convite
style.css       visual (paleta papel / vinho / dourado nas variáveis de :root)
script.js       CONFIG no topo (todas as informações editáveis) + interações
links.html      gerador de links personalizados para os convidados (não salva nada)
evento.ics      arquivo de agenda (iPhone/Outlook): atualizar LOCATION quando tiver o local
assets/fotos/   fotos (todas provisórias por enquanto)
.nojekyll       faz o Pages servir os arquivos como estão
```

Seções, em ordem: envelope animado com selo "K&D" (abre ao tocar) → capa com foto → convite → contagem regressiva → nossa história (linha do tempo) → galeria → onde e quando (mapa + salvar na agenda) → traje e prazo → presentes (PIX com botão copiar) → RSVP → rodapé. Um botão flutuante "Confirmar presença" aparece ao rolar.

## O que já funciona

- **Link personalizado por convidado:** `?para=Tia%20Maria&n=2` mostra "Para Tia Maria" no envelope, cumprimenta pelo nome, preenche o nome no RSVP e limita a 2 pessoas. Sem `n`, o limite é `pessoasPadrao` (4).
- **Gerador de links:** `/links.html`. Cola uma lista `Nome; pessoas` e ele gera o link de cada um + botão "Enviar no WhatsApp" com a mensagem pronta.
- **Pular o envelope:** links com `#secao` (ex.: `.../casamento/#rsvp`) abrem direto na seção. O envelope também só aparece uma vez por visita.
- **RSVP:** abre o WhatsApp dos noivos com a mensagem formatada (quando `whatsapp` estiver preenchido) **ou** grava numa planilha Google (quando `planilha` estiver preenchido, ver abaixo). Sem nenhum dos dois, mostra "modo de teste".
- **Agenda:** iPhone/Mac baixa `evento.ics`; os demais abrem o Google Agenda já preenchido.
- **Prévia no WhatsApp:** meta tags Open Graph com título, data e `assets/fotos/og.jpg`.
- Respeita `prefers-reduced-motion`. A animação ao rolar tem fallback: se o navegador não der suporte, tudo fica visível.

## O que falta (informações dos noivos)

Edite o bloco `CONFIG` no topo de `script.js`. Valores entre `[colchetes]` aparecem destacados no site como "a preencher".

- [ ] `local`: nome do local
- [ ] `endereco`: endereço completo + cidade/UF
- [ ] `mapa`: link do Google Maps do local (opcional, deixa o "Como chegar" exato)
- [ ] Cerimônia e recepção são no mesmo lugar? (hoje o site assume que sim)
- [ ] `fim`: horário estimado de término (hoje 22h, só usado na agenda)
- [ ] `traje`: ex. Esporte fino / Passeio completo
- [ ] `prazo`: data limite do RSVP (hoje "[30 de novembro]")
- [ ] `whatsapp`: número que recebe as confirmações (ex. `5511999999999`)
- [ ] `pix` e `pixNome`: chave PIX e titular; `listaPresentes`: link opcional
- [ ] `index.html`, seção **Nossa história**: anos + textos do primeiro encontro e do pedido (trechos com `class="todo"`)
- [ ] `evento.ics`: linha `LOCATION:` (vírgulas precisam virar `\,`)
- [ ] Confirmar a ordem dos nomes ("Kimie & David") e o fuso (`-03:00` = Brasília)
- [ ] **Fotos** (tabela abaixo)

Para achar o que falta no código: os valores `'[...]'` do `CONFIG` e os elementos `class="todo"` do `index.html`. No site, tudo que falta aparece com borda tracejada.

## Fotos (trocar mantendo os mesmos nomes de arquivo)

| Arquivo | Formato | Onde aparece |
|---|---|---|
| `assets/fotos/capa-vertical.jpg` | vertical (retrato) | capa no celular, **a mais importante** |
| `assets/fotos/capa-horizontal.jpg` | horizontal (paisagem) | capa no computador |
| `assets/fotos/og.jpg` | horizontal 1200×630, **menos de 300 KB** | prévia do link no WhatsApp |
| `assets/fotos/galeria-1.jpg` e `galeria-5.jpg` | vertical | galeria (ocupam 2 linhas) |
| `assets/fotos/galeria-2.jpg`, `-3`, `-4`, `-6` | horizontal | galeria |

Dicas: na foto da capa, rostos no terço de cima (o texto fica embaixo). Redimensionar para ~1600 px no lado maior e comprimir; no Mac: `sips -Z 1600 -s formatOptions 75 foto.jpg --out assets/fotos/capa-vertical.jpg`. Para mais fotos na galeria, basta adicionar `<img>` no `index.html` (classe `v` = vertical).

## RSVP numa planilha Google (opcional, recomendado)

Junta todas as respostas numa planilha, grátis e sem servidor:

1. Crie uma planilha no Google Sheets → **Extensões → Apps Script** e cole:

```js
function doPost(e) {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (aba.getLastRow() === 0) aba.appendRow(['Quando', 'Nome', 'Vai?', 'Pessoas', 'Restrições', 'Recado', 'Link (para=)']);
  const p = e.parameter;
  aba.appendRow([new Date(), p.nome, p.vai, p.pessoas, p.restricoes, p.recado, p.convite]);
  return ContentService.createTextOutput('ok');
}
```

2. **Implantar → Nova implantação → App da Web**: executar como "Eu", acesso "Qualquer pessoa". Copie a URL `https://script.google.com/macros/s/.../exec`.
3. Cole em `CONFIG.planilha` no `script.js`, faça push e teste uma confirmação.

## Como publicar uma alteração

```bash
git clone https://github.com/matosdavid/casamento.git && cd casamento
python3 -m http.server 8000      # testar em http://localhost:8000
git add -A && git commit -m "..." && git push    # o Pages atualiza em ~1 min
```

Observação para testes automáticos: screenshots com Chrome headless via linha de comando saem em branco abaixo da capa (o observer das animações não roda antes da captura), e a largura mínima é ~500 px. Para conferir o visual, use o navegador do app com emulação mobile ou um celular de verdade.

## Checklist antes de mandar para os convidados

- [ ] Nenhum destaque tracejado sobrando no site
- [ ] Testar no iPhone e no Android abrindo pelo WhatsApp (navegador interno)
- [ ] Fazer um RSVP de teste (WhatsApp ou planilha) e um "Salvar na agenda"
- [ ] Conferir a prévia do link no WhatsApp. Ele guarda a prévia em cache: compartilhe só a versão final ou use `?v=2` no link para forçar uma nova
- [ ] Gerar os links em `/links.html` e enviar

## Privacidade

O repositório é **público** (o GitHub Pages grátis exige). Fotos, local, chave PIX e o WhatsApp do RSVP ficam visíveis para quem tiver o link, o que é normal num convite. **Nunca** commitar a lista de convidados, telefones de terceiros ou planilhas. O `links.html` roda só no navegador e não salva nada.

## Ideias extras (se sobrar tempo)

- Domínio próprio + QR code no convite impresso
- Música ao abrir o envelope (faixa com licença livre; o toque no selo já libera o áudio no celular)
- Seção "Hospedagem e como chegar" para quem vem de fora
- Lightbox na galeria; mapa embutido
- Depois do casamento: trocar a contagem por "Obrigado!" e um link de álbum compartilhado (Google Fotos) para os convidados mandarem fotos

## Prompt sugerido para a próxima sessão

> Clone https://github.com/matosdavid/casamento e leia o HANDOFF.md. Quero finalizar o convite com estas informações: local = …, endereço = …, traje = …, prazo do RSVP = …, WhatsApp = …, PIX = … (titular …). Nossa história: … As fotos estão em [pasta]: escolha as melhores para cada espaço (vertical/horizontal), comprima e substitua. Depois faça push na main e me mande o link.
