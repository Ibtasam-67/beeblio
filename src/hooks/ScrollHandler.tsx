import { useState, useEffect } from "react"

const useScrollHandler = () => {
    // setting initial value to true
    const [scroll, setScroll] = useState(1);

    // running on mount
    useEffect(() => {
        const onScroll = () => {
            setScroll(window.scrollY);
        }

        // setting the event handler from web API
        document.addEventListener("scroll", onScroll)

        // cleaning up from the web API
        return () => {
            document.removeEventListener("scroll", onScroll)
        }
    }, [scroll, setScroll])

    return scroll

}

export default useScrollHandler;