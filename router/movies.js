import { Router } from 'express'
import { validateMovie, validatePartialMovie } from '../movies.js'
import { MovieModel } from '../models/movie.js'

export const moviesRouter = Router()

// En este caso se toma como referencia el puerto + /movies (esta lógica la metemos en el miduapp.js), por lo que solo pondremos
// lo que iría tras el /movies en las URLs de las llamadas que pongamos aquí
// El async/await lo hemos metido después de incluir la lógica del género mediante MovieModel porque si no lo hacíamos así estaríamos
// diciendo que los datos que van a llegar siempre serían síncronos y eso no lo sabemos si pensamos en que la función sea lo más general
// posible (es para generalizar más)
moviesRouter.get('/', async (req, res) => {
  // Se recomienda hacer un try/catch, pero para no hacerlo en cada llamada por separado, más adelante lo meteremos en un middleware para que afecte a todo.
  const { genre } = req.query
  const movies = await MovieModel.getAll({ genre })
  res.json(movies)
})

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const movie = await MovieModel.getById({ id })
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

moviesRouter.post('/', async (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = await MovieModel.create(result.data)

  res.status(201).json(newMovie)
})

moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const success = await MovieModel.delete({ id })

  if (!success) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  return res.json({ message: 'Movie deleted' })
})

moviesRouter.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params

  const updateMovie = MovieModel.update(id, result.data)

  return res.json(updateMovie)
})
