const resolveDataForTransmission = FormData => inputData => {
    if (typeof inputData === "string" || inputData instanceof FormData) {
        return inputData;
    } else if (typeof inputData === "function") {
        throw new TypeError("Expected a string or object, received a function");
    } else {
        return JSON.stringify(inputData);
    }
}

export const injection = container => container.mapClass("resolveDataForTransmission", resolveDataForTransmission, true);

export default resolveDataForTransmission;
