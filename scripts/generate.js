import { execSync } from "child_process";

import { generate } from "./generator.js";

(async function () {
  await generate();

  execSync(
    "sudo openssl req -nodes -new -days 365 -sha256 -config engine.conf -engine pkcs11 -keyform engine -key slot_81 -out pandora.csr"
  );
})();
