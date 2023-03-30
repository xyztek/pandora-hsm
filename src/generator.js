import { Crypto } from 'node-webcrypto-p11'

async function generateKeyPair (alg) {
  try {
    // Init Crypto provider
    const crypto = new Crypto({
      library: '/usr/local/lib/libdirakp11-64.so',
      name: 'TÜBİTAK NHSM',
      slot: 0,
      pin: '123456',
      readWrite: true
    })

    const keys = await crypto.subtle.generateKey(alg, false, ['sign', 'verify'])

    return { keys }
  } catch (error) {
    console.error(error)
  }
}

export { generateKeyPair }
