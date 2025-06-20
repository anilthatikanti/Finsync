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
              {loading && <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>}

              Send Reset Link
            </button>
          </form>
          <div className="w-full max-w-[450px]">
            {errorMessage && (
              <div className="text-red-500 text-center mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="text-green-600 text-center mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                {successMessage}
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