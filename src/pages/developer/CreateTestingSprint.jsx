import { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Users,
    Target,
    FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createTestingSprint } from "../../services/AppService";
import {
    createMockPayment,
    markMockPaymentSuccess,
} from "../../services/PaymentService";

function CreateTestingSprint() {

    const { user } = useAuth();

    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const { appId } = useParams();

    const [formData, setFormData] = useState({
        durationDays: 14,
        testerRequired: 20,
        testingGoal: "",
        instructions: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.testerRequired) {
            newErrors.testerRequired =
                "Number of testers is required.";
        } else if (
            Number(formData.testerRequired) < 1
        ) {
            newErrors.testerRequired =
                "At least 1 tester is required.";
        }

        if (!formData.testingGoal.trim()) {
            newErrors.testingGoal =
                "Testing goal is required.";
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
            alert(
                "Developer account information is missing. Please login again."
            );
            return;
        }

        if (!appId) {
            alert("App information is missing.");
            return;
        }

        try {
            setIsSaving(true);

            // ---------------------------------------
            // STEP 1: Create temporary mock payment
            // ---------------------------------------

            const paymentResult = await createMockPayment({
                developerUid: user.uid,
                appId,
                amount: 200,
            });

            console.log(
                "Mock payment created:",
                paymentResult
            );

            if (!paymentResult.success) {
                throw new Error(
                    "Payment was not successful."
                );
            }

            // ---------------------------------------
            // STEP 2: Create Testing Sprint
            // ---------------------------------------

            const sprintResult =
                await createTestingSprint({
                    developerUid: user.uid,
                    appId,
                    durationDays: formData.durationDays,
                    testerRequired: formData.testerRequired,
                    testingGoal: formData.testingGoal,
                    instructions: formData.instructions,
                    paymentId: paymentResult.paymentId,
                });

            console.log(
                "Testing Sprint created:",
                sprintResult
            );

            // ---------------------------------------
            // STEP 3: Mark payment as successful
            // ---------------------------------------

            await markMockPaymentSuccess({
                paymentId: paymentResult.paymentId,
                sprintId: sprintResult.sprintId,
            });

            console.log(
                "Mock payment marked as paid."
            );

            // ---------------------------------------
            // STEP 4: Success
            // ---------------------------------------

            alert(
                "Payment successful! Testing Sprint created successfully."
            );

            navigate(
                `/developer/testing-sprints/${sprintResult.sprintId}`
            );

        } catch (error) {
            console.error(
                "Create Testing Sprint error:",
                error
            );

            alert(
                error?.message ||
                "Payment or Testing Sprint creation failed. Please try again."
            );

        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="dashboard-page">

            <div className="page-header">
                <div>

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate(
                                `/developer/apps/${appId}`
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to App
                    </button>

                    <h1>Create Testing Sprint</h1>

                    <p>
                        Set up a 14-day testing sprint for your Android application.
                    </p>

                </div>
            </div>

            <form
                className="form-card"
                onSubmit={handleSubmit}
            >

                {/* Sprint Duration */}

                <div className="form-section-title">

                    <CalendarDays size={20} />

                    <div>
                        <h2>Sprint Duration</h2>

                        <p>
                            Complete ClosedTesting uses a 14-day testing sprint.
                        </p>
                    </div>

                </div>

                <div className="form-grid">

                    <div className="form-group">

                        <label>
                            Duration
                        </label>

                        <select
                            name="durationDays"
                            value={formData.durationDays}
                            onChange={handleChange}
                        >
                            <option value={14}>
                                14 Days
                            </option>
                        </select>

                    </div>

                    {/* Tester Requirement */}

                    <div className="form-group">

                        <label>
                            Testers Required <span>*</span>
                        </label>

                        <div className="input-with-icon">

                            <Users size={18} />

                            <input
                                type="number"
                                name="testerRequired"
                                min="1"
                                value={formData.testerRequired}
                                onChange={handleChange}
                                placeholder="e.g. 20"
                            />

                        </div>

                        {errors.testerRequired && (
                            <small className="form-error">
                                {errors.testerRequired}
                            </small>
                        )}

                    </div>

                    {/* Testing Goal */}

                    <div className="form-group full-width">

                        <label>
                            Testing Goal <span>*</span>
                        </label>

                        <div className="input-with-icon textarea-icon">

                            <Target size={18} />

                            <textarea
                                rows="4"
                                name="testingGoal"
                                value={formData.testingGoal}
                                onChange={handleChange}
                                placeholder="What would you like testers to focus on?"
                            />

                        </div>

                        {errors.testingGoal && (
                            <small className="form-error">
                                {errors.testingGoal}
                            </small>
                        )}

                    </div>

                    {/* Instructions */}

                    <div className="form-group full-width">

                        <label>
                            Tester Instructions
                        </label>

                        <div className="input-with-icon textarea-icon">

                            <FileText size={18} />

                            <textarea
                                rows="5"
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                placeholder="Provide any specific instructions for testers..."
                            />

                        </div>

                    </div>

                </div>

                {/* Sprint Summary */}

                <div className="sprint-summary">

                    <h3>Sprint Summary</h3>

                    <div className="sprint-summary-grid">

                        <div>
                            <span>Duration</span>
                            <strong>14 Days</strong>
                        </div>

                        <div>
                            <span>Testers Required</span>
                            <strong>
                                {formData.testerRequired}
                            </strong>
                        </div>

                        <div>
                            <span>Tester Payout</span>
                            <strong>₹100 / tester</strong>
                        </div>

                        <div>
                            <span>Platform Charge</span>
                            <strong>₹200</strong>
                        </div>

                        <div>
                            <span>Pay Now</span>
                            <strong>₹200</strong>
                        </div>

                        <div>
                            <span>Platform</span>
                            <strong>Android</strong>
                        </div>

                    </div>

                    <div className="payment-note">
                        <strong>Payment Information</strong>

                        <p>
                            <strong>
                                The ₹200 platform charge is payable now to
                                Complete ClosedTesting as platform charge.
                            </strong>
                        </p>

                        <p>
                            <strong>
                                Tester payments are separate. You will pay ₹100 directly to each tester after/before they complete the required testing as per your convenience.
                            </strong>
                        </p>
                    </div>

                </div>

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate(`/developer/apps/${appId}`)
                        }
                        disabled={isSaving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isSaving}
                    >
                        {isSaving ? "Processing..." : "Proceed to Payment"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateTestingSprint;