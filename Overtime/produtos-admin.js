// ==========================================
// OVERTIME - GERENCIAMENTO DE PRODUTOS
// ==========================================


// ==========================================
// PROTEGER PÁGINA
// ==========================================

const sessao =
    sessionStorage.getItem("overtimeSession") ||
    localStorage.getItem("overtimeSession");


if (!sessao) {

    window.location.href = "login.html";

}


const usuario = sessao
    ? JSON.parse(sessao)
    : null;


if (
    usuario &&
    usuario.role !== "ADMIN"
) {

    window.location.href = "index.html";

}



// ==========================================
// ELEMENTOS
// ==========================================

const modalProduto =
    document.getElementById("modalProduto");

const btnNovoProduto =
    document.getElementById("btnNovoProduto");

const fecharModal =
    document.getElementById("fecharModal");

const cancelarProduto =
    document.getElementById("cancelarProduto");

const produtoForm =
    document.getElementById("produtoForm");

const listaProdutos =
    document.getElementById("listaProdutos");

const semProdutos =
    document.getElementById("semProdutos");

const pesquisaProduto =
    document.getElementById("pesquisaProduto");

const filtroLiga =
    document.getElementById("filtroLiga");



// ==========================================
// CAMPOS
// ==========================================

const produtoId =
    document.getElementById("produtoId");

const nomeProduto =
    document.getElementById("nomeProduto");

const ligaProduto =
    document.getElementById("ligaProduto");

const categoriaProduto =
    document.getElementById("categoriaProduto");

const precoProduto =
    document.getElementById("precoProduto");

const estoqueProduto =
    document.getElementById("estoqueProduto");

const imagemProduto =
    document.getElementById("imagemProduto");

const descricaoProduto =
    document.getElementById("descricaoProduto");

const statusProduto =
    document.getElementById("statusProduto");

const produtoNovo =
    document.getElementById("produtoNovo");

const produtoDestaque =
    document.getElementById("produtoDestaque");

const produtoExclusivo =
    document.getElementById("produtoExclusivo");



// ==========================================
// LOCAL STORAGE
// ==========================================

function pegarProdutos() {

    return JSON.parse(
        localStorage.getItem("overtimeProdutos")
    ) || [];

}


function salvarProdutos(produtos) {

    localStorage.setItem(
        "overtimeProdutos",
        JSON.stringify(produtos)
    );

}



// ==========================================
// ABRIR MODAL
// ==========================================

btnNovoProduto.addEventListener(
    "click",
    function () {

        produtoForm.reset();

        produtoId.value = "";


        document.getElementById(
            "tituloModal"
        ).textContent = "Novo produto";


        modalProduto.classList.add(
            "ativo"
        );

    }
);



// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModalProduto() {

    modalProduto.classList.remove(
        "ativo"
    );

}


fecharModal.addEventListener(
    "click",
    fecharModalProduto
);


cancelarProduto.addEventListener(
    "click",
    fecharModalProduto
);



// ==========================================
// SALVAR PRODUTO
// ==========================================

produtoForm.addEventListener(
    "submit",
    function (event) {

        // Impede o formulário de recarregar
        event.preventDefault();


        // Pega os produtos já salvos
        const produtos =
            pegarProdutos();


        // Cria o objeto do produto
        const produto = {

            id:
                produtoId.value ||
                Date.now(),

            nome:
                nomeProduto.value.trim(),

            liga:
                ligaProduto.value,

            categoria:
                categoriaProduto.value,

            preco:
                Number(
                    precoProduto.value
                ),

            estoque:
                Number(
                    estoqueProduto.value
                ),

            imagem:
                imagemProduto.value.trim(),

            descricao:
                descricaoProduto.value.trim(),

            ativo:
                statusProduto.value === "true",

            novo:
                produtoNovo.checked,

            destaque:
                produtoDestaque.checked,

            exclusivo:
                produtoExclusivo.checked

        };



        // ======================================
        // EDITAR PRODUTO
        // ======================================

        if (produtoId.value) {

            const indice =
                produtos.findIndex(
                    item =>
                        String(item.id) ===
                        String(produto.id)
                );


            if (indice !== -1) {

                produtos[indice] =
                    produto;

            }

        }


        // ======================================
        // NOVO PRODUTO
        // ======================================

        else {

            produtos.push(produto);

        }



        // Salva
        salvarProdutos(produtos);


        // Fecha modal
        fecharModalProduto();


        // Atualiza tabela
        mostrarProdutos();

    }
);



// ==========================================
// MOSTRAR PRODUTOS
// ==========================================

function mostrarProdutos() {

    const produtos =
        pegarProdutos();


    const pesquisa =
        pesquisaProduto.value
            .toLowerCase()
            .trim();


    const ligaSelecionada =
        filtroLiga.value;



    const filtrados =
        produtos.filter(
            function (produto) {

                const nomeCombina =
                    produto.nome
                        .toLowerCase()
                        .includes(
                            pesquisa
                        );


                const ligaCombina =
                    ligaSelecionada === "" ||
                    produto.liga ===
                    ligaSelecionada;


                return (
                    nomeCombina &&
                    ligaCombina
                );

            }
        );



    listaProdutos.innerHTML = "";



    if (filtrados.length === 0) {

        semProdutos.style.display =
            "block";

    } else {

        semProdutos.style.display =
            "none";

    }



    filtrados.forEach(
        function (produto) {

            const linha =
                document.createElement(
                    "tr"
                );


            const imagem =
                produto.imagem ||
                "https://placehold.co/100x100?text=OVERTIME";


            linha.innerHTML = `

                <td>

                    <div class="produto-tabela">

                        <img
                            src="${imagem}"
                            alt="${produto.nome}"
                        >

                        <strong>
                            ${produto.nome}
                        </strong>

                    </div>

                </td>


                <td>
                    ${produto.liga}
                </td>


                <td>
                    ${produto.categoria}
                </td>


                <td>
                    ${formatarPreco(
                        produto.preco
                    )}
                </td>


                <td>
                    ${produto.estoque}
                </td>


                <td>

                    <span class="
                        status
                        ${
                            produto.ativo
                                ? "ativo"
                                : "inativo"
                        }
                    ">

                        ${
                            produto.ativo
                                ? "ATIVO"
                                : "INATIVO"
                        }

                    </span>

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-acao"
                            onclick="editarProduto('${produto.id}')"
                            title="Editar"
                        >
                            ✏️
                        </button>


                        <button
                            class="btn-acao"
                            onclick="excluirProduto('${produto.id}')"
                            title="Excluir"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            listaProdutos.appendChild(
                linha
            );

        }
    );


    atualizarResumo();

}



// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



// ==========================================
// EDITAR PRODUTO
// ==========================================

function editarProduto(id) {

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



    produtoId.value =
        produto.id;

    nomeProduto.value =
        produto.nome;

    ligaProduto.value =
        produto.liga;

    categoriaProduto.value =
        produto.categoria;

    precoProduto.value =
        produto.preco;

    estoqueProduto.value =
        produto.estoque;

    imagemProduto.value =
        produto.imagem || "";

    descricaoProduto.value =
        produto.descricao || "";

    statusProduto.value =
        String(produto.ativo);


    produtoNovo.checked =
        produto.novo === true;


    produtoDestaque.checked =
        produto.destaque === true;


    produtoExclusivo.checked =
        produto.exclusivo === true;



    document.getElementById(
        "tituloModal"
    ).textContent =
        "Editar produto";


    modalProduto.classList.add(
        "ativo"
    );

}



// ==========================================
// EXCLUIR PRODUTO
// ==========================================

function excluirProduto(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este produto?"
        );


    if (!confirmar) {

        return;

    }


    let produtos =
        pegarProdutos();


    produtos =
        produtos.filter(
            produto =>
                String(produto.id) !==
                String(id)
        );


    salvarProdutos(produtos);


    mostrarProdutos();

}



// ==========================================
// RESUMO
// ==========================================

function atualizarResumo() {

    const produtos =
        pegarProdutos();


    document.getElementById(
        "totalProdutos"
    ).textContent =
        produtos.length;


    const ativos =
        produtos.filter(
            produto =>
                produto.ativo
        );


    document.getElementById(
        "produtosAtivos"
    ).textContent =
        ativos.length;


    const estoque =
        produtos.reduce(
            function (total, produto) {

                return (
                    total +
                    Number(produto.estoque)
                );

            },
            0
        );


    document.getElementById(
        "estoqueTotal"
    ).textContent =
        estoque;

}



// ==========================================
// PESQUISA
// ==========================================

pesquisaProduto.addEventListener(
    "input",
    mostrarProdutos
);



// ==========================================
// FILTRO POR LIGA
// ==========================================

filtroLiga.addEventListener(
    "change",
    mostrarProdutos
);



// ==========================================
// SAIR
// ==========================================

document
    .getElementById("btn-sair")
    .addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "overtimeSession"
            );

            localStorage.removeItem(
                "overtimeSession"
            );


            window.location.href =
                "login.html";

        }
    );



// ==========================================
// INICIAR
// ==========================================

mostrarProdutos();