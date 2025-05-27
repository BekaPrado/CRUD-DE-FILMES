'use strict'
import {
    getFilmes, 
    postFilmes, 
    putFilmes, 
    deleteFilmes,
    getPaises, 
    getIdiomas, 
    getGeneros
} from "./filmes.js"

document.getElementById('container')
const inputPesquisa = document.getElementById('nome-filme')
const btnNovoFilme = document.getElementById('novo-filme')
const cadastroContainer = document.getElementById('cadastro-filme')
const formFilme = document.getElementById('form-filme')
const btnCancelar = document.getElementById('cancelar-cadastro')

const selectPais = document.getElementById('filme-pais')
const selectIdioma = document.getElementById('filme-idioma')
const selectGeneros = document.getElementById('filme-generos')

let filmeEditando = null

function criarCard(filme) {
    const card = document.createElement('div')
    card.classList.add('card-filme')

    const imagemUrl = filme.foto_capa?.trim() || 'https://via.placeholder.com/200x300?text=Sem+Imagem'
    const id = filme.id || filme.id_filme || filme.codigo

    card.innerHTML = `
        <img src="${imagemUrl}" alt="${filme.nome}" onerror="this.src='https://via.placeholder.com/200x300?text=Erro+na+Imagem'">
        <h2>${filme.nome}</h2>
        <div class="acoes">
            <button class="btn-editar" data-id="${id}">Editar</button>
            <button class="btn-excluir" data-id="${id}">Excluir</button>
        </div>
    `

    card.querySelector('.btn-editar').addEventListener('click', () => editarFilme(id))
    card.querySelector('.btn-excluir').addEventListener('click', () => excluirFilme(id))

    container.prepend(card)
}

async function carregarCards() {
    const resposta = await getFilmes()
    const lista = (resposta.filmes || resposta).reverse() // inverte a ordem
    container.replaceChildren()
    lista.forEach(criarCard)
}

async function preencherDropdowns() {
    const paisesData = await getPaises()
    const idiomasData = await getIdiomas()
    const generosData = await getGeneros()

    selectPais.innerHTML = '<option value="">Selecione o País</option>'
    paisesData.paises.forEach(p => {
        const opt = document.createElement('option')
        opt.value = p.id
        opt.textContent = p.nome
        selectPais.appendChild(opt)
    })

    selectIdioma.innerHTML = '<option value="">Selecione o Idioma</option>'
    idiomasData.idiomas.forEach(i => {
        const opt = document.createElement('option')
        opt.value = i.id
        opt.textContent = i.nome
        selectIdioma.appendChild(opt)
    })

    selectGeneros.innerHTML = ''
    generosData.films.forEach(g => {
        const opt = document.createElement('option')
        opt.value = g.id
        opt.textContent = g.nome
        selectGeneros.appendChild(opt)
    })
}

function mostrarFormulario() {
    container.style.display = 'none'
    cadastroContainer.style.display = 'block'
    formFilme.reset()
    filmeEditando = null
    preencherDropdowns()
}

function esconderFormulario() {
    container.style.display = 'flex'
    cadastroContainer.style.display = 'none'
}

async function salvarFilme(evento) {
    evento.preventDefault()

    const generosSelecionados = Array.from(selectGeneros.selectedOptions).map(opt => parseInt(opt.value))

    const filme = {
        nome: document.getElementById('filme-nome').value,
        duracao: document.getElementById('filme-duracao').value,
        sinopse: document.getElementById('filme-sinopse').value,
        data_lancamento: document.getElementById('filme-data').value,
        foto_capa: document.getElementById('filme-foto').value, // CAMPO CORRETO
        link_trailer: document.getElementById('filme-trailer').value,
        tbl_pais_id: parseInt(selectPais.value),
        tbl_idioma_id: parseInt(selectIdioma.value),
        generos: generosSelecionados
    }

    const sucesso = await postFilmes(filme)

    if (sucesso) {
        esconderFormulario()
        const resposta = await getFilmes()
        const lista = resposta.filmes || resposta
        const novoFilme = lista[lista.length - 1]
        if (novoFilme) criarCard(novoFilme)
    } else {
        alert('Erro ao salvar o filme. Tente novamente.')
    }
}

inputPesquisa.addEventListener('input', async (evento) => {
    const termo = evento.target.value.toLowerCase()
    const resposta = await getFilmes()
    const lista = resposta.filmes || resposta
    const resultado = lista.filter(filme =>
        filme.nome.toLowerCase().includes(termo)
    )
    container.replaceChildren()
    resultado.forEach(criarCard)
})


btnNovoFilme.addEventListener('click', mostrarFormulario)
btnCancelar.addEventListener('click', esconderFormulario)
formFilme.addEventListener('submit', salvarFilme)

carregarCards()
