const cache = {}
const referrers = {}

async function fetchUrl(url, file) {
  // Let the service worker decide on secure response
  // headers, but set its body to the file blob.
  const record = await fetch(url)
  const options = /\.m?js([#?].*)?$/.test(file) ? {headers: {'content-type': 'text/javascript'}} : undefined
  return new Response(record.body, options);
}

self.addEventListener("fetch", async (event) => {
  // get an ID from the request referrer url
  const url = new URL(event.request.referrer)
  const id = url.searchParams.get("id")
  // only proceed if there is an ID as parameter in the request
  // check if we have the data in the cache / refererrs
  if (id && cache[id] && referrers[id]) {
    // does the url matches the base ?
    if (`${url.origin}${url.pathname}` === referrers[id].base) {
      // then we prevent the default response by calling respondWith
      event.respondWith(async function() {
        // find the path of the resource requested
        const path = event.request.url.replace(referrers[id].root, "")
        // only fetch if there is a match in the cache
        if (!cache[id][path]) return null;
        
	return await fetchUrl(cache[id][path].url, event.request.url)
      }())
    }
  } else {
    // check for js modules being requested because the referrer will differ
    const cacheId = Object.keys(cache).pop()
    const moduleName = event.request.url.split('/').pop()
    // only fetch when module is part of cache
    if(cacheId && moduleName && cache[cacheId][moduleName]) {
      event.respondWith(async function() {
	return await fetchUrl(cache[cacheId][moduleName].url, event.request.url)
      }())
    }
  }
})

self.addEventListener("message", async (event) => {
  // save the sandbox url to parse requests easily
  if (event?.data?.type === "REGISTER_REFERRER") {
    referrers[event.data.data.id] = event.data.data.referrer
  }

  if (event?.data?.type === "REGISTER_URLS") {
    const data = event.data.data
    cache[data.id] = data.record
  }

  if (event?.data?.type === "GET_INDEX") {
    const id = event.data.data

    if (cache[id]) {
      const html = await cache[id]["index.html"].blob.text()
      event.source.postMessage({
        type: "INDEX_HTML_CONTENTS",
        data: html
      })
    }
  }
})
