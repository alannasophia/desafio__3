/** Página de Registro do usuário */

// Array para armazenar campos inválidos
const camposInvalidos = [];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-inscricao');

    // Inicializa máscaras e validações
    aplicarMascaras();
    configurarValidacoes();
    carregarDadosSalvos();
    
    // Evento de submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Formulário submetido - iniciando validação');
        
        // Limpa erros anteriores
        camposInvalidos.length = 0;
        
        if (validarFormulario()) {
            console.log('Formulário válido - processando...');
            
            
            // Simula um tempo de processamento
            setTimeout(() => {

                // Redireciona após o envio
                window.location.href = '/DESAFIO 3/login/login.html';
            }, 2000);
        } else {
            console.log('Formulário inválido. Erros encontrados:');
            camposInvalidos.forEach(campo => console.log(campo.id || campo.name));
            
            // Rolagem para o primeiro erro
            if (camposInvalidos.length > 0) {
                camposInvalidos[0].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
});

// Função para aplicar máscaras aos campos
function aplicarMascaras() {
    // Máscara para CPF (000.000.000-00)
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // Máscara para Telefone ((00) 00000-0000)
    const telInput = document.getElementById('telefone');
    if (telInput) {
        telInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            }
            if (value.length > 10) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            } else if (value.length > 6) {
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }
    
    // Máscara para CEP (00000-000)
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 8);
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
            
            // Busca automática do endereço quando o CEP estiver completo
            if (value.length === 8) {
                buscarEnderecoPorCEP(value);
            }
        });
    }
}

// Função para buscar endereço via API ViaCEP
function buscarEnderecoPorCEP(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('CEP não encontrado');
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }
            
            document.getElementById('rua').value = data.logradouro || '';
            document.getElementById('cidade').value = data.localidade || '';
            document.getElementById('estado').value = data.uf || '';
            
            // Foca no campo número após preencher automaticamente
            document.getElementById('numero').focus();
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            const cepInput = document.getElementById('cep');
            const errorElement = criarOuObterErrorElement(cepInput);
            mostrarErro(cepInput, errorElement, 'CEP não encontrado. Preencha manualmente.');
        });
}

// Configura validações quando o campo perde o foco
function configurarValidacoes() {
    const campos = [
        { id: 'nome', validator: validarNome },
        { id: 'data', validator: validarDataNascimento },
        { id: 'cpf', validator: validarCPF },
        { id: 'email', validator: validarEmail },
        { id: 'telefone', validator: validarTelefone },
        { id: 'cep', validator: validarCEP },
        { id: 'rua', validator: validarRua },
        { id: 'numero', validator: validarNumero },
        { id: 'cidade', validator: validarCidade },
        { id: 'estado', validator: validarEstado }
    ];
    
    campos.forEach(campo => {
        const element = document.getElementById(campo.id);
        if (element) {
            element.addEventListener('blur', function() {
                campo.validator(this);
            });
            
            element.addEventListener('input', function() {
                if (this.classList.contains('input-error')) {
                    const errorElement = this.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.style.display = 'none';
                        this.classList.remove('input-error');
                    }
                }
            });
        }
    });
}

// Função principal de validação
function validarFormulario() {
    camposInvalidos.length = 0;
    
    const validacoes = [
        { nome: 'Nome', valido: validarCampo('nome', validarNome) },
        { nome: 'Data Nascimento', valido: validarCampo('data', validarDataNascimento) },
        { nome: 'CPF', valido: validarCampo('cpf', validarCPF) },
        { nome: 'Email', valido: validarCampo('email', validarEmail) },
        { nome: 'Telefone', valido: validarCampo('telefone', validarTelefone) },
        { nome: 'CEP', valido: validarCampo('cep', validarCEP) },
        { nome: 'Rua', valido: validarCampo('rua', validarRua) },
        { nome: 'Número', valido: validarCampo('numero', validarNumero) },
        { nome: 'Cidade', valido: validarCampo('cidade', validarCidade) },
        { nome: 'Estado', valido: validarCampo('estado', validarEstado) },
        { nome: 'Trilhas', valido: validarTrilhas() },
        { nome: 'Termos', valido: validarTermos() }
    ];
    
    return validacoes.every(v => v.valido);
}

// Função auxiliar para validar campos
function validarCampo(id, validator) {
    const input = document.getElementById(id);
    if (!input) return false;
    
    const isValid = validator(input);
    if (!isValid) camposInvalidos.push(input);
    return isValid;
}

// Funções de validação individuais
function validarNome(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'O nome completo é obrigatório');
        return false;
    }
    
    if (value.split(' ').length < 2) {
        mostrarErro(input, errorElement, 'Digite seu nome completo');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarDataNascimento(input) {
    const value = input.value;
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'A data de nascimento é obrigatória');
        return false;
    }
    
    const dataNascimento = new Date(value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    
    if (idade < 12) {
        mostrarErro(input, errorElement, 'Você deve ter pelo menos 12 anos');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarCPF(input) {
    const value = input.value.replace(/\D/g, '');
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'O CPF é obrigatório');
        return false;
    }
    
    if (value.length !== 11 || !validarDigitosCPF(value)) {
        mostrarErro(input, errorElement, 'CPF inválido');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarDigitosCPF(cpf) {
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function validarEmail(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
        mostrarErro(input, errorElement, 'O e-mail é obrigatório');
        return false;
    }
    
    if (!regex.test(value)) {
        mostrarErro(input, errorElement, 'E-mail inválido');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarTelefone(input) {
    const value = input.value.replace(/\D/g, '');
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'O telefone é obrigatório');
        return false;
    }
    
    if (value.length < 10 || value.length > 11) {
        mostrarErro(input, errorElement, 'Telefone inválido (deve ter 10 ou 11 dígitos)');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarCEP(input) {
    const value = input.value.replace(/\D/g, '');
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'O CEP é obrigatório');
        return false;
    }
    
    if (value.length !== 8) {
        mostrarErro(input, errorElement, 'CEP inválido (deve conter 8 dígitos)');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarRua(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'A rua é obrigatória');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarNumero(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'O número é obrigatório');
        return false;
    }
    
    if (isNaN(value)) {
        mostrarErro(input, errorElement, 'O número deve conter apenas dígitos');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarCidade(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'A cidade é obrigatória');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarEstado(input) {
    const value = input.value.trim().toUpperCase();
    const errorElement = criarOuObterErrorElement(input);
    const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
    
    if (!value) {
        mostrarErro(input, errorElement, 'O estado é obrigatório');
        return false;
    }
    
    if (value.length !== 2 || !estados.includes(value)) {
        mostrarErro(input, errorElement, 'Use a sigla do estado (ex: SP)');
        return false;
    }
    
    input.value = value;
    removerErro(input, errorElement);
    return true;
}

function validarTrilhas() {
    const trilhasSelecionadas = document.querySelectorAll('input[name="trilha"]:checked');
    const errorElement = document.getElementById('trilhas-error') || criarErrorElementGlobal('trilhas-error', 'Por favor, selecione uma trilha');
    
    if (trilhasSelecionadas.length === 0) {
        const trilhasContainer = document.querySelector('.trilhas__container');
        
        if (!document.getElementById('trilhas-error')) {
            trilhasContainer.parentNode.insertBefore(errorElement, trilhasContainer.nextSibling);
        }
        
        errorElement.style.display = 'block';
        camposInvalidos.push(trilhasContainer);
        return false;
    }
    
    errorElement.style.display = 'none';
    return true;
}

function validarTermos() {
    const termos = document.getElementById('termos');
    const errorElement = document.getElementById('termos-error') || criarErrorElementGlobal('termos-error', 'Você deve aceitar os termos para continuar');
    
    if (!termos.checked) {
        const termosContainer = document.querySelector('.conteudo_formulario_politica');
        if (!document.getElementById('termos-error')) {
            termosContainer.parentNode.insertBefore(errorElement, termosContainer.nextSibling);
        }
        errorElement.style.display = 'block';
        camposInvalidos.push(termosContainer);
        return false;
    }
    
    errorElement.style.display = 'none';
    return true;
}

// Funções auxiliares para manipulação de erros
function criarOuObterErrorElement(input) {
    let errorElement = input.nextElementSibling;
    
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    return errorElement;
}

function criarErrorElementGlobal(id, mensagem) {
    const errorElement = document.createElement('div');
    errorElement.id = id;
    errorElement.className = 'error-message global-error';
    errorElement.textContent = mensagem;
    errorElement.style.color = '#ff4444';
    errorElement.style.marginTop = '5px';
    errorElement.style.display = 'none';
    return errorElement;
}

function mostrarErro(input, errorElement, mensagem) {
    input.classList.add('input-error');
    errorElement.textContent = mensagem;
    errorElement.style.display = 'block';
    errorElement.style.color = '#ff4444';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
}

function removerErro(input, errorElement) {
    input.classList.remove('input-error');
    errorElement.style.display = 'none';
}

// Função para salvar dados localmente
function salvarDadosLocalmente() {
    const formData = {
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        trilha: document.querySelector('input[name="trilha"]:checked')?.value,
        termos: document.getElementById('termos').checked
    };

    localStorage.setItem('formInscricaoDados', JSON.stringify(formData));
}

// Função para carregar dados salvos localmente
function carregarDadosSalvos() {
    const dadosSalvos = localStorage.getItem('formInscricaoDados');
    if (dadosSalvos) {
        try {
            const formData = JSON.parse(dadosSalvos);
            
            // Preenche os campos do formulário
            Object.keys(formData).forEach(key => {
                const element = document.getElementById(key) || 
                              document.querySelector(`input[name="${key}"][value="${formData[key]}"]`);
                
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = formData[key];
                    } else if (element.type === 'radio') {
                        if (element.value === formData[key]) {
                            element.checked = true;
                        }
                    } else {
                        element.value = formData[key] || '';
                    }
                }
            });
        } catch (e) {
            console.error('Erro ao carregar dados salvos:', e);
        }
    }
}

// Função para o botão "Salvar informações"
function salvarInformacoes() {
    salvarDadosLocalmente();
    alert('Informações salvas com sucesso! Você pode continuar preenchendo mais tarde.');
}

// Adiciona eventos para salvar automaticamente quando os campos mudam
document.querySelectorAll('#form-inscricao input, #form-inscricao select').forEach(element => {
    element.addEventListener('change', salvarDadosLocalmente);
    element.addEventListener('blur', salvarDadosLocalmente);
});