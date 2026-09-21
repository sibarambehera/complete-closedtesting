import { useState } from "react";
import { ArrowLeft, Upload, Smartphone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { uploadAppIcon } from "../../services/StorageService";
import { createDeveloperApp } from "../../services/AppService";

function AddApp() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    appName: "",
    packageName: "",
    playStoreUrl: "",
    description: "",
  });

  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear error when user starts correcting the field
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        icon: "Please select an image file.",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        icon: "Image size must be less than 2 MB.",
      }));
      return;
    }

    setErrors((previous) => ({
      ...previous,
      icon: "",
    }));

    // Keep the actual File for Firebase Storage upload
    setIconFile(file);

    // Create preview
    const reader = new FileReader();

    reader.onload = () => {
      setIconPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview(null);

    setErrors((previous) => ({
      ...previous,
      icon: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.appName.trim()) {
      newErrors.appName = "App name is required.";
    }

    const packageRegex =
      /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Package name is required.";
    } else if (!packageRegex.test(formData.packageName.trim())) {
      newErrors.packageName =
        "Enter a valid Android package name.";
    }

    const playStoreRegex =
      /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9._]+/;

    if (!formData.playStoreUrl.trim()) {
      newErrors.playStoreUrl = "Google Play URL is required.";
    } else if (!playStoreRegex.test(formData.playStoreUrl.trim())) {
      newErrors.playStoreUrl =
        "Enter a valid Google Play app URL.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  if (!user?.uid) {
    alert("Developer account information is missing. Please login again.");
    return;
  }

  try {
    setIsSaving(true);

    let iconData = null;

    // 1. Upload app icon if selected
    if (iconFile) {
      iconData = await uploadAppIcon(
        iconFile,
        user.uid
      );

      console.log("Icon uploaded successfully:", iconData);
    }

    // 2. Save app information to Firestore
    const result = await createDeveloperApp({
      developerUid: user.uid,
      appName: formData.appName,
      packageName: formData.packageName,
      playStoreUrl: formData.playStoreUrl,
      description: formData.description,
      iconUrl: iconData?.downloadUrl || "",
      iconStoragePath: iconData?.storagePath || "",
    });

    console.log("Developer app created:", result);

    alert("Android app added successfully!");

    // Go back to My Apps
    navigate("/developer/apps");

  } catch (error) {
    console.error("Add App error:", error);

    setErrors((previous) => ({
      ...previous,
      icon:
        error?.message ||
        "Failed to add the app. Please try again.",
    }));

  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/developer/apps")}
          >
            <ArrowLeft size={18} />
            Back to My Apps
          </button>

          <h1>Add Android App</h1>

          <p>
            Add your Android application to create a testing Testing Sprint.
          </p>
        </div>
      </div>

      <form
        className="form-card"
        onSubmit={handleSubmit}
      >

        <div className="form-section-title">
          <Smartphone size={20} />

          <div>
            <h2>Application Details</h2>

            <p>
              Enter the basic information about your Android app.
            </p>
          </div>
        </div>

        <div className="form-grid">

          {/* App Name */}

          <div className="form-group">
            <label>
              App Name <span>*</span>
            </label>

            <input
              type="text"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              placeholder="e.g. CRM Stock & Sale"
            />

            {errors.appName && (
              <small className="form-error">
                {errors.appName}
              </small>
            )}
          </div>

          {/* Package Name */}

          <div className="form-group">
            <label>
              Package Name <span>*</span>
            </label>

            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              onChange={handleChange}
              placeholder="e.g. com.company.myapp"
            />

            {errors.packageName && (
              <small className="form-error">
                {errors.packageName}
              </small>
            )}
          </div>

          {/* Play Store URL */}

          <div className="form-group full-width">
            <label>
              Google Play App URL <span>*</span>
            </label>

            <input
              type="url"
              name="playStoreUrl"
              value={formData.playStoreUrl}
              onChange={handleChange}
              placeholder="https://play.google.com/store/apps/details?id=..."
            />

            {errors.playStoreUrl ? (
              <small className="form-error">
                {errors.playStoreUrl}
              </small>
            ) : (
              <small>
                Enter the Google Play URL of your Android application.
              </small>
            )}
          </div>

          {/* Description */}

          <div className="form-group full-width">
            <label>
              App Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe your application..."
            />
          </div>

          {/* App Icon */}

          <div className="form-group full-width">
            <label>App Icon</label>

            <div className="upload-box">

              {iconPreview ? (
                <>
                  <img
                    src={iconPreview}
                    alt="App icon preview"
                    className="icon-preview"
                  />

                  <strong>
                    App icon selected
                  </strong>

                  <button
                    type="button"
                    className="remove-icon-button"
                    onClick={handleRemoveIcon}
                  >
                    <X size={15} />
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <Upload size={25} />

                  <strong>
                    Upload App Icon
                  </strong>

                  <span>
                    PNG or JPG, maximum 2 MB
                  </span>

                  <label className="file-button">
                    Choose File

                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleIconChange}
                    />
                  </label>
                </>
              )}

            </div>

            {errors.icon && (
              <small className="form-error">
                {errors.icon}
              </small>
            )}
          </div>

        </div>

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/developer/apps")}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={isSaving}
          >
            {isSaving ? "Uploading..." : "Add App"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddApp;