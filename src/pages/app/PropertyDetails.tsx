import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Wifi, Car, Coffee, Dumbbell, Utensils, Waves, Mountain, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "./components/Header";
import { BookingCard } from "./components/BookingCard";
import { reviewsService } from "@/services/api/reviews.service";
import { StayPolicy } from "./components/StayPolicy";

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  rating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  guestName: string;
  reviewText: string;
  overallRating: number;
  categories: {
    cleanliness?: number;
    communication?: number;
    respect_house_rules?: number;
  };
  date: string;
  submittedAt?: string;
  channel: string;
}

const mockProperties: Record<string, Property> = {
  "2B N1 A - 29 Shoreditch Heights": {
    id: "1",
    name: "2B N1 A - 29 Shoreditch Heights",
    location: "Shoreditch, London",
    description: "Experience the vibrant heart of London in this stunning 2-bedroom apartment. Located in the trendy Shoreditch district, this modern space offers the perfect blend of comfort and style. With high-speed WiFi, fully equipped kitchen, and contemporary furnishings, it's ideal for both business travelers and leisure guests.",
    price: 180,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Parking", "Gym", "Pool", "Restaurant", "Beach Access", "Mountain View"],
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    rating: 4.8,
    reviewCount: 127
  },
  "1B E2 B - 15 Canary Wharf Tower": {
    id: "2",
    name: "1B E2 B - 15 Canary Wharf Tower",
    location: "Canary Wharf, London",
    description: "Luxury living in the heart of London's financial district. This elegant 1-bedroom apartment offers stunning views of the Thames and modern amenities. Perfect for business travelers with its proximity to major offices and excellent transport links.",
    price: 220,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Parking", "Gym", "Pool", "Restaurant"],
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    rating: 4.6,
    reviewCount: 89
  },
  "Studio S3 C - 42 London Bridge": {
    id: "3",
    name: "Studio S3 C - 42 London Bridge",
    location: "London Bridge, London",
    description: "Compact and stylish studio apartment in the historic London Bridge area. This modern space maximizes every square foot with smart storage solutions and contemporary design. Ideal for solo travelers or couples exploring London.",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Kitchen", "Parking"],
    bedrooms: 0,
    bathrooms: 1,
    guests: 2,
    rating: 4.2,
    reviewCount: 45
  }
};

const amenityIcons: Record<string, any> = {
  "WiFi": Wifi,
  "Kitchen": Utensils,
  "Parking": Car,
  "Gym": Dumbbell,
  "Pool": Waves,
  "Restaurant": Coffee,
  "Beach Access": Waves,
  "Mountain View": Mountain
};

export function PropertyDetail() {
  const { propertyName } = useParams<{ propertyName: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propertyName) {
      const decodedPropertyName = decodeURIComponent(propertyName);
      const foundProperty = mockProperties[decodedPropertyName];
      if (foundProperty) {
        setProperty(foundProperty);
      }
    }
  }, [propertyName]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!propertyName) return;
        
        const data = await reviewsService.getPublicReviews(propertyName);
        const mappedReviews = (data.reviews || []).map(review => ({
          ...review,
          date: typeof review.submittedAt === 'string' ? review.submittedAt : new Date().toISOString(),
          submittedAt: typeof review.submittedAt === 'string' ? review.submittedAt : new Date().toISOString()
        }));
        setReviews(mappedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyName]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  // const getCategoryLabel = (category: string) => {
  //   const labels: Record<string, string> = {
  //     cleanliness: "Cleanliness",
  //     communication: "Communication", 
  //     respect_house_rules: "House Rules"
  //   };
  //   return labels[category] || category;
  // };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">FL</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-flex-cream">
      <Header 
        showBackButton={true} 
        backButtonText="Back to Properties"
        onBackClick={() => navigate('/')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Full Width Image Grid */}
        <div className="mb-8">
          {/* Image Grid - Masonry Layout */}
          <div className="grid grid-cols-4 grid-rows-2 gap-4 h-140 mb-6">
            {/* Main large image - spans 2 columns and 2 rows */}
            <div className="col-span-2 row-span-2">
              <img
                src={property.images[0]}
                alt={property.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Top right image */}
            <div className="col-span-1 row-span-1">
              <img
                src={property.images[1]}
                alt={`${property.name} 2`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Top far right image */}
            <div className="col-span-1 row-span-1">
              <img
                src={property.images[2]}
                alt={`${property.name} 3`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Bottom right image */}
            <div className="col-span-1 row-span-1">
              <img
                src={property.images[3]}
                alt={`${property.name} 4`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Bottom far right image with overlay */}
            <div className="col-span-1 row-span-1 relative">
              <img
                src={property.images[4]}
                alt={`${property.name} 5`}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* View all photos overlay */}
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-end justify-end p-3">
                <Button 
                  size="sm" 
                  className="bg-white text-black hover:bg-gray-100 text-sm px-3 py-1.5 font-medium"
                  onClick={() => {/* Add photo gallery logic here */}}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View all photos
                </Button>
              </div>
            </div>
          </div>

          {/* Property Title and Meta Details */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.name}</h1>
            
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(property.rating)}
                <span className="ml-2 text-sm font-medium text-gray-900">{property.rating}</span>
                <span className="text-sm text-gray-600">({property.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{property.guests} guests</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{property.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{property.bathrooms} bathrooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{property.bedrooms + 1} beds</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.amenities.map((amenity) => {
                    const IconComponent = amenityIcons[amenity] || Coffee;
                    return (
                      <div key={amenity} className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-brand-green-400" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stay Policies Section */}
            <StayPolicy />

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Guest Reviews</span>
                  </div>
                  {reviews.length > 0 && (
                    <Button variant="outline" size="sm">
                      Show all {reviews.length} reviews
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green-400 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No approved reviews available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="space-y-3">
                        {/* Profile and Rating */}
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green-400 to-brand-green-500 flex items-center justify-center text-white font-semibold text-sm">
                            {review.guestName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{review.guestName}</h4>
                              <span className="text-sm text-gray-500">
                                {(() => {
                                  try {
                                    const date = new Date(review.submittedAt || review.date);
                                    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', { 
                                      month: 'long', 
                                      year: 'numeric' 
                                    });
                                  } catch (error) {
                                    return 'Invalid Date';
                                  }
                                })()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {renderStars(review.overallRating)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Review Text */}
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.reviewText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {reviews.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        Show all {reviews.length} reviews
                      </Button>
                      <a href="#" className="text-sm text-brand-green-400 hover:text-brand-green-500">
                        Learn how reviews work
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BookingCard 
              price={property.price}
              onBookNow={() => {
                // Add booking logic here
                console.log('Book now clicked');
              }}
              onSaveToFavorites={() => {
                // Add save to favorites logic here
                console.log('Save to favorites clicked');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
