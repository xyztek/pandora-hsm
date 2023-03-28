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

    // Once keys created they stored unless any bad action.
    // They can be cleaned in this way.
    await crypto.keyStorage.clear()
    await crypto.certStorage.clear()

    const keys = await crypto.subtle.generateKey(alg, false, ['sign', 'verify'])

    const allKeys = await crypto.keyStorage.keys()
    for (const index of allKeys) {
      console.log('all keys', index)
    }

    return { alg, keys, crypto }
  } catch (error) {
    console.error(error)
  }
}

export { generateKeyPair }
