import { Routes, Route } from 'react-router-dom';

/* Layouts */
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

/* Common Pages */
import LandingPage from '../pages/common/LandingPage';
import Home from '../pages/common/Home';
import Jobs from '../pages/common/Jobs';

/* Auth Pages */
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

/* Error Pages */
import NotFound404 from '../pages/errors/NotFound404';
import Unauthorized401 from '../pages/errors/Unauthorized401';
import Forbidden403 from '../pages/errors/Forbidden403';
import ServerError500 from '../pages/errors/ServerError500';

/* Student Pages */
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentJobs from '../pages/student/StudentJobs';
import StudentApplications from '../pages/student/StudentApplications';
import StudentProfile from '../pages/student/StudentProfile';

/* Recruiter Pages */
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import PostJob from '../pages/recruiter/PostJob';
import Candidates from '../pages/recruiter/Candidates';
import RecruiterApplications from '../pages/recruiter/RecruiterApplications';
import RecruiterProfile from '../pages/recruiter/RecruiterProfile';

/* Routes */
import ProtectedRoute from '../middleware/ProtectedRoute';
import RoleRoute from '../middleware/RoleRoute';

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}

            <Route
                path="/"
                element={
                    <MainLayout>
                        <LandingPage />
                    </MainLayout>
                }
            />

            <Route
                path="/jobs"
                element={
                    <MainLayout>
                        <Jobs />
                    </MainLayout>
                }
            />

            <Route
                path="/login"
                element={
                    <MainLayout>
                        <Login />
                    </MainLayout>
                }
            />

            <Route
                path="/signup"
                element={
                    <MainLayout>
                        <Signup />
                    </MainLayout>
                }
            />

            {/* Student Routes */}

            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="student">
                            <DashboardLayout>
                                <StudentDashboard />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/jobs"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="student">
                            <DashboardLayout>
                                <StudentJobs />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/applications"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="student">
                            <DashboardLayout>
                                <StudentApplications />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/profile"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="student">
                            <DashboardLayout>
                                <StudentProfile />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />

            {/* Recruiter Routes */}

            <Route
                path="/recruiter/dashboard"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="recruiter">
                            <DashboardLayout>
                                <RecruiterDashboard />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recruiter/post-job"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="recruiter">
                            <DashboardLayout>
                                <PostJob />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/candidates"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="recruiter">
                            <DashboardLayout>
                                <Candidates />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/applications"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="recruiter">
                            <DashboardLayout>
                                <RecruiterApplications />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recruiter/profile"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="recruiter">
                            <DashboardLayout>
                                <RecruiterProfile />
                            </DashboardLayout>
                        </RoleRoute>
                    </ProtectedRoute>
                }
            />

            {/* Error Pages */}

            <Route
                path="/unauthorized"
                element={
                    <MainLayout>
                        <Unauthorized401 />
                    </MainLayout>
                }
            />

            <Route
                path="/forbidden"
                element={
                    <MainLayout>
                        <Forbidden403 />
                    </MainLayout>
                }
            />

            <Route
                path="/server-error"
                element={
                    <MainLayout>
                        <ServerError500 />
                    </MainLayout>
                }
            />

            {/* Catch-all 404 Route */}
            <Route
                path="*"
                element={
                    <MainLayout>
                        <NotFound404 />
                    </MainLayout>
                }
            />
        </Routes>
    );
}

export default AppRoutes;
