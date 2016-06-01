const inputSchema = require("../schema/inputSchema.json");

const assertingInputOK = (ajv, JsonValidationError, Promise) => {
    const okRequest = ajv({}).compile(inputSchema);

    return requestDef => {
        return new Promise((resolve, reject) => (
            !okRequest(requestDef) ?
                reject(new JsonValidationError(okRequest.errors, "Input")) :
                resolve(true)
        ));
    };
};

export const injection = container => container.mapClass("assertingInputOK", assertingInputOK, true);

export default assertingInputOK;
