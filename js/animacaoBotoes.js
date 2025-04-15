document.addEventListener('DOMContentLoaded', function() {
    const botoesAnexo = document.querySelectorAll('.btn-anexo');

    botoesAnexo.forEach(botao => {
        botao.addEventListener('click', function() {
            botoesAnexo.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
        });
    });

    const botoesFaixa = document.querySelectorAll('.btn-faixa');

    botoesFaixa.forEach(botao => {
        botao.addEventListener('click', function() {
            botoesFaixa.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
        });
    });
}); 