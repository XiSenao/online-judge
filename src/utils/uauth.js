import Cookies from 'js-cookie'

const TokenKey = 'User-Token'

export function getToken() {
    console.log(Cookies.get(TokenKey))
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    Cookies.remove(TokenKey)
}