import { useEffect, useRef } from 'react'
import isEqual from '../helpers/isEqual'

function useDeepCompareEffect(fn, deps, options) {
  const firstRender = useRef(true)
  const prevDeps = useRef(deps)
  useEffect(() => {
    if (options?.debugKey) {
      console.group(`useDeepCompareEffect - ${options?.debugKey}`)
      console.log('deps', deps)
    }

    const isSame = isEqual(deps, prevDeps.current)
    if (options?.debugKey) {
      console.log(
        'useDeepCompareEffect isSame =>',
        isSame,
        deps,
        prevDeps.current
      )
      console.log('useDeepCompareEffect firstRender =>', firstRender.current)
      console.log(
        'useDeepCompareEffect should execute =>',
        Boolean((firstRender.current || !isSame) && fn)
      )
    }
    if ((firstRender.current || !isSame) && fn) {
      if (options?.debugKey) {
        console.log('useDeepCompareEffect fn executed')
      }
      fn()
      prevDeps.current = deps
    }

    if (options?.debugKey) {
      console.groupEnd()
    }

    firstRender.current = false
  }, [deps, fn])
}
export default useDeepCompareEffect
