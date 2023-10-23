import fetch from '../component/fetch'

export function login(user){
    return fetch({
        url:'/login',
        method:'post',
        data:user
    })
}