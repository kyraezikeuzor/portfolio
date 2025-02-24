'use client';
import React, { useState } from 'react';

type ReadMoreProps = {
  text: string;
  charCount: number;
  noButton?: true;
};

const ReadMore = ({ text, charCount, noButton }: ReadMoreProps) => {
  const [readMore, setReadMore] = useState(false);

  const handleSetReadMore = () => {
    setReadMore(!readMore);
  };

  var newText = '';

  for (let i = 0; i < charCount; i++) {
    var punctuation = ' ';

    if (text[i] !== ' ') {
      punctuation = '';
    }

    newText = newText.concat(text[i], punctuation);
  }

  return (
    <span>
      {noButton ? (
        <p>{newText}...</p>
      ) : (
        <span>
          {!readMore && (
            <p>
              {newText}{' '}
              <span
                onClick={handleSetReadMore}
                className="cursor-pointer text-[--clr-blue-base] font-medium"
              >
                Read more
              </span>
            </p>
          )}

          {readMore && (
            <p>
              {text}{' '}
              <span
                onClick={handleSetReadMore}
                className="cursor-pointer text-[--clr-blue-base] font-medium"
              >
                Read less
              </span>
            </p>
          )}
        </span>
      )}
    </span>
  );
};

export default ReadMore;
