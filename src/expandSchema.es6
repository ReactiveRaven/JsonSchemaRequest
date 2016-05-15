const normaliseRefs = refs =>
    refs
        // ignore self-references
        .filter(ref => ref !== "#")
        // ignore drilldowns, only interested in files to load
        .map(ref => ref.split("#")[0])
        // remove duplicates
        .filter((ref, idx, arr) => arr.indexOf(ref) === idx);

const expandSchema = (deref, schemaFetcher, Promise, deepPluck) =>
    schemaPrefix => schemaContent =>
        Promise.all(
            normaliseRefs(deepPluck(schemaContent, "$ref"))
                .map(key => schemaFetcher(key))
        )
            .then(otherSchemas => deref()(
                schemaPrefix,
                schemaContent,
                otherSchemas,
                true
            ));

export const injection = container => container.mapClass("expandSchema", expandSchema, true);

export default expandSchema;
