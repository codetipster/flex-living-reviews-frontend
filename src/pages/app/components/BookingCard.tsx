import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  price: number;
  onBookNow?: () => void;
  onSaveToFavorites?: () => void;
}

export function BookingCard({ 
  price, 
  onBookNow, 
  onSaveToFavorites 
}: BookingCardProps) {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            £{price}
          </div>
          <div className="text-sm text-gray-600">per night</div>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-brand-green-400 hover:bg-brand-green-500 text-white"
            onClick={onBookNow}
          >
            Book Now
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onSaveToFavorites}
          >
            Save to Favorites
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>3:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>11:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Cancellation:</span>
              <span>Free until 24h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
