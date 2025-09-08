import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "./components/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Users, Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  rating: number;
  reviewCount: number;
}

const properties: Property[] = [
  {
    id: "1",
    name: "2B N1 A - 29 Shoreditch Heights",
    location: "Shoreditch, London",
    description: "Experience the vibrant heart of London in this stunning 2-bedroom apartment. Located in the trendy Shoreditch district, this modern space offers the perfect blend of comfort and style.",
    price: 180,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Kitchen", "Parking", "Gym", "Pool"],
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    rating: 4.8,
    reviewCount: 127
  },
  {
    id: "2",
    name: "1B E2 B - 15 Canary Wharf Tower",
    location: "Canary Wharf, London",
    description: "Luxury living in the heart of London's financial district. This elegant 1-bedroom apartment offers stunning views of the Thames and modern amenities.",
    price: 220,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Kitchen", "Parking", "Gym", "Pool"],
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: "3",
    name: "Studio S3 C - 42 London Bridge",
    location: "London Bridge, London",
    description: "Compact and stylish studio apartment in the historic London Bridge area. This modern space maximizes every square foot with smart storage solutions.",
    price: 120,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Kitchen", "Parking"],
    bedrooms: 0,
    bathrooms: 1,
    guests: 2,
    rating: 4.2,
    reviewCount: 45
  }
];

export function PropertyListing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

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

  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = priceFilter === "all" || 
        (priceFilter === "low" && property.price < 150) ||
        (priceFilter === "medium" && property.price >= 150 && property.price < 200) ||
        (priceFilter === "high" && property.price >= 200);
      
      const matchesLocation = locationFilter === "all" || 
        property.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesPrice && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return b.rating - a.rating;
      }
    });

  const handlePropertyClick = (property: Property) => {
    const encodedName = encodeURIComponent(property.name);
    navigate(`/property/${encodedName}`);
  };

  const locations = Array.from(new Set(properties.map(p => p.location.split(',')[0])));

  return (
    <div className="min-h-screen bg-brand-flex-cream">
       <Header showAdminButton={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h1>
          <p className="text-gray-600">Discover amazing properties with verified guest reviews</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under £150</SelectItem>
                  <SelectItem value="medium">£150 - £200</SelectItem>
                  <SelectItem value="high">Over £200</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setPriceFilter("all");
                  setLocationFilter("all");
                  setSortBy("rating");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProperties.length} Properties Found
          </h2>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card 
              key={property.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => handlePropertyClick(property)}
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                    £{property.price}/night
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-brand-green-600 transition-colors">
                  {property.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(property.rating)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {property.rating}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({property.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{property.guests} guests</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{property.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-brand-green-400 hover:bg-brand-green-500 text-white group-hover:bg-brand-green-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropertyClick(property);
                  }}
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setPriceFilter("all");
                setLocationFilter("all");
                setSortBy("rating");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
