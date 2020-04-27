const createTokenFuncsPair = (tokenName, jsonWrapper = false) => {
    const getFunc = jsonWrapper ? () => JSON.parse(localStorage.getItem(tokenName)) : () => localStorage.getItem(tokenName);
    const resetFunc = () => {
        const current = getFunc();
        if (current)
            localStorage.removeItem(tokenName);
    };
    const setFunc = token => {
        if (token)
            return localStorage.setItem(tokenName, jsonWrapper ? JSON.stringify(token) : token);
        resetFunc();
    }
    return {
        getFunc,
        setFunc
    };
};

const tokenFuncsPair = createTokenFuncsPair('token');

const shoppingCartFuncsPair = createTokenFuncsPair('shopping-cart', true);

const fcmFuncsPair = createTokenFuncsPair('FCMToken');

export default {
    getToken: tokenFuncsPair.getFunc,
    setToken: tokenFuncsPair.setFunc,
    getShoppingCart: shoppingCartFuncsPair.getFunc,
    setShoppingCart: shoppingCartFuncsPair.setFunc,
    getFCMToken: fcmFuncsPair.getFunc,
    setFCMToken: fcmFuncsPair.setFunc
};