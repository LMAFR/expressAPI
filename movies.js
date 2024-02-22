import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5), // default nos pone un valor por defecto si no le pasamos este parámetro a la request
  poster: z.string().url(
    { message: 'Poster must be a valid URL' }
  ),
  genre: z.array(
    z.enum(['Action', 'Crime', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})

export function validateMovie (input) {
  return movieSchema.safeParse(input)
}

export function validatePartialMovie (input) {
  // partial hace que todas las propiedades del esquema sean opcionales, de modo que solo se validarán las propiedades
  // del esquema que hayamos pasado en el input, sin que devolver errores por el hecho de no estar todas.
  return movieSchema.partial().safeParse(input)
}
