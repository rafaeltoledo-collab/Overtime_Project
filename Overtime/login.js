// ==========================================
// OVERTIME - LOGIN
// ==========================================


// Pegamos os elementos do HTML

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const senhaInput = document.getElementById("senha");

const rememberInput = document.getElementById("remember");

const termosInput = document.getElementById("termos");

const message = document.getElementById("message");



// ==========================================
// MOSTRAR / ESCONDER SENHA
// ==========================================

function showPassword() {

    const togglePassword =
        document.getElementById("togglePassword");


    if (senhaInput.type === "password") {

        senhaInput.type = "text";

        togglePassword.textContent = "🙈";

    } else {

        senhaInput.type = "password";

        togglePassword.textContent = "👀";

    }

}



// ==========================================
// USUÁRIO TEMPORÁRIO
// ==========================================

// Por enquanto estamos simulando um usuário.
// Depois isso virá da API e do banco de dados.

const adminTemporario = {

    nome: "Administrador",

    email: "admin@overtime.com",

    senha: "123456",

    role: "ADMIN"

};



// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", function (event) {

    // Impede o formulário de atualizar a página
    event.preventDefault();


    // Pegamos os valores digitados
    const email = emailInput.value.trim();

    const senha = senhaInput.value.trim();


    // Limpa mensagens anteriores
    limparMensagem();



    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (email === "" || senha === "") {

        mostrarErro(
            "Preencha seu e-mail e sua senha."
        );

        return;

    }


    if (!termosInput.checked) {

        mostrarErro(
            "Você precisa aceitar os termos."
        );

        return;

    }



    // ==========================================
    // VERIFICA LOGIN
    // ==========================================

    if (
        email === adminTemporario.email &&
        senha === adminTemporario.senha
    ) {

        const usuarioLogado = {

            nome: adminTemporario.nome,

            email: adminTemporario.email,

            role: adminTemporario.role

        };


        // ==========================================
        // LEMBRAR-ME
        // ==========================================

        if (rememberInput.checked) {

            // Fica salvo mesmo fechando o navegador

            localStorage.setItem(
                "overtimeSession",
                JSON.stringify(usuarioLogado)
            );


            localStorage.setItem(
                "overtimeRememberEmail",
                email
            );


            // Remove possível sessão temporária antiga

            sessionStorage.removeItem(
                "overtimeSession"
            );

        } else {

            // Fica salvo somente enquanto a aba/sessão existir

            sessionStorage.setItem(
                "overtimeSession",
                JSON.stringify(usuarioLogado)
            );


            localStorage.removeItem(
                "overtimeSession"
            );


            localStorage.removeItem(
                "overtimeRememberEmail"
            );

        }



        // ==========================================
        // ENTRA NO DASHBOARD
        // ==========================================

        window.location.href =
            "dashboard.html";


        return;

    }



    // Caso usuário ou senha estejam errados

    mostrarErro(
        "E-mail ou senha incorretos."
    );

});



// ==========================================
// MOSTRAR ERRO
// ==========================================

function mostrarErro(texto) {

    message.textContent = texto;

    message.style.color = "#d90416";

    message.style.marginTop = "15px";

}



// ==========================================
// LIMPAR MENSAGEM
// ==========================================

function limparMensagem() {

    message.textContent = "";

}



// ==========================================
// LEMBRAR E-MAIL
// ==========================================

const emailSalvo =
    localStorage.getItem("overtimeRememberEmail");


if (emailSalvo) {

    emailInput.value = emailSalvo;

    rememberInput.checked = true;

}