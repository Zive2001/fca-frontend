import React, { useState, useEffect } from 'react';

const CurrDate = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm text-gray-600">
      <span>Date: {date.toLocaleDateString()}</span>
    </div>
  );
};

export default CurrDate;