/**
 * RSVP do convite Kimie & David -> Google Sheets + aviso por e-mail.
 *
 * Como usar (5 minutos, passo a passo no HANDOFF.md):
 * 1. Crie uma planilha no Google Sheets e abra Extensões > Apps Script.
 * 2. Apague o conteúdo e cole este arquivo inteiro. Salve.
 * 3. Implantar > Nova implantação > tipo "App da Web":
 *    executar como "Eu", quem pode acessar "Qualquer pessoa". Autorize.
 * 4. Copie a URL que termina em /exec e cole em CONFIG.planilha no script.js.
 */
function doPost(e) {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (aba.getLastRow() === 0) {
    aba.appendRow(['Quando', 'Convite', 'Vai?', 'Quem vai', 'Pessoas', 'Não vai', 'Restrições', 'Recado']);
  }
  const p = e.parameter;
  const linha = [new Date(), p.convite, p.vai, p.quem, p.pessoas, p.nao_vao, p.restricoes, p.recado];

  // Mesmo convite respondendo de novo: atualiza a linha em vez de duplicar
  const convites = aba.getRange(1, 2, aba.getLastRow(), 1).getValues().map((l) => l[0]);
  const i = convites.indexOf(p.convite);
  if (i > 0) aba.getRange(i + 1, 1, 1, linha.length).setValues([linha]);
  else aba.appendRow(linha);

  // Aviso por e-mail para o dono da planilha (chega como notificação do Gmail)
  MailApp.sendEmail(
    Session.getEffectiveUser().getEmail(),
    `RSVP: ${p.convite} (${p.vai})${i > 0 ? ' [resposta alterada]' : ''}`,
    `Quem vai: ${p.quem || '-'}\nNão vai: ${p.nao_vao || '-'}\nRestrições: ${p.restricoes || '-'}\nRecado: ${p.recado || '-'}`
  );
  return ContentService.createTextOutput('ok');
}
