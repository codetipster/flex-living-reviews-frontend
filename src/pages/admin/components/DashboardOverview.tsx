import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  MessageSquare, 
  Building2,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { useDashboard, useReviewStats, useSyncReviews } from '@/hooks/use-reviews';
import { useReviewsStore, useReviewsActions } from '@/store/reviews.store';
import { LoadingSpinner, MetricCardSkeleton, ChartSkeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function DashboardOverview() {
  const { ui, filters, pagination } = useReviewsStore();
  const actions = useReviewsActions();
  const { data: dashboardData, isLoading, error, refetch } = useDashboard(filters, pagination);
  const stats = useReviewStats();
  const syncMutation = useSyncReviews();

  // Get unique properties for filter
  const properties = useMemo(() => {
    if (!dashboardData || typeof dashboardData !== 'object' || !('reviews' in dashboardData) || !Array.isArray(dashboardData.reviews)) return [];
    
    const uniqueProperties = Array.from(
      new Set(dashboardData.reviews.map(review => review.propertyName))
    );
    
    return [
      { id: 'all', name: 'All Properties' },
      ...uniqueProperties.map(name => ({ id: name, name }))
    ];
  }, [dashboardData]);

  // Handle sync reviews
  const handleSyncReviews = async () => {
    try {
      await syncMutation.mutateAsync();
      toast.success('Reviews synced successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to sync reviews');
    }
  };

  // Handle property filter change
  const handlePropertyChange = (propertyId: string) => {
    actions.setSelectedProperty(propertyId);
    if (propertyId === 'all') {
      actions.setFilters({ propertyName: undefined });
    } else {
      actions.setFilters({ propertyName: propertyId });
    }
  };

  // Handle export data
  const handleExportData = () => {
    if (!dashboardData || typeof dashboardData !== 'object' || !('reviews' in dashboardData) || !Array.isArray(dashboardData.reviews)) return;
    
    const csvContent = [
      ['Property', 'Guest', 'Rating', 'Review', 'Channel', 'Date', 'Approved'].join(','),
      ...dashboardData.reviews.map(review => [
        review.propertyName,
        review.guestName,
        review.overallRating,
        `"${review.reviewText.replace(/"/g, '""')}"`,
        review.channel,
        (() => {
          try {
            const date = new Date(review.submittedAt);
            return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd');
          } catch (error) {
            return 'Invalid Date';
          }
        })(),
        review.isApprovedForPublic ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your property reviews
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSyncReviews}
            disabled={syncMutation.isPending}
            variant="outline"
            size="sm"
          >
            {syncMutation.isPending ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Reviews
          </Button>
          
          <Button
            onClick={handleExportData}
            disabled={!dashboardData || typeof dashboardData !== 'object' || !('reviews' in dashboardData) || !Array.isArray(dashboardData.reviews) || !dashboardData.reviews.length}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Property Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by property:</span>
        </div>
        <Select value={ui.selectedProperty} onValueChange={handlePropertyChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => (
            <MetricCardSkeleton key={i} />
          ))
        ) : (
          <>
            <MetricCard
              title="Average Rating"
              value={String(stats.averageRating?.toFixed(1) || '0.0')}
              change={{ value: 0, period: "across all properties" }}
              icon={<Star className="h-4 w-4" />}
            />
            <MetricCard
              title="Total Reviews"
              value={String(stats.totalReviews || 0)}
              change={{ value: 0, period: "all time" }}
              icon={<MessageSquare className="h-4 w-4" />}
            />
            <MetricCard
              title="Approved Reviews"
              value={String(stats.approvedReviews || 0)}
              change={{ value: 0, period: "for public display" }}
              icon={<CheckCircle className="h-4 w-4" />}
            />
            <MetricCard
              title="Pending Reviews"
              value={String(stats.pendingReviews || 0)}
              change={{ value: 0, period: "awaiting approval" }}
              icon={<AlertTriangle className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))
        ) : (
          <>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Top Performing
                </CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  {dashboardData?.reviews?.length ? 
                    dashboardData.reviews.reduce((best, current) => 
                      current.overallRating > best.overallRating ? current : best
                    ).propertyName : 'No data'}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {dashboardData?.reviews?.length ? 
                    `${dashboardData.reviews.reduce((best, current) => 
                      current.overallRating > best.overallRating ? current : best
                    ).overallRating.toFixed(1)} avg rating` : 'No data'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  Most Reviews
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  {dashboardData?.reviews?.length ? 
                    Object.entries(
                      dashboardData.reviews.reduce((acc, review) => {
                        acc[review.propertyName] = (acc[review.propertyName] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).reduce((most, current) => 
                      current[1] > most[1] ? current : most
                    )[0] : 'No data'}
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {dashboardData?.reviews?.length ? 
                    `${Object.entries(
                      dashboardData.reviews.reduce((acc, review) => {
                        acc[review.propertyName] = (acc[review.propertyName] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).reduce((most, current) => 
                      current[1] > most[1] ? current : most
                    )[1]} total reviews` : 'No data'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">
                  Needs Attention
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">
                  {dashboardData?.reviews?.length ? 
                    dashboardData.reviews.reduce((worst, current) => 
                      current.overallRating < worst.overallRating ? current : worst
                    ).propertyName : 'No data'}
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {dashboardData?.reviews?.length ? 
                    `${dashboardData.reviews.reduce((worst, current) => 
                      current.overallRating < worst.overallRating ? current : worst
                    ).overallRating.toFixed(1)} avg rating` : 'No data'}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Detailed Analytics */}
      {dashboardData && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Rating Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Excellent (4.5-5.0)</span>
                  <Badge variant="secondary">{stats.ratingDistribution.excellent}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Good (3.5-4.4)</span>
                  <Badge variant="secondary">{stats.ratingDistribution.good}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-600">Average (2.5-3.4)</span>
                  <Badge variant="secondary">{stats.ratingDistribution.average}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">Poor (1.0-2.4)</span>
                  <Badge variant="secondary">{stats.ratingDistribution.poor}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Category Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.analytics && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cleanliness</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(dashboardData.analytics.categoryAverages.cleanliness / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {dashboardData.analytics.categoryAverages.cleanliness.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Communication</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(dashboardData.analytics.categoryAverages.communication / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {dashboardData.analytics.categoryAverages.communication.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">House Rules</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${(dashboardData.analytics.categoryAverages.respect_house_rules / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {dashboardData.analytics.categoryAverages.respect_house_rules.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
