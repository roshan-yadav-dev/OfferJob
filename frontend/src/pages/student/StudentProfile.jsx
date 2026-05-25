import Card from '../../components/common/Card';

function StudentProfile() {
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
                    My Profile 👤
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your profile details.
                </p>
            </div>

            <Card>
                <div className="space-y-4">
                    <p>
                        <strong>Name:</strong> Roshan Yadav
                    </p>

                    <p>
                        <strong>Email:</strong> student@gmail.com
                    </p>

                    <p>
                        <strong>Role:</strong> Student
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default StudentProfile;
