const assertingResponseOK = ajv => {
    var ajvRemoveAdditional = ajv({ removeAdditional: true });

    return link => {
        var responseOk = (
            link.targetSchema ?
                ajvRemoveAdditional.compile(link.targetSchema) :
                () => true
        );

        return data => {
            // @TODONE:0 fix builtRequest.link dependency. link returned by matchLink should be passed to both composeRequest and fireRequest
            if (!responseOk(data)) {
                throw new Error(
                    responseOk.errors
                        .map(err => `${ err.dataPath } ${ err.message }`)
                        .join("; ")
                );
            }

            return data;
        }
    };
};

export const injection = container => container.mapClass("assertingResponseOK", assertingResponseOK, true);

export default assertingResponseOK;
