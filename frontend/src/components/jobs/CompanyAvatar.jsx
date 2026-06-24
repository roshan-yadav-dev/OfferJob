import { getCompanyInitials } from '../../utils/formatters';

function CompanyAvatar({ company, logoUrl, size = 'md' }) {
    const sizeClasses = {
        sm: 'h-9 w-9 text-xs',
        md: 'h-11 w-11 text-sm',
        lg: 'h-14 w-14 text-base',
    };

    const classes = sizeClasses[size] || sizeClasses.md;

    if (logoUrl) {
        return (
            <img
                src={logoUrl}
                alt={company || 'Company'}
                className={`${classes} shrink-0 rounded-full border border-[#e2e8f0] object-cover`}
            />
        );
    }

    return (
        <div
            className={`${classes} flex shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#2563eb]`}
        >
            {getCompanyInitials(company)}
        </div>
    );
}

export default CompanyAvatar;
