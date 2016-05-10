const jsonSchemaRequest = (
    assertingInputOK,
    fetchSchema,
    expandSchema,
    matchLink,
    flow,
    composeRequest,
    firingRequest,
    assertingResponseOK
) => requestDef =>
    assertingInputOK(requestDef)
        .then(() => fetchSchema(requestDef.schemaUrl))
        .then(expandSchema)
        .then(matchLink(requestDef))
        .then(link => {
            const composedRequest = composeRequest(requestDef)(link);
            return firingRequest(composedRequest)
                .then(assertingResponseOK(link))
        });

export const injection = container => container.mapClass("jsonSchemaRequest", jsonSchemaRequest, true);

export default jsonSchemaRequest;
