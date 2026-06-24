function Card({ children, className = '', padding = true }) {
    return (
        <div
            className={[
                'rounded-2xl border border-[#e2e8f0] bg-white shadow-sm transition-shadow duration-200',
                padding ? 'p-6' : '',
                className,
            ].join(' ')}
        >
            {children}
        </div>
    );
}

export default Card;
