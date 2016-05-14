const refFinder = obj => {
    if (Array.isArray(obj)) {
        return obj.map(item => refFinder(item))
            .reduce((acc, val) => acc.concat(val), []);
    }
    if (typeof obj !== "object") {
        return [];
    }
    var refs = [];
    if (obj.$ref) {
        refs.push(obj.$ref);
    }
    refs = Object.keys(obj)
        .map(key => refFinder(obj[key]))
        .reduce((acc, val) => acc.concat(val), refs);
    return refs;
};

const normaliseRefs = refs => refs.filter(ref => ref !== "#")
    .map(ref => ref.split("#")[0])
    .filter((ref, idx, arr) => arr.indexOf(ref) === idx);

const expandSchema = (deref, schemaFetcher, Promise) => {
    const loadSchema = (uri, callback) => schemaFetcher(uri)
        .then(data => callback(null, data), err => callback(err));

    return schemaPrefix => schemaContent =>
        Promise.all(
            normaliseRefs(refFinder(schemaContent))
                .map(key => schemaFetcher(key))
        )
            .then(otherSchemas => deref()(
                schemaPrefix,
                schemaContent,
                otherSchemas,
                true
            ));
};

export const injection = container => container.mapClass("expandSchema", expandSchema, true);

export default expandSchema;
