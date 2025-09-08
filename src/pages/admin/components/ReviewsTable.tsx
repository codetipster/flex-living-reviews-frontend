import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  Star, 
  Search, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Calendar,
  User,
  Building,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilteredReviews, useReviewApproval } from '@/hooks/use-reviews';
import { useReviewsStore, useReviewsActions } from '@/store/reviews.store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { REVIEW_CHANNELS, REVIEW_CATEGORIES } from '@/constants/api';

export function ReviewsTable() {
  const { ui, filters } = useReviewsStore();
  const actions = useReviewsActions();
  const filteredReviews = useFilteredReviews();
  const { toggleApproval, isPending } = useReviewApproval();
  
  const [localSearchTerm, setLocalSearchTerm] = useState(ui.searchTerm);
  const [localFilterRating, setLocalFilterRating] = useState<string>(filters.minRating?.toString() || 'all');
  const [localFilterChannel, setLocalFilterChannel] = useState<string>(filters.channel || 'all');
  const [localFilterCategory, setLocalFilterCategory] = useState<string>(filters.category || 'all');
  const [localFilterApproval, setLocalFilterApproval] = useState<string>(
    filters.isApprovedForPublic !== undefined 
      ? (filters.isApprovedForPublic ? 'approved' : 'pending')
      : 'all'
  );

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      actions.setSearchTerm(localSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearchTerm, actions]);

  // Sync local filters to global store
  React.useEffect(() => {
    const newFilters = {
      minRating: localFilterRating !== 'all' ? parseInt(localFilterRating) : undefined,
      channel: localFilterChannel !== 'all' ? localFilterChannel as any : undefined,
      category: localFilterCategory !== 'all' ? localFilterCategory as any : undefined,
      isApprovedForPublic: localFilterApproval !== 'all' ? (localFilterApproval === 'approved') : undefined,
    };
    actions.setFilters(newFilters);
  }, [localFilterRating, localFilterChannel, localFilterCategory, localFilterApproval, actions]);

  // Apply local filters
  const finalFilteredReviews = useMemo(() => {
    let filtered = [...filteredReviews];

    // Apply rating filter
    if (localFilterRating !== 'all') {
      const rating = parseInt(localFilterRating);
      filtered = filtered.filter(review => review.overallRating === rating);
    }

    // Apply channel filter
    if (localFilterChannel !== 'all') {
      filtered = filtered.filter(review => review.channel === localFilterChannel);
    }

    // Apply category filter
    if (localFilterCategory !== 'all') {
      filtered = filtered.filter(review => {
        const categoryValue = review.categories[localFilterCategory as keyof typeof review.categories];
        return categoryValue !== undefined && categoryValue > 0;
      });
    }

    // Apply approval filter
    if (localFilterApproval !== 'all') {
      const isApproved = localFilterApproval === 'approved';
      filtered = filtered.filter(review => review.isApprovedForPublic === isApproved);
    }

    return filtered;
  }, [filteredReviews, localFilterRating, localFilterChannel, localFilterCategory, localFilterApproval]);

  // Handle approval toggle
  const handleApprovalToggle = async (reviewId: string, currentApproval: boolean) => {
    try {
      await toggleApproval(reviewId, !currentApproval);
      toast.success(
        currentApproval 
          ? 'Review removed from public display' 
          : 'Review approved for public display'
      );
    } catch (error) {
      toast.error('Failed to update review approval');
    }
  };

  // Get rating badge variant
  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 4) return "default";
    if (rating >= 3) return "secondary";
    return "destructive";
  };

  // Get channel badge variant
  const getChannelBadgeVariant = (channel: string) => {
    switch (channel) {
      case REVIEW_CHANNELS.HOSTAWAY:
        return "default";
      case REVIEW_CHANNELS.GOOGLE:
        return "secondary";
      case REVIEW_CHANNELS.AIRBNB:
        return "outline";
      default:
        return "secondary";
    }
  };

  // Get unique values for filters
  const uniqueChannels = useMemo(() => {
    return Array.from(new Set(filteredReviews.map(r => r.channel)));
  }, [filteredReviews]);

  const uniqueCategories = useMemo(() => {
    return Object.keys(REVIEW_CATEGORIES);
  }, []);

  // Clear all filters
  const clearAllFilters = () => {
    setLocalSearchTerm('');
    setLocalFilterRating('all');
    setLocalFilterChannel('all');
    setLocalFilterCategory('all');
    setLocalFilterApproval('all');
    actions.setSearchTerm('');
    actions.resetFilters();
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return localSearchTerm || 
           localFilterRating !== 'all' || 
           localFilterChannel !== 'all' || 
           localFilterCategory !== 'all' || 
           localFilterApproval !== 'all';
  }, [localSearchTerm, localFilterRating, localFilterChannel, localFilterCategory, localFilterApproval]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Reviews Management</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {finalFilteredReviews.length} reviews
            </Badge>
            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews, guests, properties..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Rating Filter */}
          <Select value={localFilterRating} onValueChange={setLocalFilterRating}>
            <SelectTrigger>
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          {/* Channel Filter */}
          <Select value={localFilterChannel} onValueChange={setLocalFilterChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {uniqueChannels.map(channel => (
                <SelectItem key={channel} value={channel}>
                  {channel.charAt(0).toUpperCase() + channel.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={localFilterCategory} onValueChange={setLocalFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Approval Filter */}
          <Select value={localFilterApproval} onValueChange={setLocalFilterApproval}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>Property</span>
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Guest</span>
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Rating</span>
                  </div>
                </TableHead>
                <TableHead className="min-w-[300px]">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Review</span>
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Channel</TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Public</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalFilteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No reviews found</p>
                      {hasActiveFilters && (
                        <Button onClick={clearAllFilters} variant="outline" size="sm">
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                finalFilteredReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="max-w-[180px]">
                        <p className="truncate text-sm font-medium">{review.propertyName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[130px]">
                        <p className="truncate text-sm">{review.guestName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= review.overallRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                        <Badge 
                          variant={getRatingBadgeVariant(review.overallRating)} 
                          className="text-xs"
                        >
                          {review.overallRating.toFixed(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[280px]">
                        <p className="text-sm line-clamp-2 mb-2">
                          {review.reviewText}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(review.categories).map(([category, rating]) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category.replace('_', ' ')}: {(rating as number).toFixed(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getChannelBadgeVariant(review.channel)} className="text-xs">
                        {review.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {(() => {
                        try {
                          const date = new Date(review.submittedAt);
                          return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'MMM dd, yyyy');
                        } catch (error) {
                          return 'Invalid Date';
                        }
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={review.isApprovedForPublic}
                          onCheckedChange={() => handleApprovalToggle(review.id, review.isApprovedForPublic)}
                          disabled={isPending}
                        />
                        {review.isApprovedForPublic ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination would go here */}
        {finalFilteredReviews.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {finalFilteredReviews.length} of {filteredReviews.length} reviews
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
