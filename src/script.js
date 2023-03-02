import { sign } from './signer.js'
import { generate } from './generator.js'

const generator = await generate()

const data = 'Data to be signed'
sign(generator, data)
