/**Página de Registro do usuário */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registro-validacao");

    const nome = form.nome;
    const telefone = form.telefone;
    const email = form.email;
    const usuarioId = form.usuarioId;
    const senha = form.senha;
    const confirmaSenha = form.confirmaSenha;

    const mensagem = document.getElementById("mensagemRegistro");
    const emailError = document.getElementById("email-error");
    const botao = document.getElementById("botaoRegistro");

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    email.addEventListener("blur", function () {
        const emailValue = email.value.trim();

        if (emailValue === "") {
            emailError.style.display = "none";
        } else if (!isValidEmail(emailValue)) {
            emailError.style.display = "inline";
        } else {
            emailError.style.display = "none";
        }
    });

    telefone.addEventListener("input", function () {
        let valor = telefone.value.replace(/\D/g, '');

        if (valor.length > 10) {
            valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (valor.length > 6) {
            valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (valor.length > 2) {
            valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }

        telefone.value = valor;
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        mensagem.textContent = "";
        mensagem.style.color = "red";
        emailError.style.display = "none";

        if (!isValidEmail(email.value)) {
            emailError.style.display = "inline";
            return;
        }

        if (senha.value !== confirmaSenha.value) {
            mensagem.textContent = "As senhas não coincidem.";
            return;
        }

        if (senha.value.length < 6) {
            mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        mensagem.textContent = "Registro realizado com sucesso!";

        botao.textContent = "Sucesso!";
        botao.disabled = true;       
    });
});

/** Fim Página de Registro do usuário */

/* validação do email formulário */

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // Quando o usuário sair do campo de e-mail 
    emailInput.addEventListener("blur", function () {
        const emailValue = emailInput.value.trim();
        
        if (emailValue === "") {
            emailError.style.display = "none"; 
        } else if (!isValidEmail(emailValue)) {
            emailError.style.display = "inline"; 
        } else {
            emailError.style.display = "none"; 
        }
    });

    // Validação no envio do formulário
    document.querySelector("form").addEventListener("submit", function (event) {
        if (!isValidEmail(emailInput.value)) {
            event.preventDefault();
            alert("Por favor, insira um e-mail válido!");
        }
    });
});

/* Fim da validação do email */

/** Número de Telefone Automático */

function formatarTelefone(telefoneInput) {
    let valor = telefoneInput.value.replace(/\D/g, '');
    
    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    telefoneInput.value = valor;
}

/** Fim do Número de Telefone  */

/**Salvar Informações do formulário */

function salvarInformacoes() {
    const dados = {
        nome: document.getElementById("nome").value,
        data: document.getElementById("data").value,
        cpf: document.getElementById("cpf").value,
        sexo: document.getElementById("sexo").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        cep: document.getElementById("cep").value,
        rua: document.getElementById("rua").value,
        numero: document.getElementById("numero").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        trilha: document.querySelector('input[name="trilha"]:checked')?.value || "",
        termos: document.getElementById("termos").checked
    };

    localStorage.setItem("dadosInscricao", JSON.stringify(dados));

    alert("Informações salvas com sucesso!");
}


/**Ao Fazer a Inscrição */

  document.getElementById('form-inscricao').addEventListener('submit', function(event) {
    event.preventDefault();

    // Captura os valores dos campos obrigatórios
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();

    // verifica se todos os campos obrigatórios foram preenchidos
    if (!nome || !cpf || !email || !telefone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de e-mail básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    alert("Inscrição realizada com sucesso!");

    window.location.href = "/registro/registro.html"; 
  });

