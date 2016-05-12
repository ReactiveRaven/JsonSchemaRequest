const matchLink = requestDef => schema => { // will need access to requestDef
    if (!Array.isArray(schema.links) || schema.links.length === 0) {
        throw new Error("Schema has no links, cannot create a request.");
    }
    const matchingLinks = schema.links
        .filter(link => link.rel === requestDef.rel);

    if (matchingLinks.length === 0) {
        throw new Error(`Could not find a link matching the given rel '${ requestDef.rel }' for ${ requestDef.schemaUrl }`);
    } else if (matchingLinks.length > 1) {
        throw new Error("Found multiple links with the same rel!");
    } else {

        const alreadySeeked = [];

        const seekRefs = (obj) => {
            if (alreadySeeked.indexOf(obj) > -1) {
                return obj;
            }
            if (typeof obj !== "object") return obj;
            if (Array.isArray(obj)) return obj.map(seekRefs);

            Object.keys(obj)
                .forEach(key => obj[key] = seekRefs(obj[key]));

            if (obj["$ref"] === schema.id + "#") {
                delete obj["$ref"];
                const schemaClone = {
                    ...schema
                };
                delete schemaClone.links;
                const newObj = {
                    ...obj,
                    ...schemaClone
                };
                obj = newObj;
            }

            alreadySeeked.push(obj);

            return obj;
        }

        return seekRefs(matchingLinks[0]);
    }
}

export const injection = container => container.mapValue("matchLink", matchLink);

export default matchLink;
