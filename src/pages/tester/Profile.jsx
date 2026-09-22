import { User, Mail, Phone, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Profile() {

    const { user } = useAuth();

    return (
        <div className="dashboard-page">

            {/* Header */}

            <div className="page-header">

                <div>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        View your account information.
                    </p>

                </div>

            </div>


            {/* Profile */}

            <div className="form-card profile-card">

                {/* Profile Header */}

                <div className="profile-card-header">

                    <div className="profile-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "T"}
                    </div>

                    <div>

                        <h2>
                            {user?.name || "Tester"}
                        </h2>

                        <span className="profile-role">
                            Tester Account
                        </span>

                    </div>

                </div>


                {/* Profile Details */}

                <div className="profile-details">

                    <div className="profile-detail-item">

                        <div className="profile-detail-icon">
                            <User size={18} />
                        </div>

                        <div>

                            <span>
                                Name
                            </span>

                            <strong>
                                {user?.name || "-"}
                            </strong>

                        </div>

                    </div>


                    <div className="profile-detail-item">

                        <div className="profile-detail-icon">
                            <Mail size={18} />
                        </div>

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {user?.email || "-"}
                            </strong>

                        </div>

                    </div>


                    <div className="profile-detail-item">

                        <div className="profile-detail-icon">
                            <Phone size={18} />
                        </div>

                        <div>

                            <span>
                                Phone
                            </span>

                            <strong>
                                {user?.phone || "-"}
                            </strong>

                        </div>

                    </div>


                    <div className="profile-detail-item">

                        <div className="profile-detail-icon">
                            <ShieldCheck size={18} />
                        </div>

                        <div>

                            <span>
                                Account Status
                            </span>

                            <strong className="profile-status">
                                {user?.status || "active"}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;