const escapeUrl = url => {
    const input = url;
    const specialReplaces = body =>
        body.replace(/ /g, "%20")
            .replace(/\+/g, "%2B")
            .replace(/\*/g, "%2A")
            .replace(/\(/g, "%28")
            .replace(/\)\)/g, "%29")
            .replace(/^$/, "%65mpty")
            .replace(/\$/g, "%24")
    return url.replace(
            /\{([^(}]*)\((.*?)\)([^)}]*)\}/,
            (all, head, body, tail) =>
                `{${head}${specialReplaces(body)}${tail}}`
        )
        .replace(
            /\{([^}]*)\}/g,
            (all, body) =>
                `{${body.replace(/\$/g, "%73elf")}}`
        );
};

export const injection = container => container.mapValue("escapeUrl", escapeUrl);

export default escapeUrl;
