import { useEffect, useRef } from 'react'


export function useEventListener(eventNames: string | string[], handler: () => void, element = globalThis) {

    const savedHandler = useRef<any>()
    if (!Array.isArray(eventNames)) eventNames = [eventNames]
    //always get the latest handler without re-running on every render
    useEffect(() => (savedHandler.current = handler), [handler])
    
    useEffect(() => {
        if (!element.addEventListener) return 
        const listener = (event: any) => {
            if(savedHandler?.current) return savedHandler.current(event)
        }
        for (const e of eventNames) element.addEventListener(e, listener)
        return () => {
            for (const e of eventNames) element.removeEventListener(e, listener)
        }
    }, [element, eventNames])
}
