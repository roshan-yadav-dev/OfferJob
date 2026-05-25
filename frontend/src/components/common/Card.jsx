function Card({ children, className = '' }) {
    return (
        <div
            className={`
        bg-white
        rounded-xl
        shadow-md
        p-5
        border
        border-gray-100
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export default Card;
