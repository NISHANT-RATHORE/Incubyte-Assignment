import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Candy, User, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.token);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 p-4">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50">

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-rose-500 to-pink-500 p-4 rounded-full shadow-lg mb-4 transform hover:scale-110 transition duration-300">
                        <Candy className="text-white" size={40} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Welcome Back!</h2>
                    <p className="text-gray-500 mt-2 font-medium">Sweet Shop Management</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-3 rounded mb-6 text-sm font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-rose-600 font-bold hover:text-rose-700 hover:underline transition">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}