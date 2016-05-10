const firingRequest = fetch =>  builtRequest => fetch(builtRequest.url, builtRequest.request)
    .then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText)
            error.response = response;
            throw error;
        }
    })
    .then(response => response.json())
    .then(parsed => parsed.data);

export const injection = container => container.mapClass("firingRequest", firingRequest, true);

export default firingRequest;
