// Formatar moeda 
export function formatarValorContabil(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function formatarInput(input) {
    let valor = input.value.replace(/\D/g, '');

    valor = (parseFloat(valor) / 100).toFixed(2);

    if (isNaN(valor)) {
        valor = '0.00';
    }

    const valorFormatado = valor.replace('.', ',');

    if (valorFormatado.split(',')[0].length > 3) {
        const partes = valorFormatado.split(',');
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        input.value = partes.join(',');
    } else {
        input.value = valorFormatado;
    }
    return parseFloat(valor);
}
//Formatação automática de campos de input
document.addEventListener('DOMContentLoaded', function() {
    const camposInput = document.querySelectorAll('.campo-input[inputmode="numeric"]');
    
    camposInput.forEach(campo => {
        campo.addEventListener('input', function() {
            formatarInput(this);
        });
    });
});