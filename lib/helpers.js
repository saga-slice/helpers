/**
 * Assertation function for type checking
 * @param {boolean} affirmative Thing to assert
 * @param {string} message Message to pass to error
 */
export const affirm = (affirmative, message = '') => {
    if (!affirmative) {
        throw new Error(message);
    }
};

export const isArray = (val) => val && val.constructor === Array;
export const isObject = (val) => typeof val === 'object';
export const isFunction = (val) => typeof val === 'function';
export const isString = (val) => typeof val === 'string';
export const isNotEmpty = (val) => val && val.length;
export const isNotUndefined = (val) => typeof val !== 'undefined';
