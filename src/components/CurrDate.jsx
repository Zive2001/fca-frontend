import React, { useState, useEffect } from 'react';

const CurrDate = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <p>Date: {date.toLocaleDateString()}</p>
    </div>
  );
};

export default CurrDate;
