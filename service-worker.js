const _self = this

console.log('In service worker.')

_self.addEventListener('install', function () {
    console.log('Install success')
})

_self.addEventListener('activate', function () {
    console.log('Activated')
})
