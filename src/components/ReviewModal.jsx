import { useState } from 'react';
import StarRating from './StarRating';
import api from '../services/api';

export default function ReviewModal({ order, isOpen, onClose, onReviewSuccess }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return setError('Please select a rating');
        setLoading(true);
        setError('');

        try {
            // 1. Create the rating/review entry
            const res = await api.post('/reviews/rate', {
                productName: order.riceType,
                rating,
                bookingId: order._id,
                type: 'post_delivery'
            });

            // 2. Add the text review
            await api.patch(`/reviews/${res.data._id}/text`, {
                comment
            });

            // 3. Mark booking as reviewed
            // We'll need a backend route for this or handle it in the review controller
            // For now, assume it's handled or we'll just refresh.

            onReviewSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-6 text-white text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Your Feedback Matters!</h2>
                    <p className="text-violet-100 opacity-80 text-sm">Tell us how {order.riceType} was</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-100">{error}</div>}

                    <div className="flex flex-col items-center gap-2">
                        <label className="text-gray-700 font-bold uppercase text-xs tracking-widest">Your Rating</label>
                        <StarRating size="lg" onRate={setRating} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-700 font-bold uppercase text-xs tracking-widest">Share more details (Optional)</label>
                        <textarea
                            className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-violet-600 transition-all outline-none text-gray-700 h-32 resize-none"
                            placeholder="How was the quality? Did it meet your expectations?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all uppercase tracking-widest text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
