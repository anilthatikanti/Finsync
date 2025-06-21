import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";

type ForgotPasswordInputs = {
  email: string;
};

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePasswordReset = async (data: ForgotPasswordInputs) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Use the main app's action code settings from the environment variable
    const actionCodeSettings = {
      url: import.meta.env.VITE_APP_ACTION_URL,
    };

    try {
      await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
      setSuccessMessage("Password reset link sent! Please check your email inbox (and spam folder).");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setErrorMessage("No account was found with this email address.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-poppins">
      <div className="w-full max-w-md">
        <div className="bg-stone-950 border-[10px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg px-4 py-2 mx-4">
          <div className="flex justify-center items-center mb-6 gap-3">
            <img src="/logos/finsync.png" className="w-[13%]" alt="Finsync Logo" />
            <h2 className="pt-4 pb-4 font-bold dark:text-gray-400 text-3xl cursor-default">
              Finsync
            </h2>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-2">
            Forgot Your Password?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No problem. Enter your email address below and we'll send you a link to reset it.
          </p>

          <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-4 text-left">
            <div>
              <label htmlFor="email" className="block mb-2 dark:text-gray-400 text-md">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "Email address is required." })}
                className="border p-3 shadow-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.email && (
                <p className="text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-4 p-3 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out flex justify-center items-center gap-3 disabled:opacity-75"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="w-full min-w-[300px] max-w-[450px]">
            {successMessage && (
              <div className="text-green-600 text-center mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="text-red-500 text-center mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="mt-6 text-sm">
            <Link to="/login" className="group text-blue-400 transition-all duration-100 ease-in-out">
              <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Back to Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 