const a = new Proxy({}, {
  set: function (target, key, value) {
    console.log('set', key, value)
    target[key] = value
  },
  get: function (target, key) {
    console.log('get', key)
    return target[key]
  }
})
a.name = 'jack'
console.log(a.name);