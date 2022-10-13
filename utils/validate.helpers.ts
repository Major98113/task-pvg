import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-errors')(ajv /*, {singleError: true} */);
require('ajv-keywords')(ajv, ['transform']);

export const validate = ( data: any, schema: any) => {
    const validateFunction = ajv.compile(schema);
    const isValid = validateFunction(data);
    return isValid ? null : validateFunction.errors;
};