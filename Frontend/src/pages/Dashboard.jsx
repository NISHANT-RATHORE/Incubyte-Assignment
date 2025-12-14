import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import SweetCard from '../components/SweetCard';
import Navbar from '../components/Navbar';
import { Plus, Search, X } from 'lucide-react';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [sweets, setSweets] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' });

    const isAdmin = user?.username === 'admin_user' || user?.role === 'ROLE_ADMIN';

    const fetchSweets = async () => {
        try {
            const url = search ? `/sweets/search?name=${search}` : '/sweets';
            const res = await api.get(url);
            setSweets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, [search]);

    const handleAddSweet = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sweets', newSweet);
            setShowAddModal(false);
            setNewSweet({ name: '', category: '', price: '', quantity: '' });
            fetchSweets();
        } catch (err) {
            alert('Failed to add sweet');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Available Sweets</h1>
                        <p className="text-gray-500 mt-1">Browse our delicious collection</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search candies..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus size={20} /> <span className="hidden sm:inline">Add Sweet</span>
                            </button>
                        )}
                    </div>
                </div>

                {sweets.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No sweets found...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sweets.map(sweet => (
                            <SweetCard key={sweet.id} sweet={sweet} refreshData={fetchSweets} isAdmin={isAdmin} />
                        ))}
                    </div>
                )}
            </main>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Sweet</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSweet} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input placeholder="e.g. Chocolate Frog" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                                       onChange={e => setNewSweet({...newSweet, name: e.target.value})} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input placeholder="e.g. Chocolate" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                                       onChange={e => setNewSweet({...newSweet, category: e.target.value})} />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input type="number" step="0.01" placeholder="0.00" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                                           onChange={e => setNewSweet({...newSweet, price: e.target.value})} required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input type="number" placeholder="0" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                                           onChange={e => setNewSweet({...newSweet, quantity: e.target.value})} required />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 shadow-lg hover:shadow-xl transition">
                                    Save Sweet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}