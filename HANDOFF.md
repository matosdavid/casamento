# HANDOFF: convite de casamento Kimie & David 💍

> Documento para continuar o trabalho em outra sessão do Claude Code.
> Numa sessão nova: clone o repo, leia este arquivo e siga o pedido do usuário (prompt sugerido no fim).

## Resumo

| | |
|---|---|
| Evento | Casamento **Kimie & David**, sexta-feira, **11/12/2026, 15h** (horário de Brasília) |
| Local | Edifício Santa Margherita, Rua Tamandaré, 655 - Liberdade, São Paulo - SP, 01525-001 |
| Site no ar | https://matosdavid.github.io/casamento/ |
| Gerador de links | https://matosdavid.github.io/casamento/links.html |
| Guia de uso (para a noiva) | https://matosdavid.github.io/casamento/guia/ |
| Repositório | https://github.com/matosdavid/casamento (público, branch `main`) |
| Hospedagem | GitHub Pages: publica a raiz da `main` a cada push (~30 s) |
| Stack | HTML + CSS + JS puro, sem build. GSAP 3.12.5 + ScrollTrigger (cdnjs). Fontes Cormorant Garamond + Jost |
| Estilo dos textos | **Sem travessão (— ou –) nos textos das páginas.** Pedido do usuário: no Brasil quase ninguém usa e denuncia texto de IA. Usar vírgula, ponto ou dois-pontos |

## Status em 07/11/2026

**Pronto e no ar:** todo o conteúdo real (local, traje Esporte fino, prazo do RSVP 20 de novembro, Nossa história 2023/2025 com textos da noiva, PIX, WhatsApp do RSVP) e as **fotos reais** (capa na neve, foto do pedido na história, galeria com 10 fotos).

**Falta (opcional):**
1. Configurar a planilha do RSVP (5 minutos, precisa da conta Google dos noivos; passo a passo abaixo). Hoje o RSVP vai pelo WhatsApp.
2. Testar em iPhone e Android de verdade, abrindo pelo WhatsApp.
3. Gerar os links em `/links.html` e enviar.

## Por que GitHub Pages (e não Streamlit)

- **GitHub Pages:** grátis, no ar 24h sem "dormir", HTTPS, deploy = `git push`.
- **Streamlit Community Cloud:** feito para apps de dados em Python; o app hiberna sem acesso e o convidado cai numa tela para "acordar" o app.
- Alternativas equivalentes, se precisar: Cloudflare Pages, Netlify, Vercel. Domínio próprio `.com.br` custa ~R$ 40/ano no registro.br (arquivo `CNAME`).

## Estrutura

```
index.html        página do convite
style.css         visual (paleta papel / vinho / dourado nas variáveis de :root)
script.js         CONFIG no topo (todas as informações editáveis) + interações
links.html        gerador de links (lista salva só no navegador, via localStorage)
guia/index.html   guia de uso para a noiva (atualizar quando mudar o fluxo)
rsvp-planilha.gs  script do Google Apps Script para o RSVP em planilha
evento.ics        agenda para iPhone/Outlook (já com o local)
assets/fotos/     fotos (ver tabela)
.nojekyll         faz o Pages servir os arquivos como estão
```

**Cache:** o `index.html` carrega `style.css?v=9` e `script.js?v=9` (`links.html` e `guia/` usam `style.css?v=9`). A cada mudança no CSS/JS, aumente o número em todos; senão quem já abriu o site vê a versão antiga por até 10 minutos.

## O que o site faz

**Animações e interação** (sem GSAP ou com "reduzir movimento" ligado, o site fica estático e tudo visível):
- **Envelope (o usuário adora, manter):** selo de cera racha **na horizontal** (parte de cima sai com a aba, a de baixo fica no envelope, com farelos de cera), aba abre em 3D, a carta sobe e cresce até virar a capa, chuva de pétalas. Não voltar a rachar na vertical: separava o K do D e parecia coração partido. A animação de pulsar usa a propriedade `scale` (não `transform`) para não brigar com a transição de abertura.
- **Capa:** foto na neve. No celular o texto fica no alto (céu), no computador fica à direita, para não cobrir os rostos. Nomes letra a letra, floreio com coração, pétalas, parallax. Sem o "Vamos nos casar" (removido a pedido).
- **Títulos** sobem palavra por palavra; ramos dourados se desenham; contagem regressiva com dígitos que rolam.
- **Nossa história:** linha do tempo se preenche ao rolar; a foto do pedido (anel + buquê) aparece como polaroid no item "O pedido".
- **Galeria:** 10 fotos com efeito de cortina; toque abre em tela cheia com deslizar, setas e teclado.
- **Local:** cartão em 3D, o "11" conta de 1 a 11, botões "Como chegar" e "Salvar na agenda".
- **RSVP:** cartões "Vou / Não vou" (plural para casais) e lista "Quem vai?" só com os nomes do convite. Sem campo de quantidade, para ninguém achar que pode levar acompanhante. Ao enviar, o cartão vira em 3D com agradecimento, agenda e confete.
- **Presentes:** só uma frase discreta no fim; a chave PIX abre suavemente, em cinza claro e pequena (é para copiar, não para ler).
- Letras do "Este convite é para N pessoas" e do trecho do PIX maiores e mais escuras (pedido da noiva).

**Funcional:**
- **Link por convite:** `?c=<código>` leva os nomes exatos (ex.: `Tio Hugo|Tia Georgia`) em base64, para não ficarem legíveis nem fáceis de editar. É disfarce, não segurança. Envelope mostra "Para Tio Hugo e Tia Georgia", a saudação usa os nomes e a frase vira "convidamos vocês" quando há mais de um. `?para=Ana|Bruno` sem codificar também funciona. Link sem nomes pede o nome no RSVP.
- **Gerador (`/links.html`):** um convite por linha, telefone opcional após `;` (`Tio Hugo e Tia Georgia; 11 99999-9999`). Gera link, mensagem no singular/plural e botão que abre a conversa do contato no WhatsApp; marca enviados e mostra totais. A lista fica só no navegador, nunca no repo.
- **Memória de quem já respondeu:** depois de responder, quem volta ao mesmo link (no mesmo aparelho) vê "Você já respondeu" com a resposta dada e o botão "Alterar resposta". Vale por aparelho/navegador (localStorage); não impede alguém de responder de outro celular. Na planilha, a mesma resposta do mesmo convite **atualiza a linha** em vez de duplicar.
- **Pular o envelope:** links com `#secao` (ex.: `#rsvp`) abrem direto na seção; o envelope aparece uma vez por aba.
- **Prévia no WhatsApp:** Open Graph com `assets/fotos/og.jpg` (1200×630, foto na neve, < 300 KB).

## Fotos

| Arquivo | Foto | Onde |
|---|---|---|
| `capa-vertical.jpg` e `capa-horizontal.jpg` | na neve (paisagem, mesma foto) | capa; no celular o recorte usa `object-position: 25%` |
| `og.jpg` | neve, recortada 1200×630 | prévia do link |
| `pedido.jpg` | anel + buquê | polaroid em "O pedido" |
| `galeria-1` a `galeria-10` | cúpula de vidro, show, selfie ao ar livre, gatinho, gatos no colo, sofá com gato, bolo, selfie antiga (cama), lanche no quarto, selfie antiga (biquinho) | galeria |

A galeria tem 2 colunas com `grid-auto-flow: dense`; fotos verticais têm classe `v` e ocupam 2 linhas. A ordem atual (V, H, H, V, V, H, V, H, V, V) fecha sem buracos: ao trocar fotos, mantenha a mesma quantidade de verticais/horizontais ou reorganize. As duas fotos antigas (8 e 10) têm resolução baixa; dá para trocar por outras.

## RSVP: como as respostas chegam

**Hoje (WhatsApp):** `CONFIG.whatsapp = '5541999063756'`. O botão abre o WhatsApp do convidado com a mensagem pronta para a noiva; depende de ele tocar em "enviar" e não há lista automática.

**Planilha (recomendado, precisa da conta Google dos noivos):**
1. Criar uma planilha no Google Sheets > **Extensões > Apps Script**.
2. Colar o conteúdo de `rsvp-planilha.gs` (já pronto: grava, evita duplicar o mesmo convite e manda e-mail a cada resposta).
3. **Implantar > Nova implantação > App da Web**: executar como "Eu", acesso "Qualquer pessoa". Autorizar planilha + e-mail.
4. Copiar a URL `https://script.google.com/macros/s/.../exec` para `CONFIG.planilha` no `script.js`, aumentar o `?v=` e fazer push. Testar uma confirmação.

Com `planilha` preenchida, o RSVP vai só para a planilha + e-mail (o WhatsApp deixa de abrir). Se quiserem os dois, dá para abrir o WhatsApp antes do `fetch` no submit (precisa ser síncrono, senão o navegador bloqueia a janela).

## Privacidade

Repo **público** (o Pages grátis exige). Telefone/PIX, local e fotos ficam visíveis no código e para quem tiver o link; isso é inerente ao convite (o botão de RSVP e a chave PIX mostram o número de qualquer forma). Para tirar o número do código: usar a planilha no RSVP e trocar a chave PIX por e-mail ou chave aleatória. **Nunca** commitar lista de convidados ou telefones de terceiros.

## Como publicar uma alteração

```bash
git clone https://github.com/matosdavid/casamento.git && cd casamento
python3 -m http.server 8000      # testar em http://localhost:8000
git add -A && git commit -m "..." && git push
```

Para conferir o visual, use o navegador do app com emulação mobile (375×812) ou um celular. Screenshots com Chrome headless via linha de comando saem em branco abaixo da capa (os observers não rodam antes da captura) e têm largura mínima de ~500 px.

## Checklist antes de enviar

- [ ] Testar no iPhone e no Android abrindo pelo WhatsApp
- [ ] Fazer um RSVP de teste e um "Salvar na agenda"
- [ ] Conferir a prévia do link no WhatsApp (ele guarda cache; para forçar, use `?v=2` no link)
- [ ] (Opcional) configurar a planilha
- [ ] Gerar os links em `/links.html` e enviar

## Ideias extras

- Domínio próprio + QR code para convite impresso
- Música ao abrir o envelope (faixa com licença livre; o toque no selo já libera o áudio)
- Seção "Hospedagem e como chegar" para quem vem de fora
- Depois do casamento: trocar a contagem por "Obrigado!" e um álbum compartilhado para os convidados

## Prompt sugerido para a próxima sessão

> Clone https://github.com/matosdavid/casamento e leia o HANDOFF.md. Quero [ex.: configurar a planilha do RSVP com esta URL: …] / [trocar a foto X] / [ajustar Y]. Lembre: sem travessão nos textos, aumentar o `?v=` ao mudar CSS/JS, testar em tamanho de celular e fazer push na main.
