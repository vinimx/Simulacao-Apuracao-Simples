/**
 * Tipos de notificação disponíveis
 * @readonly
 * @enum {string}
 */
export const TipoNotificacao = {
    ERRO: 'erro',
    SUCESSO: 'sucesso',
    INFO: 'info'
};

/**
 * Cria e exibe uma notificação na interface
 * @param {string} mensagem - A mensagem a ser exibida
 * @param {string} tipo - O tipo de notificação (erro, sucesso, info)
 * @param {number} [duracao=5000] - Duração em milissegundos que a notificação ficará visível
 */
export function mostrarNotificacao(mensagem, tipo, duracao = 5000) {
    // Remove notificações anteriores
    const notificacoesAnteriores = document.querySelectorAll('.notificacao');
    notificacoesAnteriores.forEach(notif => notif.remove());

    // Cria o elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    
    // Adiciona o ícone apropriado
    const icone = document.createElement('i');
    switch (tipo) {
        case TipoNotificacao.ERRO:
            icone.className = 'bi bi-exclamation-circle';
            break;
        case TipoNotificacao.SUCESSO:
            icone.className = 'bi bi-check-circle';
            break;
        case TipoNotificacao.INFO:
            icone.className = 'bi bi-info-circle';
            break;
    }
    
    // Cria o elemento para a mensagem
    const mensagemElement = document.createElement('span');
    mensagemElement.textContent = mensagem;
    
    // Cria o botão de fechar
    const botaoFechar = document.createElement('button');
    botaoFechar.className = 'notificacao-fechar';
    botaoFechar.innerHTML = '&times;';
    botaoFechar.onclick = () => notificacao.remove();
    
    // Monta a notificação
    notificacao.appendChild(icone);
    notificacao.appendChild(mensagemElement);
    notificacao.appendChild(botaoFechar);
    
    // Adiciona ao documento
    document.body.appendChild(notificacao);
    
    // Remove após a duração especificada
    setTimeout(() => {
        if (notificacao && notificacao.parentElement) {
            notificacao.remove();
        }
    }, duracao);
} 