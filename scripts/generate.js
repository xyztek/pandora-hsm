import { generateKeyPair } from '../src/generator.js'
import { generateCSR } from '../src/csr.js'
import { sign } from '../src/signer.js'

// Definealgorithm
const alg = {
  name: 'RSASSA-PKCS1-v1_5',
  hash: 'SHA-256',
  publicExponent: new Uint8Array([1, 0, 1]),
  modulusLength: 2048,
  token: true,
  sensitive: true
}

const { keys } = await generateKeyPair(alg)
console.warn('privKey', keys.privateKey)

await generateCSR(alg, keys)

await sign(alg, keys, 'data_to_be_signed')
