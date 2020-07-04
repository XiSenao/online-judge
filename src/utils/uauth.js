import Cookies from './storage'

const TokenKey = 'User-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    Cookies.remove(TokenKey)
}