import pkcs11js from "pkcs11js";
import * as dotenv from "dotenv";

dotenv.config();

const PUBLIC_KEY_TEMPLATE = [
  { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PUBLIC_KEY },
  { type: pkcs11js.CKA_TOKEN, value: false },
  { type: pkcs11js.CKA_LABEL, value: "rsa_public_key" },
  { type: pkcs11js.CKA_DERIVE, value: true },
  { type: pkcs11js.CKA_PUBLIC_EXPONENT, value: Buffer.from([1, 0, 1]) },
  { type: pkcs11js.CKA_MODULUS_BITS, value: 4096 },
  { type: pkcs11js.CKA_VERIFY, value: true },
];

const PRIVATE_KEY_TEMPLATE = [
  { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PRIVATE_KEY },
  { type: pkcs11js.CKA_TOKEN, value: false },
  { type: pkcs11js.CKA_LABEL, value: "rsa_private_key" },
  { type: pkcs11js.CKA_SIGN, value: true },
];

const pkcs11 = new pkcs11js.PKCS11();
pkcs11.load("/usr/local/lib/libdirakp11-64.so");

async function generate() {
  try {
    pkcs11.C_Initialize();

    const slot = pkcs11.C_GetSlotList(true)[0];

    const session = pkcs11.C_OpenSession(
      slot,
      pkcs11js.CKF_SERIAL_SESSION | pkcs11js.CKF_RW_SESSION
    );

    pkcs11.C_Login(session, 1, process.env.HSM_ADMIN_USER_PASS);

    pkcs11.C_GenerateKeyPair(
      session,
      { mechanism: pkcs11js.CKM_RSA_PKCS_KEY_PAIR_GEN },
      PUBLIC_KEY_TEMPLATE,
      PRIVATE_KEY_TEMPLATE
    );

    pkcs11.C_Logout(session);

    pkcs11.C_CloseSession(session);
  } catch (e) {
    console.error(e);
  } finally {
    pkcs11.C_Finalize();
  }
}

export { generate };
