import React, { useState, useEffect } from 'react';

const Quote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(data => {
        setQuote(data.content);
        setAuthor(data.author);
      })
      .catch(error => console.error('Error fetching quote:', error));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center my-4">
      <p className="text-xl mx-4 truncate">&ldquo;{quote}&rdquo;</p>
      <p className="text-lg mt-2">- {author}</p>
    </div>
  );
};

export default Quote;