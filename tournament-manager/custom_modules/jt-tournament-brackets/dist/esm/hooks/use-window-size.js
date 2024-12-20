import { useState, useLayoutEffect, useEffect } from 'react';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useIsomorphicLayoutEffect(() => {
        if (typeof global.window === 'undefined')
            return;
        function updateSize() {
            setSize([global.window.innerWidth, window.innerHeight]);
        }
        global.window.addEventListener('resize', updateSize);
        updateSize();
        return () => global.window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}
export default useWindowSize;
//# sourceMappingURL=use-window-size.js.map