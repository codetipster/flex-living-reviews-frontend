import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, Calendar, Ban, PartyPopper } from "lucide-react";

export function StayPolicy() {
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Stay Policies</h2>
        
        <div className="space-y-8">
          {/* Check-in & Check-out */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-brand-green-400" />
              <h3 className="text-lg font-semibold text-gray-900">Check-in & Check-out</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Check-in time</div>
                  <div className="text-xl font-bold text-gray-900">3:00 PM</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Check-out time</div>
                  <div className="text-xl font-bold text-gray-900">10:00 AM</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* House Rules */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-brand-green-400" />
              <h3 className="text-lg font-semibold text-gray-900">House Rules</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Ban className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-900">No smoking</span>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Ban className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-900">No pets</span>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <PartyPopper className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-900">No parties or events</span>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-brand-green-400" />
                  <span className="text-sm font-medium text-gray-900">Security deposit required</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-brand-green-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-brand-green-400" />
              <h3 className="text-lg font-semibold text-gray-900">Cancellation Policy</h3>
            </div>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">For stays less than 28 days</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Full refund up to 14 days before check-in</li>
                      <li>• No refund for bookings less than 14 days before check-in</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">For stays of 28 days or more</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Full refund up to 30 days before check-in</li>
                      <li>• No refund for bookings less than 30 days before check-in</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
