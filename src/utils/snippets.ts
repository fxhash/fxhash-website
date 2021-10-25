export const snippetFromUrl = `
      var fxhash = new URLSearchParams(window.location.search).get('fxhash')
      let hashes = fxhash.match(/.{16}/g).map(h => parseInt(h, 16))
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