// import movies from './movies.json' // Esto no funciona en ESModules
import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'

// Cómo leer JSON en ESModules
// 1) Usando FS
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
// 2) Recomendado. Creando la función require (ver utils.js)
const movies = readJSON('./movies.json')

export class MovieModel {
  // Le hemos metido el async para mantener la generalidad comentada en /router/movies.js. Ahora la función getAll devuelve una promesa.
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  //   Aprovechamos para escribir lo del async de otra forma:
  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create ({ input }) {
    // en base de datos
    const newMovie = {
      id: randomUUID(),
      ...input
    }

    // Esto no sería REST, porque estamos guardando
    // el estado de la aplicación en memoria
    movies.push(newMovie)

    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    } else {
      movies.splice(movieIndex, 1)
      return true
    }
  }

  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return { message: 'Movie not found' }
    } else {
      const updateMovie = {
        ...movies[movieIndex],
        ...input
      }

      movies[movieIndex] = updateMovie

      return movies[movieIndex]
    }
  }
}
