// ==========================================
// OVERTIME - DETALHE DO PRODUTO
// ==========================================


// ==========================================
// PEGAR ID DA URL
// ==========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const produtoId =
    parametros.get("id");



// ==========================================
// PRODUTOS
// ==========================================

function pegarProdutos() {

    return JSON.parse(
        localStorage.getItem(
            "overtimeProdutos"
        )
    ) || [];

}



// ==========================================
// BUSCAR PRODUTO
// ==========================================

const produtos =
    pegarProdutos();


const produto =
    produtos.find(
        item =>
            String(item.id) ===
            String(produtoId)
    );



// ==========================================
// SE NÃO EXISTIR
// ==========================================

if (
    !produto ||
    produto.ativo !== true
) {

    alert(
        "Produto não encontrado."
    );


    window.location.href =
        "produtos.html";

}



// ==========================================
// ELEMENTOS
// ==========================================

const produtoImagem =
    document.getElementById(
        "produtoImagem"
    );

const produtoLiga =
    document.getElementById(
        "produtoLiga"
    );

const produtoNome =
    document.getElementById(
        "produtoNome"
    );

const produtoCategoria =
    document.getElementById(
        "produtoCategoria"
    );

const produtoPreco =
    document.getElementById(
        "produtoPreco"
    );

const produtoParcelamento =
    document.getElementById(
        "produtoParcelamento"
    );

const produtoDescricao =
    document.getElementById(
        "produtoDescricao"
    );

const produtoEstoque =
    document.getElementById(
        "produtoEstoque"
    );

const quantidadeInput =
    document.getElementById(
        "quantidade"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );



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
// MOSTRAR PRODUTO
// ==========================================

if (produto) {

    produtoImagem.src =
        produto.imagem ||
        "https://placehold.co/800x800?text=OVERTIME";


    produtoImagem.alt =
        produto.nome;


    produtoLiga.textContent =
        produto.liga;


    produtoNome.textContent =
        produto.nome;


    produtoCategoria.textContent =
        produto.categoria;


    produtoPreco.textContent =
        formatarPreco(
            produto.preco
        );


    const parcela =
        Number(produto.preco) / 6;


    produtoParcelamento.textContent =
        `ou 6x de ${formatarPreco(parcela)}`;


    produtoDescricao.textContent =
        produto.descricao ||
        "Produto OVERTIME.";


    produtoEstoque.textContent =
        `${produto.estoque} unidades`;


    quantidadeInput.max =
        produto.estoque;

}



// ==========================================
// QUANTIDADE
// ==========================================

document
    .getElementById(
        "aumentarQuantidade"
    )
    .addEventListener(
        "click",
        function () {

            const atual =
                Number(
                    quantidadeInput.value
                );


            if (
                atual <
                produto.estoque
            ) {

                quantidadeInput.value =
                    atual + 1;

            }

        }
    );


document
    .getElementById(
        "diminuirQuantidade"
    )
    .addEventListener(
        "click",
        function () {

            const atual =
                Number(
                    quantidadeInput.value
                );


            if (atual > 1) {

                quantidadeInput.value =
                    atual - 1;

            }

        }
    );



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


document
    .getElementById(
        "adicionarCarrinho"
    )
    .addEventListener(
        "click",
        function () {

            if (
                produto.estoque <= 0
            ) {

                alert(
                    "Produto sem estoque."
                );

                return;

            }


            const quantidade =
                Number(
                    quantidadeInput.value
                );


            const carrinho =
                pegarCarrinho();


            const item =
                carrinho.find(
                    item =>
                        String(item.id) ===
                        String(produto.id)
                );


            if (item) {

                item.quantidade +=
                    quantidade;

            }

            else {

                carrinho.push({

                    id:
                        produto.id,

                    nome:
                        produto.nome,

                    liga:
                        produto.liga,

                    preco:
                        produto.preco,

                    imagem:
                        produto.imagem,

                    quantidade:
                        quantidade

                });

            }


            salvarCarrinho(
                carrinho
            );


            atualizarCarrinho();


            alert(
                "Produto adicionado ao carrinho!"
            );

        }
    );



// ==========================================
// CONTADOR CARRINHO
// ==========================================

function atualizarCarrinho() {

    const carrinho =
        pegarCarrinho();


    const quantidade =
        carrinho.reduce(
            (total, item) =>
                total +
                Number(item.quantidade),
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

const btnFavoritar =
    document.getElementById(
        "favoritarProduto"
    );


function pegarFavoritos() {

    return JSON.parse(
        localStorage.getItem(
            "overtimeFavoritos"
        )
    ) || [];

}


function atualizarFavorito() {

    const favoritos =
        pegarFavoritos();


    const existe =
        favoritos.some(
            id =>
                String(id) ===
                String(produto.id)
        );


    const icone =
        btnFavoritar.querySelector(
            "i"
        );


    if (existe) {

        btnFavoritar.classList.add(
            "favoritado"
        );


        icone.className =
            "bi bi-heart-fill";

    }

    else {

        btnFavoritar.classList.remove(
            "favoritado"
        );


        icone.className =
            "bi bi-heart";

    }

}


btnFavoritar.addEventListener(
    "click",
    function () {

        let favoritos =
            pegarFavoritos();


        const existe =
            favoritos.some(
                id =>
                    String(id) ===
                    String(produto.id)
            );


        if (existe) {

            favoritos =
                favoritos.filter(
                    id =>
                        String(id) !==
                        String(produto.id)
                );

        }

        else {

            favoritos.push(
                produto.id
            );

        }


        localStorage.setItem(
            "overtimeFavoritos",
            JSON.stringify(
                favoritos
            )
        );


        atualizarFavorito();

    }
);



// ==========================================
// INICIAR
// ==========================================

atualizarCarrinho();

atualizarFavorito();