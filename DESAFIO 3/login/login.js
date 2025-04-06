/** Página de Login */

document.addEventListener("DOMContentLoaded", function () {
    let cpfInput = document.getElementById("cpf");
    let senhaInput = document.getElementById("senha");
    let btnLogin = document.getElementById("btnLogin");

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ""); // Remove tudo que não for número
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[10])) return false;

        return true;
    }

    function verificarCampos() {
        let cpfValue = cpfInput.value.trim();
        let senhaValue = senhaInput.value.trim();
        let formValido = true;

        // Resetando mensagens de erro
        document.getElementById("cpfUsuarioError").textContent = "";
        document.getElementById("cpfSenhaError").textContent = "";

        // Verifica se o CPF é válido
        if (!validarCPF(cpfValue)) {
            document.getElementById("cpfUsuarioError").textContent = "CPF inválido!";
            formValido = false;
        }

        // Verifica se os dois campos são iguais
        if (cpfValue !== senhaValue) {
            document.getElementById("cpfSenhaError").textContent = "Os CPFs não correspondem!";
            formValido = false;
        }

        // Ativa ou desativa o botão de login
        btnLogin.disabled = !formValido;
    }

    cpfInput.addEventListener("input", verificarCampos);
    senhaInput.addEventListener("input", verificarCampos);

    btnLogin.addEventListener("click", function () {
        if (!btnLogin.disabled) {
            alert("Login bem-sucedido!");
            window.location.href = "/web/web.html"; // Redireciona para a página web
        }
    });
});

