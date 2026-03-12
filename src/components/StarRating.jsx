import { useState } from 'react';

export default function StarRating({ initialRating = 0, onRate, readOnly = false, size = "md" }) {
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(initialRating);

    const sizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-10 h-10"
    };

    const handleClick = (value) => {
        if (readOnly) return;
        setRating(value);
        if (onRate) onRate(value);
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    className={`transition-all duration-200 transform ${!readOnly && 'hover:scale-125 focus:outline-none'}`}
                >
                    <svg
                        className={`${sizes[size] || sizes.md} ${(hover || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </button>
            ))}
        </div>
    );
}
