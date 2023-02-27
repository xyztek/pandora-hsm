var pkcs11js = require("pkcs11js");
require('dotenv').config();
var pkcs11 = new pkcs11js.PKCS11();
pkcs11.load("/usr/local/lib/libdirakp11-64.so");

const a = pkcs11.C_Initialize();
try {
    // Getting info about PKCS11 Module
    var module_info = pkcs11.C_GetInfo();
    console.warn('module_info', module_info)


    // Getting list of slots
    var slots = pkcs11.C_GetSlotList(true);
    console.warn('slots: ', slot_81)
    var slot_81 = slots[0];
    console.warn('slot81: ', slot_81)

    // Getting info about Mechanism
    var mechs = pkcs11.C_GetMechanismList(slot_81);
    var mech_info = pkcs11.C_GetMechanismInfo(slot_81, mechs[0]);
    console.warn('mech_info', mech_info);

    var session = pkcs11.C_OpenSession(slot_81, pkcs11js.CKF_SERIAL_SESSION | pkcs11js.CKF_RW_SESSION);
    console.warn('session', session.toString());

    try {
        const x = pkcs11.C_Login(session, 0, "123456");
        // HSM’de iki tip kullanıcı tanımlıdır bunlar Kullanıcı ve Yönetici ‘dir
        console.warn('**', x)
    } catch (error) {
        console.warn('***', error)
    }

    // // Getting info about slot 81
    // var slot_info = pkcs11.C_GetSlotInfo(slot_81);
    // console.warn('slot_info', slot_info)

    // // Getting info about token
    // var token_info = pkcs11.C_GetTokenInfo(slot_81);
    // console.warn('token_info', token_info)

    // Getting info about Session
    var info = pkcs11.C_GetSessionInfo(session);
    console.warn('session_info', info);

    /**
     * Your app code here
     */
    // // Generating key pair using AES mechanism
    var template = [
        { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_SECRET_KEY },
        { type: pkcs11js.CKA_TOKEN, value: false },
        { type: pkcs11js.CKA_LABEL, value: "My AES Key" },
        { type: pkcs11js.CKA_VALUE_LEN, value: 256 / 8 },
        { type: pkcs11js.CKA_ENCRYPT, value: true },
        { type: pkcs11js.CKA_DECRYPT, value: true },
    ];

    // try {
    //     var key = pkcs11.C_GenerateKey(session, { mechanism: pkcs11js.CKM_AES_KEY_GEN }, template);
    // } catch (error) {
    //     console.warn('burasi', error)
    // }
    try {
        pkcs11.C_GenerateKey(session, { mechanism: pkcs11js.CKM_AES_KEY_GEN }, template)    
    } catch (error) {
        console.warn(error)
    }
    // pkcs11.C_InitPIN(session, '123456')
    pkcs11.

    pkcs11.C_Logout(session);
    pkcs11.C_CloseSession(session);
}
catch(e){
    console.error(e);
}
finally {
    pkcs11.C_Finalize();
}