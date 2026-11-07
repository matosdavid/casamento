# HANDOFF: convite de casamento Kimie & David 💍

> Documento para continuar o trabalho em outra sessão do Claude Code.
> Numa sessão nova, cole o prompt do fim deste arquivo junto com as informações e a pasta de fotos.

## Resumo

| | |
|---|---|
| Evento | Casamento **Kimie & David**, sexta-feira, **11/12/2026, 15h** (horário de Brasília) |
| Site no ar | https://matosdavid.github.io/casamento/ |
| Repositório | https://github.com/matosdavid/casamento (público, branch `main`) |
| Guia de uso | https://matosdavid.github.io/casamento/guia/ (para a noiva; atualizar quando mudar o fluxo ou o que falta) |
| Gerador de links | https://matosdavid.github.io/casamento/links.html |
| Estilo dos textos | **Sem travessão (— ou –) nos textos das páginas**, pedido do usuário: no Brasil quase ninguém usa e denuncia texto gerado por IA. Usar vírgula, ponto ou dois-pontos. |
| Hospedagem | GitHub Pages: publica a raiz da `main` a cada push (~1 min) |
| Stack | HTML + CSS + JS puro, sem build. Fontes Cormorant Garamond + Jost (Google Fonts) |
| Status | Primeira versão no ar, com **fotos e textos provisórios** (destacados no site com borda tracejada) |

## Status em 07/11/2026

Já preenchido (pela noiva) e no ar:
- Local: Edifício Santa Margherita, Rua Tamandaré, 655 - Liberdade, São Paulo - SP, 01525-001 (também no `evento.ics`)
- Traje: Esporte fino · Prazo do RSVP: 20 de novembro
- RSVP via WhatsApp para +55 41 99906-3756 (`CONFIG.whatsapp`). Planilha ainda não configurada.
- PIX: +5541999063756 (titular não informado: `pixNome` vazio esconde a linha "Titular")
- Nossa história: 2023 (primeiro encontro) e 2025 (pedido em Toronto), textos da noiva em `index.html`
- Letras do "Este convite é para N pessoas" e do trecho do PIX ficaram maiores e mais escuras (pedido da noiva)

**Falta:** fotos reais (ver tabela de fotos). Telefone e chave PIX ficam visíveis no código público e no site, o que é inerente ao convite.

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
links.html      gerador de links personalizados (lista salva só no navegador, via localStorage)
guia/index.html guia de uso para a noiva: /casamento/guia/ (como ver, gerar links, o que falta)
evento.ics      arquivo de agenda (iPhone/Outlook): atualizar LOCATION quando tiver o local
assets/fotos/   fotos (todas provisórias por enquanto)
.nojekyll       faz o Pages servir os arquivos como estão
```

Seções, em ordem: envelope (abre ao tocar no selo) → capa com foto → convite → contagem regressiva → nossa história (linha do tempo) → galeria → onde e quando (mapa + salvar na agenda) → traje e prazo → RSVP → presentes (discreto, só uma frase) → rodapé. Um botão flutuante "Confirmar presença" aparece ao rolar.

## O que já funciona

**Animações e interação** (GSAP 3.12.5 + ScrollTrigger via cdnjs, carregados no `index.html`):

- **Envelope:** o selo de cera racha na horizontal (a parte de cima sai junto com a aba, a de baixo fica no envelope, com farelos de cera), a aba abre em 3D, a carta sobe e cresce até virar a capa, com chuva de pétalas (canvas). Vibra de leve no Android. O usuário gostou muito dessa parte: manter. Não voltar a rachar na vertical: separava o K do D e parecia um coração partido.
- **Capa:** os nomes surgem letra a letra (de desfocado a nítido), o "&" gira, um floreio com coração se desenha, pétalas caem de leve enquanto a capa está na tela, e a foto faz parallax ao rolar. O "Vamos nos casar" foi removido a pedido.
- **Títulos** sobem palavra por palavra de dentro de uma máscara; ramos botânicos dourados se desenham e flutuam em parallax.
- **Contagem regressiva** com dígitos que rolam a cada segundo.
- **Nossa história:** a linha do tempo se preenche com a rolagem e os marcadores acendem.
- **Galeria:** as fotos aparecem com efeito de cortina e zoom; um toque abre em tela cheia, com deslizar para os lados, setas e teclado.
- **Local:** o cartão entra em 3D e o "11" conta de 1 a 11. Os botões têm efeito de onda ao toque.
- **RSVP:** cartões "Vou / Não vou" (no plural quando o convite tem mais de um nome) e, para casais e famílias, a lista "Quem vai?" só com os nomes do convite, para desmarcar quem não puder ir. Não existe campo de quantidade, para ninguém achar que pode levar acompanhante. Ao enviar, o cartão vira em 3D com o agradecimento, o botão de agenda e confete de corações. "Alterar resposta" desvira.
- **Presentes (pedido do usuário: bem sutil):** só uma frase no fim com o link "deixamos uma chave PIX", que abre suavemente; copiar mostra um aviso pequeno.
- Barra de progresso dourada no topo.
- Sem GSAP (CDN fora do ar) ou com "reduzir movimento" ligado no aparelho, o site fica estático e tudo continua visível.

**Funcional:**

- **Link personalizado por convite:** `?c=<código>` leva os nomes exatos do convite (ex.: `Tio Hugo|Tia Georgia`) em base64, para não ficarem legíveis nem fáceis de editar na URL. É disfarce, não segurança. O site mostra "Para Tio Hugo e Tia Georgia" no envelope, cumprimenta pelos nomes e monta o RSVP só com essas pessoas. `?para=Ana|Bruno` sem codificar também funciona. Um link sem nomes pede o nome no RSVP.
- **Gerador de links:** `/links.html`. Um convite por linha, com telefone opcional depois de `;` (ex.: `Tio Hugo e Tia Georgia; 11 99999-9999`). Ele gera o link codificado, a mensagem no singular ou plural ({voces}) e o botão que abre direto a conversa daquele contato no WhatsApp. Também marca quem já recebeu e mostra o total de convites, pessoas e enviados. A lista fica salva só no navegador (localStorage), nunca no repo.
- **Pular o envelope:** links com `#secao` (ex.: `.../casamento/#rsvp`) abrem direto na seção. O envelope também só aparece uma vez por visita.
- **RSVP:** abre o WhatsApp dos noivos com a mensagem formatada (quando `whatsapp` estiver preenchido) **ou** grava numa planilha Google (quando `planilha` estiver preenchido, ver abaixo). Sem nenhum dos dois, mostra "modo de teste".
- **Agenda:** iPhone/Mac baixa `evento.ics`; os demais abrem o Google Agenda já preenchido.
- **Prévia no WhatsApp:** meta tags Open Graph com título, data e `assets/fotos/og.jpg`.
- **Cache:** o `index.html` carrega `style.css?v=6` e `script.js?v=6`. A cada mudança no CSS/JS, aumente esse número; senão, quem já abriu o site pode ver a versão antiga por até 10 minutos.

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
  if (aba.getLastRow() === 0) aba.appendRow(['Quando', 'Convite', 'Vai?', 'Quem vai', 'Pessoas', 'Não vai', 'Restrições', 'Recado']);
  const p = e.parameter;
  aba.appendRow([new Date(), p.convite, p.vai, p.quem, p.pessoas, p.nao_vao, p.restricoes, p.recado]);
  // Avisa por e-mail o dono da planilha a cada resposta (chega como notificação do Gmail)
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), `RSVP: ${p.convite} (${p.vai})`,
    `Quem vai: ${p.quem || '-'}\nNão vai: ${p.nao_vao || '-'}\nRestrições: ${p.restricoes || '-'}\nRecado: ${p.recado || '-'}`);
  return ContentService.createTextOutput('ok');
}
```

2. **Implantar → Nova implantação → App da Web**: executar como "Eu", acesso "Qualquer pessoa". Copie a URL `https://script.google.com/macros/s/.../exec`.
3. Cole em `CONFIG.planilha` no `script.js`, faça push e teste uma confirmação. Na primeira vez, o Google pede para autorizar o acesso à planilha e ao e-mail.

**Como os noivos ficam sabendo de cada resposta:**
- **Com a planilha (recomendado):** cada RSVP vira uma linha nova e o script manda um e-mail para o dono da planilha, que chega como notificação do Gmail no celular. A lista fica pronta para contar os convidados.
- **Só com WhatsApp:** o convidado toca em "enviar" e a mensagem chega no WhatsApp dos noivos. Mas depende de ele concluir o envio, e não há lista automática.

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
