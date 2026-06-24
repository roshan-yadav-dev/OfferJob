import { Link } from 'react-router-dom';

function PageHeader({ title, description, action }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 animate-fade-in-up">
                <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 text-sm text-[#64748b] sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export default PageHeader;
