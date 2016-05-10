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
        return matchingLinks[0];
    }
}

export const injection = container => container.mapValue("matchLink", matchLink);

export default matchLink;
