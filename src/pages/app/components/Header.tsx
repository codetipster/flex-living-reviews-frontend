import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  showAdminButton?: boolean;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
}

export function Header({ 
  showAdminButton = false, 
  showBackButton = false, 
  backButtonText = "Back",
  onBackClick 
}: HeaderProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 ",
        isScrolled 
          ? "bg-brand-green-500 " 
          : "bg-white shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300",
              isScrolled 
                ? "bg-white" 
                : "bg-brand-green-400"
            )}>
              <span className={cn(
                "font-bold text-sm transition-colors duration-300",
                isScrolled 
                  ? "text-brand-green-400" 
                  : "text-white"
              )}>
                FL
              </span>
            </div>
            <span className={cn(
              "text-xl font-bold transition-colors duration-300",
              isScrolled 
                ? "text-white" 
                : "text-gray-900"
            )}>
              Flex Living
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Button 
                variant={isScrolled ? "default" : "outline"}
                size="sm"
                onClick={handleBackClick}
                className={cn(
                  "transition-colors duration-300",
                  isScrolled 
                    ? "bg-brand-green-400 text-white hover:bg-brand-green-500 border-brand-green-400" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                {backButtonText}
              </Button>
            )}
            
            {showAdminButton && (
              <Button 
                variant={isScrolled ? "default" : "outline"}
                size="sm"
                onClick={() => navigate('/admin')}
                className={cn(
                  "transition-colors duration-300",
                  isScrolled 
                    ? "bg-brand-green-400 text-white hover:bg-brand-green-500 border-brand-green-400" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                Manager Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
