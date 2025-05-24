import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

type LoginFormInputs = {
  email: string;
  password: string;
};

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  }, [])
  const handleLogin = async (data: { email: string; password: string }) => {
    // Suggested code may be subject to a license. Learn more: ~LicenseLog:1478446025.
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900 font-poppins">
      <div className=" h-fit gap-2">
        <div className="bg-stone-950 border-[10px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-8 sm:p-4 p-1 m-10">
          <div className="flex justify-center items-center mb-4 gap-3">
            <img src="/logos/finsync.png" className="w-[13%]" alt="finsync logo" />
            <h2 className="pt-4 pb-4 font-bold dark:text-gray-400 text-3xl cursor-default">Finsync</h2>
          </div>

          <form action="#" method="post" className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col justify-start items-start">
              <label htmlFor="email" className="mb-2 dark:text-gray-400 text-md">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                {...register('email', { required: true })}
                className="border p-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.email && <p className="text-red-500">Email is required.</p>}
            </div>

            <div className="flex flex-col justify-start items-start">
              <label htmlFor="password" className="mb-2 dark:text-gray-400 text-md">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                {...register('password', { required: true })}
                className="border p-2 shadow-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
              {errors.password && <p className="text-red-500">Password is required.</p>}
            </div>

            <a href="#" className="group text-blue-400 transition-all duration-100 ease-in-out text-sm">
              <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Forget your password?
              </span>
            </a>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-outflex flex justify-center items-center gap-3"
            >
              {loading && <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>}
              LOG IN
            </button>
          </form>

          <div className="flex flex-col mt-4 items-center justify-center text-sm">
            <h3 className="dark:text-gray-300">
              Don't have an account?
              <a href="#" className="group text-blue-400 transition-all duration-100 ease-in-out">
                <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  {" "}Sign Up
                </span>
              </a>
            </h3>
          </div>

          {/* Third Party Auth */}
          <div className="flex flex-row items-center justify-between mt-5">
            {[
              { src: "https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/", alt: "Google" },
              { src: "https://img.icons8.com/color/48/microsoft.png", alt: "Microsoft" },

              // { src: "https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/", alt: "Linkedin" },
              // { src: "https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/", alt: "Github", darkInvert: true },
              // { src: "https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/", alt: "Facebook" },
              // { src: "https://ucarecdn.com/82d7ca0a-c380-44c4-ba24-658723e2ab07/", alt: "Twitter" },
              // { src: "https://ucarecdn.com/3277d952-8e21-4aad-a2b7-d484dad531fb/", alt: "Apple" },
            ].map(({ src, alt }) => (
              <button key={alt} className=" hover:scale-105 dark:bg-gray-800 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1 w-full flex justify-center">
                <img className="`max-w-[25px] h-[25px]" src={src} alt={alt} />
              </button>
            ))}
          </div>

          <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
            <p className="cursor-default">
              By signing in, you agree to our{" "}
              <a href="#" className="group text-blue-400 transition-all duration-100 ease-in-out">
                <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Terms
                </span>
              </a>{" "}
              and{" "}
              <a href="#" className="group text-blue-400 transition-all duration-100 ease-in-out">
                <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Privacy Policy
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}