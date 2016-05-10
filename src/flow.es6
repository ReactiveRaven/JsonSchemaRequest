const flow = (...actions) => input => actions.reduce((value, action) => action(value), input);

export const injection = container => container.mapValue("flow", flow);

export default flow;
