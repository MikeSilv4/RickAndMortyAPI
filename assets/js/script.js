let telaDetalhes = true;
let pagina = 1;

    // Retorna a tela principal
function telaPrincipal () {

    resetaCampoDigitacao('Digite ID/NOME(Apos escolher a opreção)');

    const codMain = `
        <div class="corpoPersonagens"></div>
    `
    const main = document.getElementById('main'); 
    main.innerHTML = codMain; 

        // Chama funções complementares, botoes de navegação, renderizar personagens na tela principal e adiciona a função de trocar de tela
    botoesTelaPrincipal( main, codMain );
    renderizaPersonagens( pagina );
    tipoOperacao();
    
    telaDetalhes = false;

}

    
    // Botoes referentes a navegação entre as paginas dos personagens
async function botoesTelaPrincipal( main, codMain ) {

    const mostarOutrosPersonagens = document.querySelector ('.areaBotoesFuncionalidades');

    mostarOutrosPersonagens.innerHTML = `
    <br><br><br>
    <button id="restalrar">Restalrar</button>
    <button id="retornar"><</button><page id="page"></page><div class="separaBotoes"><button id="avancar">></button></div>
    `

    const retornar = document.getElementById('retornar');
    const atualizar = document.getElementById('avancar');
    const restalrar = document.getElementById('restalrar');

    atualizar.addEventListener('click', async function(){

        pagina += 1;

        if ( pagina > 42 ) {

            pagina = 1;
        }

        main.innerHTML = '';
        main.innerHTML = codMain;
        telaDetalhes = true;
        renderizaPersonagens( pagina );
    });

    retornar.addEventListener('click', async function(){

        pagina -= 1;

        if ( pagina < 1 ) {

            pagina = 42;
        }

        main.innerHTML = '';
        main.innerHTML = codMain;
        telaDetalhes = true;
        renderizaPersonagens( pagina );
    });

    restalrar.addEventListener('click', async function(){

        pagina = 1;
        main.innerHTML = codMain;
        telaDetalhes = true;
        renderizaPersonagens( pagina );
        
    });
}


    // Realiza a troca da tela incial para a tela de detalhes de personagens
async function telaPersonagemId ( tipoOperacao, valor ) {

    const main = document.getElementById ('main');

        // Limpa ta TAG main
    main.innerHTML = '';

        // Faz a requisição dos dados da API
    const dados = await buildDataPersonagem ( tipoOperacao, valor );
        
        const codMain = `
                <div class="personagemDetalhes">
                    <div class="personagemDetalhesIMG">
                        <img src="${ dados.image }" alt="" id="img">
                    </div>
                    <div class="personagemDados">
                        <h1>${ dados.name }</h1>
                        <titulos>Estado: <textos>${ dados.status }</textos></titulos><br>
                        <titulos>Genero: <textos>${ dados.gender }</textos></titulos><br>
                        <titulos>Especie: <textos>${ dados.species }</textos></titulos><br>
                        <titulos>Origem: <textos>${ dados.origin.name }</textos></titulos><br>
                    </div>
                    <div class="personagemDados2">
                        <titulos>Localização: <br><textos>${ dados.location.name }</textos></titulos><br>
                        <titulos>Episodios de Ocorrencia:</titulos>
                    </div>
                    <div class="personagemDados3"></div>
                </div>
        `

    main.innerHTML = codMain;

    const dadosPersonagem = document.querySelector('.personagemDados3')
    const array = dados.episode; 
    array.forEach(elemento => {

        dadosPersonagem.innerHTML += `
        <links>${elemento}</links><br>
        `

    });

        // Adiciona um botao para retorno a tela principal
    botaoVoltar();

}


    // Realiza a troca da tela incial para a tela de ocorrencias de personagens com o mesmo nome
async function telaPersonagemNome( tipoOperacao, valor ) {

    const ocorrencias = await buildDataPersonagem ( tipoOperacao, valor );


    if ( ocorrencias == 0 && tipoOperacao == 2 ) {

        return 0;

    }

    const main = document.getElementById ('main');

        // Limpa ta TAG main
    main.innerHTML = '';

    ocorrencias.forEach( ocorrencia => {

        main.innerHTML += `
        <div class="conteinerPersonagemNome">
            <img alt="" src="${ocorrencia.image}">
            <div class="personagemNomeDados">
                <h1>${ocorrencia.name}</h1>
                <titulos>ID: <textos>${ocorrencia.id}</textos></titulos><br>
                <titulos>Status: <textos>${ocorrencia.status}</textos></titulos><br>
            </div>
            <div class="personagemNomeDados2">
                <titulos>Localização: <br><textos>${ocorrencia.location.name}</textos></titulos><br>
            </div>
        </div>
        `
    })
        // Adiciona um botao para retorno a tela principal
    botaoVoltar();

}


    // Retorna a busca pelo nome ou ID
function tipoOperacao(){

        // Cria vinculo com o formulario da tela principal
    const formulario = document.getElementById('formulario');

        // Cria a geração de um avendo ao clicar no botao procurar
    formulario.addEventListener ('submit', async function(event){

        event.preventDefault();

            // Coleta os dados do formulario
        const textoErro = document.getElementById('campoTexto');
        const tipoOperacao = document.getElementById('tipoBusca').value;
        const valor = document.getElementById('campoTexto').value;

            // Por meio do tipoOperacao eu filtro a busca por nome ou id
        if (tipoOperacao == 1) {
  
            if ( ( isNaN( valor ) ) || ( valor < 1 || valor > 826 )) {

                const mensagem = 'Digite apenas IDs validos...';
                resetaCampoDigitacao(mensagem);
                return;

            } else {

                const mensagem = 'Digite ID/NOME';
                resetaCampoDigitacao(mensagem);
                telaPersonagemId( tipoOperacao, valor );

            }

        } else {

            if ( isNaN(valor) ) {

                const mensagem = 'Digite ID/NOME';
                resetaCampoDigitacao(mensagem);
                telaPersonagemNome( tipoOperacao, valor );

            } else {

                const mensagem = 'Digite apenas NOMEs validos...';
                resetaCampoDigitacao(mensagem);
                return;

            }
            

        }

        return;

    });
}


    // Retorna os dados de um unico personagem da API
async function buildDataPersonagem ( tipoOperacao, valor ) {

        let resultado = '';
        let resposta = '';

        if (tipoOperacao == 1) {

                // recebendo dados da api, a tranformando em .json e coletando os dados
            resultado = await fetch(`https://rickandmortyapi.com/api/character/${valor}`);
            return await resultado.json();

        } else {

            resultado = await fetch(`https://rickandmortyapi.com/api/character?name=${valor}`);
            
            if (resultado.status == 200) {

                const res = (await resultado.json()).results;
                return res;

            } else {

                 alert('Sem correspondencia...');
                
            }

        }
}


    // Retorna os dados de varios personagens da API
async function builDataPersonagens ( page ) {

    const resposta = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const personagens = await resposta.json();

    return personagens.results;

}


    //  Renderiza as imagens dos perosnagens na tela inicial
async function renderizaPersonagens( pagina ) {

    if (telaDetalhes) {

        const page = document.getElementById('page');
        const conteinerPersonagens = document.querySelector('.corpoPersonagens');

        page.innerHTML = `
            <pagina>${pagina}</pagina>
        `

        async function renderiza ({ personagens }) {

            personagens.forEach (( personagem ) => {

                return conteinerPersonagens.innerHTML += `
                <div class="personagem">
                    <img src="${personagem.image}" alt="" />
                    <div class="principalNome">${personagem.name}</div>
                </div>
                `;
            })

        }

        async function mostraPersonagens() {

            const personagens = await builDataPersonagens(pagina);

            renderiza({personagens});

        }

        mostraPersonagens();

    }
     
}


    // Adiciona um botao que tem a finalidade de "retornar a tela principal"
async function botaoVoltar () {

    const voltar = document.querySelector ('.areaBotoesFuncionalidades');

    voltar.innerHTML = `
    <button id="voltar">Voltar</button>
    `

    const botao = document.getElementById('voltar');

    botao.addEventListener('click', function(){

        voltar.innerHTML = '';
        telaDetalhes = true;
        telaPrincipal();

    });

}


    // Reseta os campos de digitação caso haja um erro na especificação do nome ou id
function resetaCampoDigitacao ( mensagem ) {

    const textoErro = document.getElementById('campoTexto');
    textoErro.value = '';
    textoErro.placeholder = mensagem;

}


telaPrincipal();
