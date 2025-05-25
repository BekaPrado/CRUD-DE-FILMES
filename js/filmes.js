"use strict"

const BASE_URL = "http://localhost:8080/v1/controle-filmes"

export async function getFilmes() {
    const response = await fetch(`${BASE_URL}/filme`)
    return response.json()
}

export async function postFilmes(filme) {
    const response = await fetch(`${BASE_URL}/filme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filme)
    })
    return response.ok
}

export async function putFilmes(filme, id) {
    const response = await fetch(`${BASE_URL}/filme/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filme)
    })
    return response.ok
}

export async function deleteFilmes(id) {
    const response = await fetch(`${BASE_URL}/filme/${id}`, { method: 'DELETE' })
    return response.ok
}

export async function getGeneros() {
    const response = await fetch(`${BASE_URL}/genero`)
    return response.json()
}


export async function getIdiomas() {
    const response = await fetch(`${BASE_URL}/idioma`)
    return response.json()
}

export async function getPaises() {
    const response = await fetch(`${BASE_URL}/pais`)
    return response.json()
}
