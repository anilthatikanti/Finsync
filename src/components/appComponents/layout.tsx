import { useState } from "react";
import { auth } from "../../services/firebase";
import { Link } from "react-router-dom";


// Suggested code may be subject to a license. Learn more: ~LicenseLog:2178669571.
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="h-screen w-full dark:bg-gray-900 font-poppins flex flex-col">
            <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="w-full flex flex-wrap items-center justify-between  p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/logos/finsync.png" className="h-8" alt="Finsync Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Finsync</span>
                    </a>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-expanded={isMenuOpen}
                    ><span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-multi-level">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <Link to="/" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page">Watch List</Link>
                            </li>
                            <li>
                                <Link to="/storage/64e4a5f7c25e4b0a2c9d1234" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Data vault</Link>
                            </li>
                            <li>
                                <Link to="/bin/64e4a5f7c25e4b0a2c9d5678" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Trash</Link>
                            </li>
                            <li>
                                <a onClick={()=>{auth.signOut()}} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="p-4 flex-1 w-full h-full overflow-auto">
                {children}
            </div>
        </div>
    )
}