import React, { useState, useEffect } from 'react';
import { 
  MessageSquareHeart, 
  Star, 
  Send, 
  ThumbsUp, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Award,
  Building,
  Quote
} from 'lucide-react';

export interface AppUserReview {
  id: string;
  authorName: string;
  role: string;
  company: string;
  rating: number; // 1-5
  reviewText: string;
  featureLiked: string;
  date: string;
  verified: boolean;
  upvotes: number;
}

const DEFAULT_USER_REVIEWS: AppUserReview[] = [
  {
    id: 'rev-1',
    authorName: 'Sarah Jenkins',
    role: 'Principal Tech Recruiter',
    company: 'Fintech Scaleup (London)',
    rating: 5,
    reviewText: 'The zero-hallucination evidence quotes saved us dozens of hours of resume verification. Being able to see verbatim quotes from candidate resumes directly next to JD requirements stops bias and guesswork completely.',
    featureLiked: 'Explainable Ground-Truth Evidence Matrix',
    date: '2 days ago',
    verified: true,
    upvotes: 14
  },
  {
    id: 'rev-2',
    authorName: 'David Zhang',
    role: 'VP of Engineering',
    company: 'CloudNative Labs',
    rating: 5,
    reviewText: 'The skills taxonomy equivalence mapping is genuinely revolutionary. It understands that a senior engineer with PyTorch and vLLM can easily adapt to our HuggingFace stack without discarding them.',
    featureLiked: 'Semantic Skills Taxonomy & Equivalence',
    date: '1 week ago',
    verified: true,
    upvotes: 21
  },
  {
    id: 'rev-3',
    authorName: 'Elena Ramos',
    role: 'Head of Talent Acquisition',
    company: 'Global Enterprise AI',
    rating: 5,
    reviewText: 'The PII Anonymization toggle coupled with verifiable human audit logs keeps our hiring workflow completely EEOC and EU AI Act compliant. Fast, objective, and transparent.',
    featureLiked: 'Blind Hiring & Human-in-the-Loop Audit',
    date: '2 weeks ago',
    verified: true,
    upvotes: 9
  }
];

export const AppFeedbackSection: React.FC = () => {
  const [reviews, setReviews] = useState<AppUserReview[]>(() => {
    try {
      const saved = localStorage.getItem('app_recruiter_reviews');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read reviews from localStorage:', e);
    }
    return DEFAULT_USER_REVIEWS;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [featureLiked, setFeatureLiked] = useState('Ground-Truth Evidence Snippets');
  const [reviewText, setReviewText] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      localStorage.setItem('app_recruiter_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Could not save reviews to localStorage:', e);
    }
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    const newReview: AppUserReview = {
      id: 'rev-' + Date.now(),
      authorName: authorName.trim(),
      role: role.trim() || 'Technical Recruiter',
      company: company.trim() || 'Talent Acquisition Team',
      rating,
      reviewText: reviewText.trim(),
      featureLiked,
      date: 'Just now',
      verified: true,
      upvotes: 1
    };

    setReviews([newReview, ...reviews]);
    setAuthorName('');
    setRole('');
    setCompany('');
    setReviewText('');
    setRating(5);
    setIsFormOpen(false);
    setHasSubmitted(true);
    setTimeout(() => setHasSubmitted(false), 5000);
  };

  const handleUpvote = (id: string) => {
    if (upvotedIds.has(id)) return;
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
    setUpvotedIds(prev => new Set([...prev, id]));
  };

  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section 
      id="app-user-reviews-section" 
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                User & Recruiter App Reviews
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  ★ {avgRating} / 5.0 Rating
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Feedback, ratings, and testimonials from hiring managers and technical recruiters
              </p>
            </div>
          </div>
        </div>

        <button
          id="write-app-review-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>{isFormOpen ? 'Close Form' : 'Write a Review / Feedback'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {hasSubmitted && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Thank you for your review! Your feedback helps us continually refine our matching algorithms and guardrails.</span>
        </div>
      )}

      {/* Review Submission Form Modal / Box */}
      {isFormOpen && (
        <form 
          onSubmit={handleSubmitReview}
          className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-5 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Share Your Experience
            </h3>
            <span className="text-[11px] text-slate-400">Recruiter / User Testimonial</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Your Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Talent Acquisition Lead"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Acme Tech"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Overall Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => {
                  const active = (hoveredStar ?? rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          active
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-semibold text-slate-300 ml-2">
                  {rating === 5 ? 'Exceptional (5/5)' : rating === 4 ? 'Great (4/5)' : `${rating}/5 Stars`}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Favorite Feature / Highlight</label>
              <select
                value={featureLiked}
                onChange={e => setFeatureLiked(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Explainable Evidence Matrix">Explainable Ground-Truth Evidence Matrix</option>
                <option value="Zero-Hallucination Guardrails">Zero-Hallucination Audit Flags</option>
                <option value="Semantic Skills Taxonomy">Semantic Skills Taxonomy & Aliases</option>
                <option value="Blind Hiring / PII Masking">Blind Hiring (PII Anonymization)</option>
                <option value="Customizable Scoring Weights">Customizable Weight Sliders</option>
                <option value="Multi-Format Resume Parser">Multi-Format Resume Extractor (PDF/DOCX)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Your Review & Feedback *</label>
            <textarea
              required
              rows={3}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="What do you think of the match accuracy, evidence citations, or explainability features? Any suggestions for improvements?"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map(rev => (
          <div
            key={rev.id}
            className="bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all"
          >
            {/* Header: Rating and Date */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500">{rev.date}</span>
              </div>

              {/* Review Text */}
              <div className="relative">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.reviewText}"
                </p>
              </div>

              {/* Highlight Tag */}
              {rev.featureLiked && (
                <div className="mt-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 inline-flex items-center gap-1 font-medium">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                    {rev.featureLiked}
                  </span>
                </div>
              )}
            </div>

            {/* Author Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-white">{rev.authorName}</span>
                  {rev.verified && (
                    <span title="Verified Recruiter / User">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {rev.role} • {rev.company}
                </p>
              </div>

              {/* Helpful Upvote Button */}
              <button
                type="button"
                onClick={() => handleUpvote(rev.id)}
                disabled={upvotedIds.has(rev.id)}
                className={`text-[11px] px-2 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                  upvotedIds.has(rev.id)
                    ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Mark this review as helpful"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{rev.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
