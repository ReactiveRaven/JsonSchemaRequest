const resolveUrl = (url, requestDef) => {
    return (
        url.indexOf("http") !== 0 ?
            (requestDef.serverRoot || "") + url :
            url
    );
}

export const injection = container => container.mapValue("resolveUrl", resolveUrl);

export default resolveUrl;
