const assertingResponseOK = (ajv, JsonValidationError) => {
    var ajvRemoveAdditional = ajv({ removeAdditional: true });

    return link => {
        var responseOk = (
            link.targetSchema ?
                ajvRemoveAdditional.compile(link.targetSchema) :
                () => true
        );

        return data => {
            if (!responseOk(data)) {
                throw new JsonValidationError(responseOk.errors, "Response");
            }

            return data;
        };
    };
};

export const injection = container => container.mapClass("assertingResponseOK", assertingResponseOK, true);

export default assertingResponseOK;
