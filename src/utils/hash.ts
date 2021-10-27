const charSet = 'abcdef0123456789'
export const generateFxHash = () => Array(64).fill(0).map(_ => charSet[(Math.random() * charSet.length)|0]).join('')