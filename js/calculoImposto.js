import { anexoI, anexoII, anexoIII, anexoIV, anexoV } from './anexos.js';
import { formatarValorContabil } from './formatarMoeda.js';
import { mostrarNotificacao, TipoNotificacao } from './notificacao.js';

/**
 * Elementos do DOM utilizados no cálculo
 */
const receitaBrutaInput = document.getElementById('receitaBruta');
const receitaMesInput = document.getElementById('receitaMes');
const totalImpostosSpan = document.getElementById('totalImpostos');
const botoesAnexo = document.querySelectorAll('.btn-anexo');
const botoesFaixa = document.querySelectorAll('.btn-faixa');

/**
 * Estado global do cálculo
 */
let anexoSelecionado = null;
let faixaSelecionada = null;

/**
 * Valida se a receita bruta está dentro dos limites da faixa selecionada
 * @param {number} receitaBruta - Valor da receita bruta dos últimos 12 meses
 * @param {number} faixa - Número da faixa selecionada (1 a 6)
 * @returns {Object} Objeto contendo o status da validação e mensagem de erro se houver
 */
function validarReceitaBruta(receitaBruta, faixa) {
    const faixaAtual = faixa - 1;
    const faixaAnterior = faixa - 2;
    
    let limiteInferior = 0;
    if (faixaAnterior >= 0) {
        limiteInferior = anexoSelecionado[faixaAnterior].receitaMax;
    }
    
    const limiteSuperior = anexoSelecionado[faixaAtual].receitaMax;
    
    if (receitaBruta < limiteInferior) {
        return {
            valido: false,
            mensagem: `A receita bruta deve ser maior que ${formatarValorContabil(limiteInferior)} para a faixa ${faixa}`
        };
    }
    
    if (receitaBruta > limiteSuperior) {
        return {
            valido: false,
            mensagem: `A receita bruta deve ser menor que ${formatarValorContabil(limiteSuperior)} para a faixa ${faixa}`
        };
    }
    
    return { valido: true };
}

/**
 * Calcula o imposto devido com base na receita bruta, receita do mês,
 * anexo e faixa selecionados
 * @param {number} receitaBruta - Valor da receita bruta dos últimos 12 meses
 * @param {number} receitaMes - Valor da receita do mês atual
 */
function calcularImposto(receitaBruta, receitaMes) {
    // Validação dos campos obrigatórios
    if (!anexoSelecionado || !faixaSelecionada) {
        mostrarNotificacao('Por favor, selecione o anexo e a faixa de faturamento', TipoNotificacao.INFO);
        return;
    }

    // Validação de valores negativos
    if (receitaBruta < 0 || receitaMes < 0) {
        mostrarNotificacao('Os valores de receita não podem ser negativos', TipoNotificacao.ERRO);
        return;
    }

    // Validação da receita do mês em relação à receita bruta
    if (receitaMes > receitaBruta) {
        mostrarNotificacao('A receita do mês não pode ser maior que a receita bruta dos últimos 12 meses', TipoNotificacao.ERRO);
        return;
    }

    const faixaAtual = faixaSelecionada - 1;
    const { aliquotaNominal, deducao } = anexoSelecionado[faixaAtual];
    
    // Validação dos limites da faixa
    const validacao = validarReceitaBruta(receitaBruta, faixaSelecionada);
    if (!validacao.valido) {
        mostrarNotificacao(validacao.mensagem, TipoNotificacao.ERRO);
        return;
    }
    
    // Cálculo da alíquota efetiva e do imposto
    const aliquotaEfetiva = ((receitaBruta * aliquotaNominal) - deducao) / receitaBruta;
    const impostoMes = receitaMes * aliquotaEfetiva;
    
    // Atualização do resultado e notificação de sucesso
    totalImpostosSpan.textContent = formatarValorContabil(impostoMes);
    mostrarNotificacao('Cálculo realizado com sucesso!', TipoNotificacao.SUCESSO);
}

/**
 * Event listeners para os botões de anexo
 */
botoesAnexo.forEach(botao => {
    botao.addEventListener('click', () => {
        const anexo = parseInt(botao.dataset.anexo);
        switch(anexo) {
            case 1: anexoSelecionado = anexoI; break;
            case 2: anexoSelecionado = anexoII; break;
            case 3: anexoSelecionado = anexoIII; break;
            case 4: anexoSelecionado = anexoIV; break;
            case 5: anexoSelecionado = anexoV; break;
        }
        
        // Recalcula se todos os campos necessários estiverem preenchidos
        if (faixaSelecionada && receitaBrutaInput.value && receitaMesInput.value) {
            const receitaBruta = parseFloat(receitaBrutaInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const receitaMes = parseFloat(receitaMesInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            calcularImposto(receitaBruta, receitaMes);
        }
    });
});

/**
 * Event listeners para os botões de faixa
 */
botoesFaixa.forEach(botao => {
    botao.addEventListener('click', () => {
        faixaSelecionada = parseInt(botao.dataset.faixa);
        
        // Recalcula se todos os campos necessários estiverem preenchidos
        if (anexoSelecionado && receitaBrutaInput.value && receitaMesInput.value) {
            const receitaBruta = parseFloat(receitaBrutaInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const receitaMes = parseFloat(receitaMesInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            calcularImposto(receitaBruta, receitaMes);
        }
    });
});

/**
 * Event listeners para os campos de receita
 */
receitaBrutaInput.addEventListener('blur', () => {
    const receitaBruta = parseFloat(receitaBrutaInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const receitaMes = parseFloat(receitaMesInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    calcularImposto(receitaBruta, receitaMes);
});

receitaMesInput.addEventListener('blur', () => {
    const receitaBruta = parseFloat(receitaBrutaInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const receitaMes = parseFloat(receitaMesInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    calcularImposto(receitaBruta, receitaMes);
});
