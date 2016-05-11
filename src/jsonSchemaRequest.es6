const jsonSchemaRequest = (
    assertingInputOK,
    schemaFetcher,
    expandSchema,
    matchLink,
    flow,
    composeRequest,
    firingRequest,
    assertingResponseOK
) => requestDef =>
    assertingInputOK(requestDef)
        .then(() => schemaFetcher(requestDef.schemaUrl))
        .then(expandSchema(requestDef.schemaPrefix))
        .then(matchLink(requestDef))
        .then(link => {
            const composedRequest = composeRequest(requestDef)(link);
            return firingRequest(composedRequest)
                .then(assertingResponseOK(link))
        });

export const injection = container => container.mapClass("jsonSchemaRequest", jsonSchemaRequest, true);

export default jsonSchemaRequest;
