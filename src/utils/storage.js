const getToken = () => {
    return localStorage.getItem('token');
}

const setToken = token => {
    if (token)
        return localStorage.setItem('token', token);
    const current = getToken();
    if (current)
        localStorage.removeItem('token');
}

const getShoppingCart = () => {
    return localStorage.getItem('shopping-cart');
}

const setShoppingCart = items => {
    if (items)
        return localStorage.setItem('shopping-cart', items);
    const current = getShoppingCart();
    if (current)
        localStorage.removeItem('shopping-cart');
}

const getFCMToken = () => {
    return localStorage.getItem('FCMToken');
}

const setFCMToken = token => {
    if (token)
        return localStorage.setItem('FCMToken', token);
    const current = getFCMToken();
    if (current)
        localStorage.removeItem('FCMToken');
}

export default {
    getToken, setToken, getFCMToken, setFCMToken, getShoppingCart, setShoppingCart
};