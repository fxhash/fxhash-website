export const snippetFromUrl = `
      var fxhash=new URLSearchParams(window.location.search).get('fxhash')
      var fxhashValues=fxhash.match(/.{4}/g).map(s=>parseInt(s,16)).map(n=>n/(10**((''+n).length-1))).map(n=>n-(n|0))
      var fxhashValues2=fxhash.match(/.{8}/g).map(s=>parseInt(s,16)).map(n=>n/(10**((''+n).length-1))).map(n=>n-(n|0))
`