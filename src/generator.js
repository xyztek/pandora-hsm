import pkcs11js from 'pkcs11js'
import * as dotenv from 'dotenv'
import { execSync } from 'child_process'
dotenv.config()

const pkcs11 = new pkcs11js.PKCS11()
pkcs11.load('/usr/local/lib/libdirakp11-64.so')
pkcs11.C_Initialize()

async function generate () {
  const keySize = 4096
  try {
    const slot = pkcs11.C_GetSlotList(true)[0]
    const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_SERIAL_SESSION | pkcs11js.CKF_RW_SESSION)

    try {
      pkcs11.C_Login(session, 1, process.env.HSM_ADMIN_USER_PASS)
    } catch (error) {
      console.error(error)
    }
    const publicKeyTemplate = [
      { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PUBLIC_KEY },
      { type: pkcs11js.CKA_TOKEN, value: false },
      { type: pkcs11js.CKA_LABEL, value: 'rsa_public_key' },
      { type: pkcs11js.CKA_DERIVE, value: true },
      { type: pkcs11js.CKA_PUBLIC_EXPONENT, value: Buffer.from([1, 0, 1]) },
      { type: pkcs11js.CKA_MODULUS_BITS, value: keySize },
      { type: pkcs11js.CKA_VERIFY, value: true }
    ]

    const privateKeyTemplate = [
      { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PRIVATE_KEY },
      { type: pkcs11js.CKA_TOKEN, value: false },
      { type: pkcs11js.CKA_LABEL, value: 'rsa_private_key' },
      { type: pkcs11js.CKA_SIGN, value: true }
    ]
    console.log('Start key pair generation: %s', (new Date()).getTime())
    const keys = pkcs11.C_GenerateKeyPair(session, { mechanism: pkcs11js.CKM_RSA_PKCS_KEY_PAIR_GEN }, publicKeyTemplate, privateKeyTemplate)
    console.log('End key pair generation:   %s', (new Date()).getTime())
    console.log('Key pair generated', keys)

    const csr = execSync('bash csr.sh')
    return { keys, session, csr }
  } catch (e) {
    console.error(e)
  }
}

export { generate }
