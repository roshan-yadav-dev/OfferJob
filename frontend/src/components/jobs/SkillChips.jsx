function SkillChips({ skills = [] }) {
    if (!skills.length) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <span
                    key={skill}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-[#64748b]"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
}

export default SkillChips;
