import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Candy, User, Lock, Sparkles } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', formData);
            alert("Registered successfully! Please login.");
            navigate('/login');
        } catch (err) {
            alert('Registration failed. Username might be taken.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 p-4">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 relative overflow-hidden">

                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-rose-100 rounded-full opacity-50 blur-xl"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="bg-white p-4 rounded-full shadow-md mb-4 border-2 border-rose-100">
                        <Sparkles className="text-rose-500" size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Create Account</h2>
                    <p className="text-gray-500 mt-1">Join the Sweet Shop today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Choose Username"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all duration-200 font-medium text-gray-700"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                        </div>
                        <input
                            type="password"
                            placeholder="Choose Password"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all duration-200 font-medium text-gray-700"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up Now'}
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <Link to="/login" className="text-gray-500 hover:text-purple-600 text-sm font-semibold transition flex items-center justify-center gap-1">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}