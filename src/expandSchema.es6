const expandSchema = (ajv, deref, schemaFetcher, Promise) => {
    const ajvRemoveAdditional = ajv({ removeAdditional: true });

    return schemaPrefix => schemaContent =>
        new Promise((resolve, reject) => {
            ajvRemoveAdditional.compileAsync(
                schemaContent,
                (err, validator) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(validator);
                }
            )
        })
            .then(validator => Promise.all(
                Object.keys(validator.refs)
                    .map(key => key.split("#")[0])
                    .filter((key, index, array) => array.indexOf(key) === index)
                    .map(key => schemaFetcher(key))
            ))
            .then(otherSchemas => deref(
                schemaPrefix,
                schemaContent,
                otherSchemas,
                true
            ));
};

export const injection = container => container.mapClass("expandSchema", expandSchema, true);

export default expandSchema;
