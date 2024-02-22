import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

// En este caso se toma como referencia el puerto + /movies (esta lógica la metemos en el miduapp.js), por lo que solo pondremos
// lo que iría tras el /movies en las URLs de las llamadas que pongamos aquí
moviesRouter.get('/', MovieController.getAll)
moviesRouter.get('/:id', MovieController.getById)
moviesRouter.post('/', MovieController.create)
moviesRouter.delete('/:id', MovieController.delete)
moviesRouter.patch('/:id', MovieController.update)
