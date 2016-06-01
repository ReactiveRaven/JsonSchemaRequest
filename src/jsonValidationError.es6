class JsonValidationError extends Error {
    constructor(errors, source) {
        if (!Array.isArray(errors)) {
            errors = [ errors ];
        }

        const message = errors
            .map(err => `${ err.dataPath || JSON.stringify(err.params || {}) } ${ err.message }`)
            .join("; ");
        super(`${ source }: ${ message }`);
        this.errors = errors;
        this.status = 500;
    }
}

export const injection = container => container.mapValue("JsonValidationError", JsonValidationError);

export default JsonValidationError;
