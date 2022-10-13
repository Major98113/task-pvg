const USER_AGE_PROPERTIES = {
    "type": "integer",
    "minimum": 4,
    "maximum": 130
};

const USER_LOGIN_PROPERTIES = {
    "type": "string"
};

const USER_PASSWORD_PROPERTIES = {
    "type": "string",
    "pattern": "(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{2,255})$"
};

const ERROR_MESSAGES = {
    type: 'should be an object',
    required: {
        username: 'should have an string property "username"',
        password: 'should have a string property "password"',
        age: 'should have a number property "age"'
    },
    properties: {
        password: 'Password property should contain no less 1 number and 1 letter',
        age: 'Age property should be between 4 and 130'
    }
}

export const createUserSchema = {
    type: 'object',
    required: ['username', 'password', 'age'],
    properties: {
        "age": USER_AGE_PROPERTIES,
        "username": USER_LOGIN_PROPERTIES,
        "password": USER_PASSWORD_PROPERTIES,
    },
    errorMessage: ERROR_MESSAGES
};

export const updateUserSchema = {
    type: 'object',
    required: [],
    properties: {
        "age": USER_AGE_PROPERTIES,
        "username": USER_LOGIN_PROPERTIES,
        "password": USER_PASSWORD_PROPERTIES,
    },
    errorMessage: ERROR_MESSAGES
};

export const loginUserSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        "username": USER_LOGIN_PROPERTIES,
        "password": {
            "type": "string"
        },
    },
    errorMessage: ERROR_MESSAGES
};