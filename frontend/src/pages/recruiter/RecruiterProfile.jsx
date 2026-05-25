import Card from '../../components/common/Card';

function RecruiterProfile() {
    return (
        <div className="space-y-8">
            <div>
                <h1
                    className="
                        text-4xl
                        font-bold
                        text-gray-800
                    "
                >
                    Company Profile 🏢
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage recruiter company information.
                </p>
            </div>

            <Card>
                <div className="space-y-4">
                    <p>
                        <strong>Company:</strong> SmartTech Pvt Ltd
                    </p>

                    <p>
                        <strong>Email:</strong> recruiter@gmail.com
                    </p>

                    <p>
                        <strong>Industry:</strong> Software Development
                    </p>

                    <p>
                        <strong>Location:</strong> Ahmedabad, India
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default RecruiterProfile;
