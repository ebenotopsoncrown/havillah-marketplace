import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'declined');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <Cookie className="w-8 h-8 text-indigo-600 flex-shrink-0" />
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              We Value Your Privacy
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              We use essential cookies to maintain your session and shopping cart. 
              These cookies are necessary for the website to function and cannot be disabled. 
              We do not use tracking, advertising, or analytics cookies. 
              By continuing to use our site, you agree to our use of essential cookies.
            </p>
            <p className="text-xs text-gray-600 mb-4">
              Read our{' '}
              <a href="/PrivacyPolicy" className="text-indigo-600 underline">Privacy Policy</a>
              {' '}and{' '}
              <a href="/TermsAndConditions" className="text-indigo-600 underline">Terms & Conditions</a>
              {' '}for more information.
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={acceptCookies}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Accept Essential Cookies
              </Button>
              <Button 
                onClick={declineCookies}
                variant="outline"
              >
                Continue Without Cookies
              </Button>
            </div>
          </div>

          <button 
            onClick={declineCookies}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}