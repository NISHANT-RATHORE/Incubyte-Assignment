import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Candy, UserCircle } from 'lucide-react';

export default function Navbar() {
    const { logout, user } = useContext(AuthContext);

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-rose-100 sticky top-0 z-40 px-4 py-3">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-gradient-to-tr from-rose-500 to-pink-500 p-2 rounded-lg shadow-md group-hover:scale-110 transition duration-300">
                        <Candy className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-purple-600">
                        SweetShop
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <UserCircle size={18} className="text-rose-500" />
                        <span className="text-sm font-medium">{user?.username}</span>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-full transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}