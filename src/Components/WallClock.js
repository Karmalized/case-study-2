import React from "react";

const WallClock = () => {
    const[currentTime, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const timeSplit = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timeSplit);
    }, []);

    return(
        <div>
            <h2>{currentTime.toDateString()}</h2>
            <div className="clock">
                <h3>{currentTime.toLocaleTimeString()}</h3>
            </div>
        </div>
    )
}

export default WallClock;