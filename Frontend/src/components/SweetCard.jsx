import { useState } from 'react';
import api from '../api/axios';
import { ShoppingBag, Edit, Trash2, RotateCcw } from 'lucide-react';

export default function SweetCard({ sweet, refreshData, isAdmin }) {
    const [loading, setLoading] = useState(false);
    const [restockAmount, setRestockAmount] = useState(10);

    const handlePurchase = async () => {
        if(sweet.quantity <= 0) return;
        setLoading(true);
        try {
            await api.post(`/sweets/${sweet.id}/purchase`);
            refreshData();
        } catch (err) {
            alert('Purchase failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRestock = async () => {
        try {
            await api.post(`/sweets/${sweet.id}/restock`, { amount: parseInt(restockAmount) });
            refreshData();
        } catch (err) {
            alert('Restock failed');
        }
    };

    const handleDelete = async () => {
        if(!confirm("Delete this sweet?")) return;
        try {
            await api.delete(`/sweets/${sweet.id}`);
            refreshData();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const isOutOfStock = sweet.quantity === 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 group">
            <div className={`h-40 flex items-center justify-center transition-colors duration-300 ${isOutOfStock ? 'bg-gray-100' : 'bg-gradient-to-br from-rose-50 to-pink-100 group-hover:from-rose-100 group-hover:to-pink-200'}`}>
                <span className={`text-7xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : 'grayscale-0'}`}>
                    🍬
                </span>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1" title={sweet.name}>
                        {sweet.name}
                    </h3>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                        {sweet.category || 'Sweet'}
                    </span>
                </div>

                <div className="flex justify-between items-end mb-5">
                    <p className="text-2xl font-extrabold text-rose-600">
                        ${sweet.price.toFixed(2)}
                    </p>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-medium uppercase">Stock</p>
                        <p className={`font-bold ${isOutOfStock ? "text-red-500" : "text-gray-700"}`}>
                            {sweet.quantity} units
                        </p>
                    </div>
                </div>

                <button
                    onClick={handlePurchase}
                    disabled={isOutOfStock || loading}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all duration-200
                        ${isOutOfStock
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : 'bg-rose-500 hover:bg-rose-600 hover:shadow-lg active:scale-95'}`}
                >
                    {isOutOfStock ? 'Sold Out' : (
                        <>
                            <ShoppingBag size={18} /> Purchase
                        </>
                    )}
                </button>

                {isAdmin && (
                    <div className="mt-5 pt-4 border-t border-dashed border-gray-200 space-y-3 bg-gray-50 -mx-5 px-5 pb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Controls</p>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={restockAmount}
                                onChange={(e) => setRestockAmount(e.target.value)}
                                className="w-16 border border-gray-300 rounded-lg px-2 text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button onClick={handleRestock} className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-2 rounded-lg hover:bg-blue-200 flex-1 flex items-center justify-center gap-1 transition">
                                <RotateCcw size={14} /> Restock
                            </button>
                        </div>

                        <button onClick={handleDelete} className="w-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition font-medium flex items-center justify-center gap-1">
                            <Trash2 size={14} /> Delete Item
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}