import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { auth } from "../../services/firebase";

export const EmailActionHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("An unknown error occurred.");

  useEffect(() => {
    const handleAction = async () => {
      const mode = searchParams.get("mode");
      const actionCode = searchParams.get("oobCode");

      if (!mode || !actionCode) {
        setError("Invalid request. Missing required parameters.");
        setStatus("error");
        return;
      }

      try {
        switch (mode) {
          case "verifyEmail":
            // Verify the action code is valid before applying it
            await checkActionCode(auth, actionCode);
            // Apply the action code to verify the email
            await applyActionCode(auth, actionCode);
            setStatus("success");
            // Redirect to login with a success indicator
            navigate("/login?verified=true", { replace: true });
            break;
          
          case "resetPassword":
            // The user has clicked the password reset link.
            // We'll just show them the UI to enter a new password.
            // No need to verify the code here, the ResetPassword component will do that.
            navigate(`/reset-password?oobCode=${actionCode}`, { replace: true });
            break;

          default:
            throw new Error("Unsupported action mode.");
        }
      } catch (err: any) {
        let errorMessage = "Your request is invalid or has expired. Please try again.";
        if (err.code === "auth/invalid-action-code") {
           errorMessage = "The verification link is invalid or has already been used. Please request a new one."
        }
        setError(errorMessage);
        setStatus("error");
      }
    };

    handleAction();
  }, [navigate, searchParams]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <>
          <h3 className="text-2xl font-bold dark:text-gray-300 mb-4">
            Verifying your email...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please wait while we confirm your email address.
          </p>
          <div role="status" className="flex justify-center">
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </>
      );
    }
    else if (status === "error") {
      return (
        <>
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Verification Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:scale-105"
          >
            Back to Login
          </Link>
        </>
      );
    }
    return null; // Should be redirected on success
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-poppins">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border-[10px] border-transparent rounded-[20px] shadow-lg px-6 py-8 mx-4 text-center">
          <div className="flex justify-center items-center mb-6 gap-3">
            <img
              src="/logos/finsync.png"
              className="w-[13%]"
              alt="finsync logo"
            />
            <h2 className="pt-4 pb-4 font-bold dark:text-gray-400 text-3xl cursor-default">
              Finsync
            </h2>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}; 