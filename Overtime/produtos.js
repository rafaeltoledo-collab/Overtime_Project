// ==========================================
// OVERTIME - CATÁLOGO DE PRODUTOS
// ==========================================


// ELEMENTOS

const listaProdutosLoja =
    document.getElementById(
        "listaProdutosLoja"
    );

const buscaProdutos =
    document.getElementById(
        "buscaProdutos"
    );

const filtroLiga =
    document.getElementById(
        "filtroLiga"
    );

const filtroCategoria =
    document.getElementById(
        "filtroCategoria"
    );

const ordenacao =
    document.getElementById(
        "ordenacao"
    );

const quantidadeProdutos =
    document.getElementById(
        "quantidadeProdutos"
    );

const nenhumProduto =
    document.getElementById(
        "nenhumProduto"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );



// ==========================================
// PEGAR PRODUTOS
// ==========================================

function pegarProdutos() {

    return JSON.parse(
        localStorage.getItem(
            "overtimeProdutos"
        )
    ) || [];

}



// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



// ==========================================
// TAG
// ==========================================

function criarTag(produto) {

    if (produto.exclusivo) {

        return `
            <span class="produto-tag exclusivo">
                EXCLUSIVO
            </span>
        `;

    }


    if (produto.novo) {

        return `
            <span class="produto-tag">
                NOVO
            </span>
        `;

    }


    if (produto.destaque) {

        return `
            <span class="produto-tag destaque">
                DESTAQUE
            </span>
        `;

    }


    return "";

}



// ==========================================
// CRIAR CARD
// ==========================================

function criarCard(produto) {

    const imagem =
        produto.imagem ||
        "https://placehold.co/600x600?text=OVERTIME";


    const parcela =
        Number(produto.preco) / 6;


    return `

        <article
            class="produto-card"
            data-id="${produto.id}"
        >

            <div class="produto-imagem">

                ${criarTag(produto)}


                <button
                    class="produto-favorito"
                    type="button"
                    onclick="favoritarProduto('${produto.id}')"
                >
                    <i class="bi bi-heart"></i>
                </button>


                <a
                    href="produto.html?id=${produto.id}"
                    class="produto-link-imagem"
                >

                    <img
                        src="${imagem}"
                        alt="${produto.nome}"
                    >

                </a>

            </div>



            <div class="produto-info">

                <a
                    href="produto.html?id=${produto.id}"
                    class="produto-link-info"
                >

                    <span class="produto-liga">
                        ${produto.liga}
                    </span>

                    <h3>
                        ${produto.nome}
                    </h3>

                </a>


                <div class="produto-preco">

                    <div>

                        <strong>
                            ${formatarPreco(
                                produto.preco
                            )}
                        </strong>


                        <span>

                            ou 6x de

                            ${formatarPreco(
                                parcela
                            )}

                        </span>

                    </div>


                    <button
                        class="produto-carrinho"
                        type="button"
                        onclick="adicionarCarrinho('${produto.id}')"
                    >

                        <i class="bi bi-cart-plus"></i>

                    </button>

                </div>

            </div>

        </article>

    `;


}



// ==========================================
// FILTRAR
// ==========================================

function mostrarProdutos() {

    let produtos =
        pegarProdutos();


    // Somente ativos

    produtos =
        produtos.filter(
            produto =>
                produto.ativo === true
        );



    // BUSCA

    const busca =
        buscaProdutos.value
            .toLowerCase()
            .trim();


    if (busca !== "") {

        produtos =
            produtos.filter(
                produto =>

                    produto.nome
                        .toLowerCase()
                        .includes(busca)

                    ||

                    produto.liga
                        .toLowerCase()
                        .includes(busca)

                    ||

                    produto.categoria
                        .toLowerCase()
                        .includes(busca)

            );

    }



    // LIGA

    if (filtroLiga.value !== "") {

        produtos =
            produtos.filter(
                produto =>
                    produto.liga ===
                    filtroLiga.value
            );

    }



    // CATEGORIA

    if (
        filtroCategoria.value !== ""
    ) {

        produtos =
            produtos.filter(
                produto =>
                    produto.categoria ===
                    filtroCategoria.value
            );

    }



    // ======================================
    // ORDENAÇÃO
    // ======================================

    if (
        ordenacao.value ===
        "menor-preco"
    ) {

        produtos.sort(
            (a, b) =>
                a.preco - b.preco
        );

    }


    else if (
        ordenacao.value ===
        "maior-preco"
    ) {

        produtos.sort(
            (a, b) =>
                b.preco - a.preco
        );

    }


    else if (
        ordenacao.value ===
        "nome"
    ) {

        produtos.sort(
            (a, b) =>
                a.nome.localeCompare(
                    b.nome
                )
        );

    }


    else {

        produtos.sort(
            (a, b) =>
                Number(b.id) -
                Number(a.id)
        );

    }



    // ======================================
    // MOSTRAR
    // ======================================

    listaProdutosLoja.innerHTML =
        "";


    produtos.forEach(
        produto => {

            listaProdutosLoja.innerHTML +=
                criarCard(produto);

        }
    );



    quantidadeProdutos.textContent =
        `${produtos.length} ${
            produtos.length === 1
                ? "produto"
                : "produtos"
        }`;



    if (produtos.length === 0) {

        nenhumProduto.style.display =
            "flex";

    } else {

        nenhumProduto.style.display =
            "none";

    }


    atualizarFavoritosVisuais();

}



// ==========================================
// CARRINHO
// ==========================================

function pegarCarrinho() {

    return JSON.parse(
        localStorage.getItem(
            "overtimeCart"
        )
    ) || [];

}


function salvarCarrinho(carrinho) {

    localStorage.setItem(
        "overtimeCart",
        JSON.stringify(carrinho)
    );

}


function adicionarCarrinho(id) {

    const produtos =
        pegarProdutos();


    const produto =
        produtos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!produto) {

        return;

    }


    const carrinho =
        pegarCarrinho();


    const existente =
        carrinho.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (existente) {

        existente.quantidade++;

    }

    else {

        carrinho.push({

            id: produto.id,

            nome: produto.nome,

            liga: produto.liga,

            preco: produto.preco,

            imagem: produto.imagem,

            quantidade: 1

        });

    }


    salvarCarrinho(carrinho);


    atualizarCarrinho();

}



// ==========================================
// CONTADOR
// ==========================================

function atualizarCarrinho() {

    const carrinho =
        pegarCarrinho();


    const quantidade =
        carrinho.reduce(
            (total, item) =>
                total +
                item.quantidade,
            0
        );


    if (cartCount) {

        cartCount.textContent =
            quantidade;

    }

}



// ==========================================
// FAVORITOS
// ==========================================

function pegarFavoritos() {

    return JSON.parse(
        localStorage.getItem(
            "overtimeFavoritos"
        )
    ) || [];

}


function favoritarProduto(id) {

    let favoritos =
        pegarFavoritos();


    const existe =
        favoritos.some(
            item =>
                String(item) ===
                String(id)
        );


    if (existe) {

        favoritos =
            favoritos.filter(
                item =>
                    String(item) !==
                    String(id)
            );

    }

    else {

        favoritos.push(id);

    }


    localStorage.setItem(
        "overtimeFavoritos",
        JSON.stringify(favoritos)
    );


    atualizarFavoritosVisuais();

}



// ==========================================
// CORAÇÕES
// ==========================================

function atualizarFavoritosVisuais() {

    const favoritos =
        pegarFavoritos();


    const cards =
        document.querySelectorAll(
            ".produto-card"
        );


    cards.forEach(
        card => {

            const id =
                card.dataset.id;


            const botao =
                card.querySelector(
                    ".produto-favorito"
                );


            const icone =
                botao.querySelector("i");


            const favoritado =
                favoritos.some(
                    item =>
                        String(item) ===
                        String(id)
                );


            if (favoritado) {

                botao.classList.add(
                    "favoritado"
                );

                icone.className =
                    "bi bi-heart-fill";

            }

            else {

                botao.classList.remove(
                    "favoritado"
                );

                icone.className =
                    "bi bi-heart";

            }

        }
    );

}



// ==========================================
// EVENTOS DOS FILTROS
// ==========================================

buscaProdutos.addEventListener(
    "input",
    mostrarProdutos
);


filtroLiga.addEventListener(
    "change",
    mostrarProdutos
);


filtroCategoria.addEventListener(
    "change",
    mostrarProdutos
);


ordenacao.addEventListener(
    "change",
    mostrarProdutos
);



// ==========================================
// INICIAR
// ==========================================

mostrarProdutos();

atualizarCarrinho();