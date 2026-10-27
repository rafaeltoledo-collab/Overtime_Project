// =====================================================
// OVERTIME
// Carrinho e favoritos com localStorage
// =====================================================


// =====================================================
// 1. PEGANDO OS ELEMENTOS
// =====================================================

const cartCount = document.getElementById("cartCount");

const botoesCarrinho = document.querySelectorAll(".produto-carrinho");

const botoesFavoritos = document.querySelectorAll(".produto-favorito");



// =====================================================
// 2. FUNÇÃO PARA CRIAR UM ID PARA O PRODUTO
// =====================================================

// Exemplo:
// "Moletom OVERTIME Classic"
// vira:
// "moletom-overtime-classic"

function criarId(nome) {

    return nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}



// =====================================================
// 3. PEGAR CARRINHO SALVO
// =====================================================

function pegarCarrinho() {

    const carrinhoSalvo = localStorage.getItem("overtimeCart");


    // Se existir carrinho salvo
    if (carrinhoSalvo) {

        return JSON.parse(carrinhoSalvo);

    }


    // Caso ainda não exista
    return [];

}



// =====================================================
// 4. SALVAR CARRINHO
// =====================================================

function salvarCarrinho(carrinho) {

    localStorage.setItem(
        "overtimeCart",
        JSON.stringify(carrinho)
    );

}



// =====================================================
// 5. ATUALIZAR NÚMERO DO CARRINHO
// =====================================================

function atualizarContadorCarrinho() {

    const carrinho = pegarCarrinho();

    let quantidadeTotal = 0;


    carrinho.forEach(function (produto) {

        quantidadeTotal += produto.quantidade;

    });


    if (cartCount) {

        cartCount.textContent = quantidadeTotal;

    }

}



// =====================================================
// 6. DESCOBRIR OS DADOS DE UM PRODUTO
// =====================================================

function pegarDadosProduto(botao) {

    // Procura o card onde o botão foi clicado
    const card = botao.closest(".produto-card");


    const nome = card.querySelector(".produto-info h3").textContent.trim();

    const liga = card.querySelector(".produto-liga").textContent.trim();

    const precoTexto = card.querySelector(".produto-preco strong").textContent;

    const imagem = card.querySelector(".produto-imagem img").src;


    // Converte:
    // R$ 159,90
    // para:
    // 159.90

    const preco = Number(

        precoTexto
            .replace("R$", "")
            .replace(".", "")
            .replace(",", ".")
            .trim()

    );


    return {

        id: criarId(nome),

        nome: nome,

        liga: liga,

        preco: preco,

        imagem: imagem,

        quantidade: 1

    };

}



// =====================================================
// 7. ADICIONAR AO CARRINHO
// =====================================================

botoesCarrinho.forEach(function (botao) {

    botao.addEventListener("click", function () {


        // Pega os dados do produto clicado
        const produto = pegarDadosProduto(botao);


        // Pega o carrinho atual
        const carrinho = pegarCarrinho();


        // Procura se o produto já está no carrinho
        const produtoExistente = carrinho.find(function (item) {

            return item.id === produto.id;

        });



        // Se já existir
        if (produtoExistente) {

            produtoExistente.quantidade += 1;

        }

        // Se não existir
        else {

            carrinho.push(produto);

        }



        // Salva novamente
        salvarCarrinho(carrinho);


        // Atualiza o número no topo
        atualizarContadorCarrinho();


        // Pequeno feedback visual
        const icone = botao.querySelector("i");


        icone.classList.remove("bi-cart-plus");

        icone.classList.add("bi-check-lg");


        botao.classList.add("adicionado");


        // Depois volta ao normal
        setTimeout(function () {

            icone.classList.remove("bi-check-lg");

            icone.classList.add("bi-cart-plus");

            botao.classList.remove("adicionado");

        }, 1000);


    });

});



// =====================================================
// FAVORITOS
// =====================================================


// =====================================================
// 8. PEGAR FAVORITOS SALVOS
// =====================================================

function pegarFavoritos() {

    const favoritosSalvos = localStorage.getItem("overtimeFavoritos");


    if (favoritosSalvos) {

        return JSON.parse(favoritosSalvos);

    }


    return [];

}



// =====================================================
// 9. SALVAR FAVORITOS
// =====================================================

function salvarFavoritos(favoritos) {

    localStorage.setItem(
        "overtimeFavoritos",
        JSON.stringify(favoritos)
    );

}



// =====================================================
// 10. MOSTRAR FAVORITOS JÁ SALVOS
// =====================================================

function carregarFavoritos() {

    const favoritos = pegarFavoritos();


    botoesFavoritos.forEach(function (botao) {

        const produto = pegarDadosProduto(botao);


        const estaFavoritado = favoritos.some(function (item) {

            return item.id === produto.id;

        });


        if (estaFavoritado) {

            botao.classList.add("favoritado");


            const icone = botao.querySelector("i");

            icone.classList.remove("bi-heart");

            icone.classList.add("bi-heart-fill");

        }

    });

}



// =====================================================
// 11. FAVORITAR / DESFAVORITAR
// =====================================================

botoesFavoritos.forEach(function (botao) {

    botao.addEventListener("click", function () {


        const produto = pegarDadosProduto(botao);

        let favoritos = pegarFavoritos();


        const produtoExistente = favoritos.find(function (item) {

            return item.id === produto.id;

        });



        // Se já estiver favoritado
        if (produtoExistente) {

            favoritos = favoritos.filter(function (item) {

                return item.id !== produto.id;

            });


            botao.classList.remove("favoritado");


            const icone = botao.querySelector("i");

            icone.classList.remove("bi-heart-fill");

            icone.classList.add("bi-heart");

        }


        // Se ainda não estiver favoritado
        else {

            favoritos.push(produto);


            botao.classList.add("favoritado");


            const icone = botao.querySelector("i");

            icone.classList.remove("bi-heart");

            icone.classList.add("bi-heart-fill");

        }


        salvarFavoritos(favoritos);

    });

});



// =====================================================
// 12. QUANDO A PÁGINA ABRIR
// =====================================================

// Atualiza o número do carrinho
atualizarContadorCarrinho();


// Mostra os corações já favoritados
carregarFavoritos();