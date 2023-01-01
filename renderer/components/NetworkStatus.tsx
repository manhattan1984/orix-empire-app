import React, { useState, useEffect } from "react";

const NetworkStatus = () => {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    function changeStatus() {
      setOnline(navigator.onLine);
    }
    window.addEventListener("online", changeStatus);
    window.addEventListener("offline", changeStatus);
    return () => {
      window.removeEventListener("online", changeStatus);
      window.removeEventListener("offline", changeStatus);
    };
  }, []);
  return <div>NetworkStatus</div>;
};

export default NetworkStatus;
