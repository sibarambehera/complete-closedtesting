import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    QrCode,
    Upload
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { uploadTesterUpiQr } from "../../services/StorageService";

import {
    updateTesterUpiQr
} from "../../services/AuthService";
function Profile() {

    const { user } = useAuth();
    const [uploadingQr, setUploadingQr] =
        useState(false);

    const [qrError, setQrError] =
        useState("");

    const [qrUrl, setQrUrl] =
        useState(user?.upiQrCodeUrl || "");

    const handleQrUpload = async (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            setQrError("");
            setUploadingQr(true);

            const uploadResult =
                await uploadTesterUpiQr(
                    file,
                    user.uid
                );

            await updateTesterUpiQr({
                employeeId:
                    user.employeeId,

                upiQrCodeUrl:
                    uploadResult.downloadUrl,

                upiQrCodeStoragePath:
                    uploadResult.storagePath
            });

            setQrUrl(
                uploadResult.downloadUrl
            );

            alert(
                "UPI QR uploaded successfully."
            );

        } catch (error) {

            console.error(
                "UPI QR upload failed:",
                error
            );

            setQrError(
                error?.message ||
                "Failed to upload UPI QR."
            );

        } finally {

            setUploadingQr(false);

            event.target.value = "";

        }
    };
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
                {/* UPI QR */}

                <div className="profile-upi-section">

                    <div className="profile-upi-header">

                        <div>

                            <h3>
                                UPI Payment QR
                            </h3>

                            <p>
                                Developers will use this QR
                                to send your daily testing payment.
                            </p>

                        </div>

                        <QrCode size={22} />

                    </div>


                    {qrUrl ? (

                        <div className="profile-upi-preview">

                            <img
                                src={qrUrl}
                                alt="UPI Payment QR"
                            />

                            <div>

                                <strong>
                                    UPI QR uploaded
                                </strong>

                                <p>
                                    Developers can use this QR
                                    for your Testing Sprint payments.
                                </p>

                                <label
                                    className="profile-upload-button"
                                >

                                    <Upload size={16} />

                                    {uploadingQr
                                        ? "Uploading..."
                                        : "Replace QR"}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleQrUpload
                                        }
                                        disabled={
                                            uploadingQr
                                        }
                                        hidden
                                    />

                                </label>

                            </div>

                        </div>

                    ) : (

                        <div className="profile-upi-empty">

                            <QrCode size={42} />

                            <h4>
                                Add your UPI QR
                            </h4>

                            <p>
                                Upload your UPI QR code so
                                developers can pay you directly.
                            </p>

                            <label
                                className="profile-upload-button"
                            >

                                <Upload size={16} />

                                {uploadingQr
                                    ? "Uploading..."
                                    : "Upload UPI QR"}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleQrUpload
                                    }
                                    disabled={
                                        uploadingQr
                                    }
                                    hidden
                                />

                            </label>

                        </div>

                    )}


                    {qrError && (

                        <p className="form-error">
                            {qrError}
                        </p>

                    )}

                </div>
            </div>

        </div>
    );
}

export default Profile;