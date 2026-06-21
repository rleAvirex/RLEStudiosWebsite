'use client'

import { useState, useEffect } from 'react'
import { Star, Loader2, ThumbsUp, MessageSquare, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { type Review } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface ReviewsSectionProps {
  productId: string
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true)
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`)
        const data = await res.json()
        setReviews(data)
      } catch (e) {
        console.error('Failed to load reviews', e)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [productId])

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !title.trim() || !comment.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, rating, title, comment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit review')
      setReviews((prev) => [{ ...data.review, createdAt: data.review.createdAt || new Date().toISOString() }, ...prev])
      setName('')
      setRating(5)
      setTitle('')
      setComment('')
      setShowForm(false)
      toast({
        title: 'Review submitted!',
        description: 'Thanks for your feedback.',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to submit review',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Customer Reviews ({reviews.length})
        </h4>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg border-border text-xs"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X className="h-3.5 w-3.5 mr-1" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 mr-1" /> Write Review
            </>
          )}
        </Button>
      </div>

      {/* Add review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl bg-background border border-border space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="review-name" className="text-xs">
                Your Name
              </Label>
              <Input
                id="review-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John D."
                className="bg-card border-border rounded-lg h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rating</Label>
              <div className="flex items-center gap-1 h-9">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="review-title" className="text-xs">
              Title
            </Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Great script, highly recommend!"
              className="bg-card border-border rounded-lg h-9 text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="review-comment" className="text-xs">
              Review
            </Label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this script..."
              rows={3}
              maxLength={1000}
              className="w-full bg-card border border-border rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {comment.length}/1000
            </p>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 text-sm"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            Submit Review
          </Button>
        </form>
      )}

      {/* Rating summary */}
      {!loading && reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-background border border-border">
          <div className="flex flex-col items-center justify-center text-center sm:w-32 shrink-0">
            <div className="text-3xl font-bold text-primary">{avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(avgRating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/40'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">{reviews.length} reviews</div>
          </div>
          <Separator orientation="vertical" className="hidden sm:block bg-border" />
          <div className="flex-1 space-y-1">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 w-8">
                  {d.star}
                  <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                </span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl bg-background border border-border">
          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.slice(0, visibleCount).map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-xl bg-background border border-border space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-xs">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{review.name}</div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-2.5 w-2.5 ${
                            i < review.rating
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-sm font-medium">{review.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-1 pt-1">
                <button
                  onClick={async (e) => {
                    e.preventDefault()
                    // Optimistic update
                    setReviews((prev) =>
                      prev.map((r) =>
                        r.id === review.id ? { ...r, helpful: r.helpful + 1 } : r
                      )
                    )
                    try {
                      await fetch('/api/reviews/helpful', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reviewId: review.id }),
                      })
                    } catch {
                      // Revert on error
                      setReviews((prev) =>
                        prev.map((r) =>
                          r.id === review.id ? { ...r, helpful: r.helpful - 1 } : r
                        )
                      )
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ThumbsUp className="h-3 w-3 group-hover:scale-110 transition-transform" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
          {visibleCount < reviews.length && (
            <Button
              variant="outline"
              className="w-full rounded-lg border-border text-xs"
              onClick={() => setVisibleCount((c) => c + 5)}
            >
              Show More Reviews ({reviews.length - visibleCount} remaining)
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
