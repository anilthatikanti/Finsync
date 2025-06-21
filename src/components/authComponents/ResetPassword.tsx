import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../services/firebase";

type ResetPasswordInputs = {
  newPassword: string;
  confirmPassword: string;
};

export const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const oobCode = searchParams.get("oobCode");

  const handlePasswordReset = async (data: ResetPasswordInputs) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!oobCode) {
      setErrorMessage("Invalid request. The reset link is missing necessary information.");
      setLoading(false);
      return;
    }

    try {
      // First, verify the code is valid. This prevents the user from typing a new password if the code is bad.
      await verifyPasswordResetCode(auth, oobCode);
      
      // If the code is valid, proceed with confirming the new password.
      await confirmPasswordReset(auth, oobCode, data.newPassword);
      setSuccessMessage("Your password has been reset successfully! You can now log in with your new password.");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 4000);

    } catch (err: any) {
      if (err.code === "auth/invalid-action-code") {
        setErrorMessage("The password reset link is invalid or has expired. Please request a new one.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Disable the form after successful submission
  if (successMessage) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-poppins">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 border-[10px] border-transparent rounded-[20px] shadow-lg px-6 py-8 mx-4 text-center">
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Success!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{successMessage}</p>
                    <Link to="/login" className="group text-blue-400 transition-all duration-100 ease-in-out">
                        <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                            Proceed to Login
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-poppins">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border-[10px] border-transparent rounded-[20px] shadow-lg px-6 py-8 mx-4">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-300 mb-6">Reset Your Password</h3>
          
          <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block mb-2 dark:text-gray-400 text-md">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                {...register("newPassword", { required: "New password is required.", minLength: { value: 6, message: "Password must be at least 6 characters." } })}
                className="border p-3 shadow-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.newPassword && (
                <p className="text-red-500 mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 dark:text-gray-400 text-md">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { 
                    required: "Please confirm your password.", 
                    validate: (value) => value === watch('newPassword') || "Passwords do not match."
                })}
                className="border p-3 shadow-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-4 p-3 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out flex justify-center items-center gap-3 disabled:opacity-75"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {errorMessage && (
            <div className="text-red-500 text-center mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 