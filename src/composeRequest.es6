const composeRequest = (
    ajv,
    escapeUrl,
    resolveDataForInspection,
    resolveDataForTransmission,
    resolveUrl,
    uriTemplates
) => {
    const ajvRemoveAdditional = ajv({ removeAdditional: true });

    return requestDef => link => {
        const uriTemplate = uriTemplates(escapeUrl(link.href));
        const missingKeys = uriTemplate.varNames
            .filter(varName => varName !== "%73elf")
            .map(varName => varName === "%65mpty" ? "" : varName)
            .filter(varName => !(requestDef.context || {}).hasOwnProperty(varName));

        if (missingKeys.length) {
            throw new Error("Missing keys for request: " + missingKeys.join(", "));
        }

        const request = {
            method: link.method || "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        if (link.schema) {
            const isOk = ajvRemoveAdditional.compile(link.schema);
            if (!isOk(resolveDataForInspection(requestDef.data))) {
                throw new Error(
                    isOk.errors
                        .map(err => `${ err.dataPath } ${ err.message }`)
                        .join("; ")
                );
            } else {
                request.body = resolveDataForTransmission(requestDef.data);
            }
        }

        const url = resolveUrl(
            uriTemplate
                .fill({
                    "%73elf": requestDef.context || {},
                    ...(requestDef.context || {})
                }),
            requestDef
        );

        return {
            url,
            request,
            link
        };
    };
}

export const injection = container => container.mapClass("composeRequest", composeRequest, true);

export default composeRequest;
