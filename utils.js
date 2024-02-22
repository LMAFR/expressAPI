import { createRequire } from 'node:module'
// import.meta.url contiene la ruta que queremos leer en cada caso
const require = createRequire(import.meta.url)
export const readJSON = (path) => require(path)
