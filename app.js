const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./movies.js')

const app = express()
app.disable('x-powered-by')

// Middleware
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    // Guardamos en una variables los posibles puertos desde los que podríamos abrir la página, para usarlos luego cuando queramos darles
    // acceso y evitar así el error de CORS
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

// Llamada HTTP
app.get('/', (req, res) => {
  res.end('Hola mundo')
})
app.get('/movies', (req, res) => {
  // En req.query se almacenan los diferentes parámetros que pasemos a la URL en la llamada HTTP vía "?"
  const { genre } = req.query
  //   Si hemos incluido el parámetro genre en la URL...
  if (genre) {
    const filteredMovies = movies.filter(
      // Evitamos ser case sensitive de la siguiente forma, que es como un include pero con condición
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  //   Si no hemos incluido genre como parámetro en la URL...
  res.json(movies)
})

// En la llamada de debajo tenemos que poner un parámetro en la URL, ya que el id puede cambiar
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  res.json(movies[id])
})

app.post('/movies', (req, res) => {
  // Validamos que el cuerpo de la request contiene los valores que queremos con los tipos correspondientes:
  // Esto no lo arregla TypeScript (no es que por usar TypeScript nos podamos olvidar de esto)
  const result = validateMovie(req.body)

  //   safeParse nos devuelve un 'resolve', así que tiene un parámetro error que existe en caso de que se haya producido un error
  if (result.error) {
    // 400: Bad request. También valdría 422: Unprocessable entity.
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    // Como ya hemos hecho la validación, podemos directamente crear una copia de los datos que venían en el cuerpo y meterlos en
    // el array de movies
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  // body validation
  const result = validatePartialMovie(req.body)

  // !result.success es lo mismo que result.error
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  // find the movie we want to update
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  // Entiendo que los argumentos del segundo JSON (result.data) machacan los que ya existieran en el primero,
  // de forma que no hay duplicados
  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  return res.json(movies[movieIndex])
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`Escuchando por el puerto http://localhost:${PORT}`)
})
