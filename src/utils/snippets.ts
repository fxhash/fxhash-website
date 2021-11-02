export const snippetFromUrl = `
      let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
      var fxhash = new URLSearchParams(window.location.search).get('fxhash')
      let b58dec = (str) => str.split('').reduce((p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
      let fxhashTrunc = fxhash.slice(2)
      let regex = new RegExp(".{" + ((fxhashTrunc.length/4)|0) + "}", 'g')
      let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
      let sfc32 = (a, b, c, d) => {
        return () => {
          a |= 0; b |= 0; c |= 0; d |= 0
          var t = (a + b | 0) + d | 0
          d = d + 1 | 0
          a = b ^ b >>> 9
          b = c + (c << 3) | 0
          c = c << 21 | c >>> 11
          c = c + t | 0
          return (t >>> 0) / 4294967296
        }
      }
      var fxrand = sfc32(...hashes)
`