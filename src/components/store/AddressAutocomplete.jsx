import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AddressAutocomplete({ 
  address, 
  postcode, 
  onAddressChange, 
  onPostcodeChange, 
  onValidation 
}) {
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const validateAddress = async () => {
    if (!postcode) return;
    
    setValidating(true);
    try {
      const response = await base44.functions.invoke('validateAddress', {
        postcode,
        address
      });
      
      console.log('Validation response:', response.data);
      
      setValidationResult(response.data);
      if (onValidation) {
        onValidation(response.data);
      }
      
      // If valid, update the address with formatted version
      if (response.data.valid && response.data.formatted_address) {
        setSuggestions([response.data.formatted_address]);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({ 
        valid: false, 
        error: 'Could not validate address',
        suggestion: 'Verification service error. You can proceed if your address is correct.'
      });
    } finally {
      setValidating(false);
    }
  };

  // Debounced validation on postcode change
  useEffect(() => {
    if (postcode && postcode.length >= 5) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        validateAddress();
      }, 800);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [postcode, address]);

  const selectSuggestion = (suggestion) => {
    onAddressChange(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="delivery_address">Street Address *</Label>
        <div className="relative">
          <Input
            id="delivery_address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Start typing your address..."
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="bg-white border rounded-lg shadow-lg mt-1 overflow-hidden">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                <MapPin className="w-4 h-4 text-indigo-600" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="delivery_postcode">Postcode *</Label>
          <div className="relative">
            <Input
              id="delivery_postcode"
              value={postcode}
              onChange={(e) => onPostcodeChange(e.target.value.toUpperCase())}
              placeholder="SW1A 1AA"
              className={`uppercase ${
                validationResult?.valid === true ? 'border-green-500 pr-10' :
                validationResult?.valid === false ? 'border-red-500 pr-10' : ''
              }`}
            />
            {validating && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
            )}
            {!validating && validationResult?.valid === true && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
            {!validating && validationResult?.valid === false && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button 
            type="button" 
            variant="outline" 
            onClick={validateAddress}
            disabled={validating || !postcode}
            className="w-full"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Verify Address
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Validation feedback */}
      {validationResult && (
        <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
          validationResult.valid 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
        }`}>
          {validationResult.valid ? (
            <>
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Address verified!</p>
                <p className="text-xs opacity-75">{validationResult.formatted_address}</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Could not verify address</p>
                <p className="text-xs opacity-75">
                  {validationResult.suggestion || validationResult.error_message || 
                   'We couldn\'t verify this address automatically, but you can still proceed if you\'re sure it\'s correct.'}
                </p>
                {validationResult.note && (
                  <p className="text-xs opacity-75 mt-1">Note: {validationResult.note}</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}