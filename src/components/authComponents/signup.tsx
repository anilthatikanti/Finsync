import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, signOut, GithubAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

type SignupFormInputs = {
  email: string;
  password: string;
  verifyPassword: string;
};

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();
  const [loading, setLoading] = useState(false);
  const [thirdPartyError, setThirdPartyError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {}, []);
  
  const handleSignup = async (data: { email: string; password: string;verifyPassword:string }) => {
    setLoading(true);
    setThirdPartyError(null);
    
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.verifyPassword);
      const user = userCredential.user;
      
      // Define the dynamic action code settings for this app
      const actionCodeSettings = {
        url: import.meta.env.VITE_APP_ACTION_URL,
      };
      
      // Send verification email with the custom URL
      await sendEmailVerification(user, actionCodeSettings);
      
      // Logout the user immediately
      await signOut(auth);
      
      // Redirect to the login page with a success flag
      navigate("/login?from=signup", { replace: true });
            
    } catch (err: any) {
      const shortCode = err.code.split("/")[1];
      setThirdPartyError(shortCode);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setThirdPartyError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error: any) {
      setThirdPartyError(error.message || "Google signup failed");
    }
  };

  const handleGithubSignup = async () => {
    setThirdPartyError(null);
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error: any) {
      setThirdPartyError(error.message || "GitHub signup failed");
      console.error("GitHub signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-poppins">
      <div className="w-full max-w-md">
        <div className="bg-stone-950 border-[10px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg px-4 py-2 mx-4">
          <div className="flex justify-center items-center mb-4 gap-3">
            <img
              src="/logos/finsync.png"
              className="w-[13%]"
              alt="finsync logo"
            />
            <h2 className="pt-4 pb-4 font-bold dark:text-gray-400 text-3xl cursor-default">
              Finsync
            </h2>
          </div>

          <form
            action="#"
            method="post"
            className="space-y-2"
            onSubmit={handleSubmit(handleSignup)}
          >
            <div className="flex flex-col justify-start items-start">
              <label
                htmlFor="email"
                className="mb-2 dark:text-gray-400 text-md"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="border p-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.email && (
                <p className="text-red-500">Email is required.</p>
              )}
            </div>

            <div className="flex flex-col justify-start items-start">
              <label
                htmlFor="password"
                className="mb-2 dark:text-gray-400 text-md"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
                className="border p-2 shadow-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.password && (
                <p className="text-red-500">Password is required.</p>
              )}
            </div>
            <div className="flex flex-col justify-start items-start">
              <label
                htmlFor="verifyPassword"
                className="mb-2 dark:text-gray-400 text-md"
              >
                Verify Password
              </label>
              <input
                id="verifypassword"
                type="password"
                placeholder="Re-Password"
                {...register("verifyPassword", {
                  required: "Please re-enter your password.",
                  validate: (value, formValues) => {
                    return (
                      value === formValues.password || "Passwords do not match."
                    );
                  },
                })}
                className="border p-2 shadow-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.verifyPassword && (
                <p className="text-red-500">{errors.verifyPassword.message}</p>
              )}
            </div>

            <a
              href="#"
              className="group text-blue-400 transition-all duration-100 ease-in-out text-sm"
            >
              <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Forget your password?
              </span>
            </a>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-4 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-outflex flex justify-center items-center gap-3 disabled:opacity-75"
            >
              {loading && (
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              )}
              SIGN UP
            </button>
          </form>

          <div className="flex flex-col mt-4 items-center justify-center text-sm">
            <h3 className="dark:text-gray-300">
              Already have an account?
              <Link
                to="/login"
                className="group text-blue-400 transition-all duration-100 ease-in-out"
              >
                <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  {" "}Login
                </span>
              </Link>
            </h3>
          </div>

          {/* Third Party Auth */}
          <div className="flex flex-row items-center justify-between mt-5">
            <button
              onClick={handleGoogleSignup}
              className="hover:scale-105 dark:bg-gray-800 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1 w-full flex justify-center cursor-pointer"
              disabled={loading}
            >
              <img className="max-w-[25px] h-[25px]" src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/" alt="Google" />
            </button>
            <button
              onClick={handleGithubSignup}
              className="hover:scale-105 dark:bg-gray-800 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1 w-full flex justify-center cursor-pointer"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
            <p className="cursor-default">
              By signing in, you agree to our{" "}
              <Link
                to="#"
                className="group text-blue-400 transition-all duration-100 ease-in-out"
              >
                <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Terms
                </span>
              </Link>{" "}
              and{" "}
              <Link
                to="#"
                className="group text-blue-400 transition-all duration-100 ease-in-out"
              >
                <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Privacy Policy
                </span>
              </Link>
            </p>
          </div>
<div className="w-full min-w-[300px] max-w-[450px]">

          {thirdPartyError && (
            <div className="text-red-500 text-center mt-2">{thirdPartyError}</div>
          )}
</div>

        </div>
      </div>
    </div>
  );
};
