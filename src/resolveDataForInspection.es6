const resolveDataForInspection = (FormData, from) => inputData => {
    // TODONE:10 Handle extracting data from passed-in object
    if (inputData instanceof FormData) {
        const result = {};
        const iterator = inputData.entries();

        var current = iterator.next();
        while (!current.done) {
            result[current.value[0]] = current.value[1];
            current = iterator.next();
        }
        return result;
    } else {
        // string? already object? Assume the dev knows what they're doing.
        return inputData;
    }
};

export const injection = container => container.mapClass("resolveDataForInspection", resolveDataForInspection, true);

export default resolveDataForInspection
