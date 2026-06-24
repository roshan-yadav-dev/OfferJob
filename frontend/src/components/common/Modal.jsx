import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
        >
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Close modal overlay"
            />

            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                className={`relative w-full ${sizeClasses[size] || sizeClasses.md} animate-fade-in-up rounded-2xl border border-[#e2e8f0] bg-white shadow-xl`}
            >
                {(title || onClose) && (
                    <div className="flex items-start justify-between border-b border-[#e2e8f0] px-6 py-4">
                        {title && (
                            <h2
                                id="modal-title"
                                className="text-lg font-semibold text-[#0f172a]"
                            >
                                {title}
                            </h2>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="focus-ring ml-auto rounded-lg p-1.5 text-[#64748b] transition-colors duration-200 hover:bg-slate-50 hover:text-[#0f172a]"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                <div className="px-6 py-5">{children}</div>

                {footer && (
                    <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;
