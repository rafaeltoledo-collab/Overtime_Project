// ==========================================
// OVERTIME - PRODUTOS DA HOME
// ==========================================


// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

// Procura primeiro pelo ID e depois pela classe.
// Isso evita problemas se o HTML usar apenas a classe.

const gradeProdutos =
    document.getElementById("gradeProdutos") ||
    document.querySelector(".grade-produtos");


// ==========================================
// BUSCAR PRODUTOS CADASTRADOS
// ==========================================

function pegarProdutosHome() {

    try {

        const dados =
            localStorage.getItem("overtimeProdutos");

        // Se não houver produtos cadastrados, retorna uma lista vazia.

        if (!dados) {
            return [];
        }

        const produtos = JSON.parse(dados);

        // Confere se os dados realmente são uma lista.

        if (!Array.isArray(produtos)) {
            console.error("Os produtos salvos não estão em formato de lista.");
            return [];
        }

        return produtos;

    } catch (erro) {

        console.error("Erro ao carregar os produtos:", erro);

        return [];

    }

}


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPrecoHome(valor) {

    const preco = Number(valor);

    if (!Number.isFinite(preco) || preco < 0) {
        return "Preço indisponível";
    }

    return preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ==========================================
// CALCULAR PARCELAS
// ==========================================

function calcularParcelaHome(preco) {

    const valor = Number(preco);

    if (!Number.isFinite(valor) || valor < 0) {
        return null;
    }

    const parcelas = 6;

    return {
        parcelas: parcelas,
        valor: (valor / parcelas).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    };

}


// ==========================================
// PROTEGER TEXTOS INSERIDOS NO HTML
// ==========================================

function escaparTextoHome(texto) {

    return String(texto ?? "").replace(/[&<>"']/g, function (caractere) {

        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caractere];

    });

}


// ==========================================
// CRIAR TAG DO PRODUTO
// ==========================================

function criarTagProdutoHome(produto) {

    if (produto.exclusivo === true || produto.exclusivo === "true") {

        return `
            <span class="produto-tag exclusivo">
                EXCLUSIVO
            </span>
        `;

    }

    if (produto.destaque === true || produto.destaque === "true") {

        return `
            <span class="produto-tag destaque">
                DESTAQUE
            </span>
        `;

    }

    if (produto.novo === true || produto.novo === "true") {

        return `
            <span class="produto-tag">
                NOVO
            </span>
        `;

    }

    return "";

}


// ==========================================
// CRIAR CARD DO PRODUTO
// ==========================================

function criarCardProdutoHome(produto) {

    const nome = escaparTextoHome(produto.nome || "Produto OVERTIME");

    const liga = escaparTextoHome(
        produto.liga || produto.categoria || "OVERTIME"
    );

    const preco = formatarPrecoHome(produto.preco);

    const parcela = calcularParcelaHome(produto.preco);

    const imagem = escaparTextoHome(
        produto.imagem || "https://placehold.co/600x600?text=OVERTIME"
    );

    const id = escaparTextoHome(produto.id || "");

    const tag = criarTagProdutoHome(produto);

    // Mostra as parcelas somente se o preço for válido.

    const textoParcela = parcela
        ? `ou ${parcela.parcelas}x de R$ ${parcela.valor}`
        : "Consulte o preço";

    return `

        <article
            class="produto-card"
            data-produto-id="${id}"
        >

            <div class="produto-imagem">

                ${tag}

                <button
                    class="produto-favorito"
                    type="button"
                    aria-label="Adicionar aos favoritos"
                >
                    <i class="bi bi-heart"></i>
                </button>

                <img
                    src="${imagem}"
                    alt="${nome}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x600?text=Imagem+indisponivel';"
                >

            </div>

            <div class="produto-info">

                <span class="produto-liga">
                    ${liga}
                </span>

                <h3>
                    ${nome}
                </h3>

                <div class="produto-preco">

                    <div>

                        <strong>
                            ${preco}
                        </strong>

                        <span>
                            ${textoParcela}
                        </span>

                    </div>

                    <button
                        class="produto-carrinho"
                        type="button"
                        aria-label="Adicionar ao carrinho"
                    >
                        <i class="bi bi-cart-plus"></i>
                    </button>

                </div>

            </div>

        </article>

    `;

}


// ==========================================
// MOSTRAR MENSAGEM QUANDO NÃO HOUVER PRODUTOS
// ==========================================

function mostrarMensagemSemProdutosHome() {

    gradeProdutos.innerHTML = `

        <div class="sem-destaques-home">

            <i class="bi bi-bag"></i>

            <h3>
                Novidades chegando
            </h3>

            <p>
                Em breve teremos novos produtos
                em destaque.
            </p>

        </div>

    `;

}


// ==========================================
// CARREGAR PRODUTOS NA VITRINE
// ==========================================

function mostrarProdutosHome() {

    // Confere se o HTML possui a área da vitrine.

    if (!gradeProdutos) {

        console.error(
            'Vitrine não encontrada. Verifique o elemento com id="gradeProdutos" no index.html.'
        );

        return;

    }

    // Busca todos os produtos cadastrados no painel.

    const produtos = pegarProdutosHome();


    // Mostra somente produtos ativos e marcados como destaque.

    const produtosDestaque = produtos.filter(function (produto) {

        const ativo =
            produto.ativo === true ||
            produto.ativo === "true";

        const destaque =
            produto.destaque === true ||
            produto.destaque === "true";

        return ativo && destaque;

    });


    // Limpa os cards anteriores para evitar duplicações.

    gradeProdutos.innerHTML = "";


    // Se não houver produtos em destaque, mostra uma mensagem.

    if (produtosDestaque.length === 0) {

        mostrarMensagemSemProdutosHome();

        return;

    }


    // Exibe no máximo seis produtos na página inicial.

    const produtosHome = produtosDestaque.slice(0, 6);


    // Cria os cards dos produtos.

    gradeProdutos.innerHTML = produtosHome
        .map(function (produto) {

            return criarCardProdutoHome(produto);

        })
        .join("");

}


// ==========================================
// INICIAR A VITRINE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    mostrarProdutosHome();

});


// ==========================================
// ATUALIZAR QUANDO O USUÁRIO VOLTAR À ABA
// ==========================================

window.addEventListener("pageshow", function () {

    mostrarProdutosHome();

});