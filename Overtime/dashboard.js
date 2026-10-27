// ==========================================
// OVERTIME - DASHBOARD
// ==========================================


// ==========================================
// PROCURAR SESSÃO
// ==========================================

const sessaoSalva =
    sessionStorage.getItem("overtimeSession") ||
    localStorage.getItem("overtimeSession");



// ==========================================
// SE NÃO ESTIVER LOGADO
// ==========================================

if (!sessaoSalva) {

    window.location.href =
        "login.html";

}



// ==========================================
// PEGAR DADOS DO USUÁRIO
// ==========================================

let usuario = null;


if (sessaoSalva) {

    usuario = JSON.parse(sessaoSalva);

}



// ==========================================
// VERIFICAR SE É ADMIN
// ==========================================

if (
    usuario &&
    usuario.role !== "ADMIN"
) {

    alert(
        "Você não possui permissão para acessar a Central de Gerenciamento."
    );


    window.location.href =
        "index.html";

}



// ==========================================
// MENSAGEM DE BOAS-VINDAS
// ==========================================

const bemVindo =
    document.getElementById("bem-vindo");


if (bemVindo && usuario) {

    bemVindo.textContent =
        "Bem-vindo, " + usuario.nome;

}



// ==========================================
// BOTÃO SAIR
// ==========================================

const botaoSair =
    document.getElementById("btn-sair");


if (botaoSair) {

    botaoSair.addEventListener(
        "click",
        function () {

            // Remove as sessões

            sessionStorage.removeItem(
                "overtimeSession"
            );

            localStorage.removeItem(
                "overtimeSession"
            );


            // Volta para o login

            window.location.href =
                "login.html";

        }
    );

}



// ==========================================
// CARDS DO DASHBOARD
// ==========================================

function abrir_clientes() {

    alert(
        "Gerenciamento de clientes será desenvolvido em breve."
    );

}


function abrir_funcionarios() {

    alert(
        "Gerenciamento de funcionários será desenvolvido em breve."
    );

}


function abrir_produtos() {

    window.location.href = "produtos-admin.html";

}


function abrir_relatorios() {

    alert(
        "Relatórios serão desenvolvidos em breve."
    );

}