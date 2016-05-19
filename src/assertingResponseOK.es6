const assertingResponseOK = ajv => {
    var ajvRemoveAdditional = ajv({ removeAdditional: true });

    return link => {
        var responseOk = (
            link.targetSchema ?
                ajvRemoveAdditional.compile(link.targetSchema) :
                () => true
        );

        return data => {
            if (!responseOk(data)) {
                throw new Error(
                    responseOk.errors
                        .map(err => `${ err.dataPath } ${ err.message }`)
                        .join("; ")
                );
            }

            return data;
        };
    };
};

export const injection = container => container.mapClass("assertingResponseOK", assertingResponseOK, true);

export default assertingResponseOK;
