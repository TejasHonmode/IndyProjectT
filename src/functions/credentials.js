const indy = require('indy-sdk')
const pool = require('./pool')


const sendSchema = async (poolHandle, issuerWallet, issuerDid, credentialSchema) => {
    let schemaRequest = await indy.buildSchemaRequest(issuerDid, credentialSchema)
    await indy.signAndSubmitRequest(poolHandle, issuerWallet, issuerDid, schemaRequest)
    return 'Schema sent'
}


const getSchema = async(poolHandle, issuerDid, credentialSchemaId) => {
    let getSchemaRequest = await indy.buildGetSchemaRequest(issuerDid, credentialSchemaId)
    let getSchemaResponse = await indy.submitRequest(poolHandle, getSchemaRequest);
    return await indy.parseGetSchemaResponse(getSchemaResponse);
}



const createSchema = async (issuerDid, nameOfSchema, version='1.2', credList) => {
    let [schemaId, schema] = await indy.issuerCreateSchema(issuerDid, nameOfSchema, version, credList)

    return {schemaId, schema}
}



const sendCredDef = async (poolHandle, issuerWallet, issuerDid, credDef) => {
    let credDefRequest = await indy.buildCredDefRequest(issuerDid, credDef)
    await indy.signAndSubmitRequest(poolHandle, issuerWallet, issuerDid, credDefRequest)
    return 'CredDef Sent'
}


const getCredDef = async (poolHandle, issuerDid, schemaId) => {
    let getCredDefRequest = await indy.buildGetCredDefRequest(issuerDid, schemaId)
    let getCredDefResponse = await indy.submitRequest(poolHandle, getCredDefRequest)
    return await indy.parseGetCredDefResponse(getCredDefResponse)
}


const createCredDef = async(issuerWallet, issuerDid, credentialSchema, tag='TAG1', type='CL', config='{"support_revocation": false}') => {
    let [credDefId, credDef] = await indy.issuerCreateAndStoreCredentialDef(issuerWallet, issuerDid, credentialSchema, tag, type, config)
    return {credDefId, credDef}
}

module.exports = {sendSchema, getSchema, createSchema, sendCredDef, getCredDef, createCredDef}
