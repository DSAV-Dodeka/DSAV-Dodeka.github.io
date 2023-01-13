import React, {useEffect, useState} from "react";

// Just for testing
const Timer = () => {
    const [left, setLeft] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            // Pass a function so it uses the previous value
            setLeft(left => left + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <p>{left} have elapsed.</p>
        </>
    )
}

export default Timer;