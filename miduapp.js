import express, { json } from 'express' // require -> commonJS
import cors from 'cors'
import { moviesRouter } from './router/movies.js'

const app = express()
app.use(json())
app.use(cors({
  origin: (origin, callback) => {
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
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

// Todos los recursos que sean MOVIES se identifica con /movies. Actualmente nos traemos todo del archivo /router/movies.js
app.use('/movies', moviesRouter)

// Esta línea es importante en despliegues porque no sabemos el puerto al que se quiere conectar el hosting que realiza el despliegue, pero normalmente usará process.env para
// realizar la conexión. Si dejamos PORT = 1234, por ejemplo, obtendremos un error al intentar desplegar, ya que normalmente el hosting no usará ese puerto.
const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
