export function bytesToString(byteArray: number[]): string {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

export function stringToByteString(str: string): string {
	const bytes = []
  for (let i = 0; i<str.length; i++) {
  	bytes.push(str.charCodeAt(i))
  }
  return bytesToString(bytes)
}
