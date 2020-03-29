const indy = require('indy-sdk')
const pool = require('./pool')


const sendSchema = async (poolHandle, issuerWallet, issuerDid, credentialSchema) => {
    console.log(poolHandle, issuerWallet, issuerDid, credentialSchema);
    
    let schemaRequest = await indy.buildSchemaRequest(issuerDid, credentialSchema)
    console.log('req---------', schemaRequest);
    console.log('-----------')
    console.log(schemaRequest.operation.data.attr_names);
    
    let response = await indy.signAndSubmitRequest(poolHandle, issuerWallet, issuerDid, schemaRequest)
    console.log('SCHEMA SENT ---------------->', response);
    
    return {schema:credentialSchema.name, msg:'Schema sent'}
}


const getSchema = async(issuerDid, credentialSchemaId, poolHandle) => {
    
    let getSchemaRequest = await indy.buildGetSchemaRequest(issuerDid, credentialSchemaId)
    console.log(' get Schema reqt', getSchemaRequest);
    
    let getSchemaResponse = await indy.submitRequest(poolHandle, getSchemaRequest);
    console.log('get schema response', getSchemaResponse);

    console.log('ARGS IN GET SCHEMA---------- >');
    console.log(issuerDid, credentialSchemaId, poolHandle);

    let [schemaId, schema] = await indy.parseGetSchemaResponse(getSchemaResponse);
    console.log('GOT SCHEMA---------->',schema);
    
    return {schemaId, schema}
}



const createSchema = async (issuerDid, nameOfSchema, attrNames, version='1.0') => {
    console.log('In create schema func --------------->');
    console.log(issuerDid, nameOfSchema, version, attrNames)
    let [schemaId, schema] = await indy.issuerCreateSchema(issuerDid, nameOfSchema, version, attrNames)
    console.log('SCHEMA CREATED-------->', schema)
    return {schemaId, schema}
}



const sendCredDef = async (poolHandle, issuerWallet, issuerDid, credDef) => {
    let credDefRequest = await indy.buildCredDefRequest(issuerDid, credDef)
    await indy.signAndSubmitRequest(poolHandle, issuerWallet, issuerDid, credDefRequest)
    console.log('Cred def sent--------->')
    return {credDef, msg:'CredDef Sent'}
}


const getCredDef = async (poolHandle, issuerDid, credDefId) => {
    let getCredDefRequest = await indy.buildGetCredDefRequest(issuerDid, credDefId)
    let getCredDefResponse = await indy.submitRequest(poolHandle, getCredDefRequest)
    return await indy.parseGetCredDefResponse(getCredDefResponse)
}


const createCredDef = async(issuerWallet, issuerDid, credentialSchema, tag='TAG1', type='CL', config='{"support_revocation": false}') => {
    let [credDefId, credDef] = await indy.issuerCreateAndStoreCredentialDef(issuerWallet, issuerDid, credentialSchema, tag, type, config)
    console.log('cred def created');
    
    return {credDefId, credDef}
}

module.exports = {sendSchema, getSchema, createSchema, sendCredDef, getCredDef, createCredDef}

