import React, { useState, useEffect } from "react";

export default function Timer ({ minutes, onTimeout, className }) {

  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
    } else {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, onTimeout]);

  const hoursLeft = Math.floor(timeLeft / 3600);
  const minutesLeft = Math.floor((timeLeft % 3600) / 60);
  const secondsLeft = timeLeft % 60;

  return (
    <div className={"transition-colors " + (className ? className : "") + (timeLeft < 60 ? " text-red-500" : "")}>
      {timeLeft > 0 ? (
        <div>
          <p>{`${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`}</p>
        </div>
      ) : (
        <p>Time's Up!</p>
      )}
    </div>
  );
};
