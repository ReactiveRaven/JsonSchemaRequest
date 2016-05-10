const inputSchema = require("../schema/inputSchema.json");

const assertingInputOK = (ajv, Promise) => {
    const okRequest = ajv({}).compile(inputSchema);

    class JsonValidationError extends Error {
        constructor(errors) {
            if (!Array.isArray(errors)) {
                errors = [ errors ];
            }
            const message = errors.map(err => `${ err.dataPath } ${ err.message }`).join("; ");
            super(message);
            this.errors = errors;
            this.status = 500;
        }
    }

    return requestDef => {
        return new Promise((resolve, reject) => (
            !okRequest(requestDef) ?
                reject(new JsonValidationError(okRequest.errors)) :
                resolve(true)
        ));
    };
};

export const injection = container => container.mapClass("assertingInputOK", assertingInputOK, true);

export default assertingInputOK;
