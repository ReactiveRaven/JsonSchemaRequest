const jsonSchemaRequest = (
    assertingInputOK,
    assertingResponseOK,
    composeRequest,
    deref,
    firingRequest,
    jsonSchemaLoadTree,
    matchLink
) => requestDef =>
    assertingInputOK(requestDef)
        .then(() => jsonSchemaLoadTree(requestDef.schemaUrl))
        .then(tree => deref()(
            requestDef.schemaPrefix,
            tree[requestDef.schemaUrl],
            Object.keys(tree).map(key => tree[key]),
            true
        ))
        .then(matchLink(requestDef))
        .then(link =>
            firingRequest(composeRequest(requestDef)(link))
                .then(assertingResponseOK(link))
        );

export const injection = container => container.mapClass("jsonSchemaRequest", jsonSchemaRequest, true);

export default jsonSchemaRequest;
