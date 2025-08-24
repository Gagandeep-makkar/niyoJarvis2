import React, { useState, useEffect } from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { useLiveAPIContext } from '../contexts/LiveAPIContext.tsx';
import { AudioRecorder } from '../lib/AudioRecorder.ts';
import AudioVisualization from '../components/AudioVisualization.tsx';

const VoiceInterface: React.FC = () => {
    const { client, connected, connect, disconnect, volume, setConfig, sendText, initializeAudioStreamer } = useLiveAPIContext();
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [inVolume, setInVolume] = useState(0);
    const [audioRecorder] = useState(() => new AudioRecorder());
    const [setupComplete, setSetupComplete] = useState(false);

    // Set config and connect
    useEffect(() => {
        console.log('🔧 Setting up Gemini Live configuration...');
        
        setConfig({
            model: 'models/gemini-live-2.5-flash-preview',
            systemInstruction: {
                parts: [
                    {
                        text: `You are an AI-powered agent named Vinay Bagree.
                        a.You are ALWAYS listening and ready to help. Users don't need to click buttons or say wake words just speak naturally.
                        b. Tell Users you can help them with fixed deposit calculations, trip itenary cost calculator and offers on niyo saving cards
                        c.Keep responses precise,short and to the point and helpful, and tone should be formal since users hear your actual voice.
                       

{{{(fixed_dcb_data)}}}:Use this EXACT FD rate data for all calculations and recommendations
fixed_dcb_data:
{
  "fd_types": [
    {
      "category": "Retail",
      "limit": "Below ₹3 crore",
      "tenures": [
        {
          "range": "7 days to 45 days",
          "payout_rates": {
            "monthly": { "general": 3.75, "senior": 4.00 },
            "quarterly": { "general": 3.75, "senior": 4.00 },
            "half_yearly": { "general": 3.75, "senior": 4.00 },
            "yearly": { "general": 3.75, "senior": 4.00 },
            "on_maturity": { "general": 3.74, "senior": 3.99, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "46 days to 90 days",
          "payout_rates": {
            "monthly": { "general": 4.50, "senior": 4.75 },
            "quarterly": { "general": 4.50, "senior": 4.75 },
            "half_yearly": { "general": 4.50, "senior": 4.75 },
            "yearly": { "general": 4.50, "senior": 4.75 },
            "on_maturity": { "general": 4.50, "senior": 4.75, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "91 days to less than 6 months",
          "payout_rates": {
            "monthly": { "general": 4.75, "senior": 5.00 },
            "quarterly": { "general": 4.75, "senior": 5.00 },
            "half_yearly": { "general": 4.75, "senior": 5.00 },
            "yearly": { "general": 4.75, "senior": 5.00 },
            "on_maturity": { "general": 4.76, "senior": 5.01, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "6 months to less than 10 months",
          "payout_rates": {
            "monthly": { "general": 6.00, "senior": 6.25 },
            "quarterly": { "general": 6.00, "senior": 6.25 },
            "half_yearly": { "general": 6.00, "senior": 6.25 },
            "yearly": { "general": 6.00, "senior": 6.25 },
            "on_maturity": { "general": 6.04, "senior": 6.29, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "10 months to less than 12 months",
          "payout_rates": {
            "monthly": { "general": 6.50, "senior": 6.75 },
            "quarterly": { "general": 6.50, "senior": 6.75 },
            "half_yearly": { "general": 6.50, "senior": 6.75 },
            "yearly": { "general": 6.50, "senior": 6.75 },
            "on_maturity": { "general": 6.56, "senior": 6.81, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "12 months to less than 15 months",
          "payout_rates": {
            "monthly": { "general": 6.90, "senior": 7.15 },
            "quarterly": { "general": 6.90, "senior": 7.15 },
            "half_yearly": { "general": 6.90, "senior": 7.15 },
            "yearly": { "general": 6.90, "senior": 7.15 },
            "on_maturity": { "general": 7.08, "senior": 7.33, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "15 months to less than 16 months",
          "payout_rates": {
            "monthly": { "general": 7.00, "senior": 7.50 },
            "quarterly": { "general": 7.00, "senior": 7.50 },
            "half_yearly": { "general": 7.00, "senior": 7.50 },
            "yearly": { "general": 7.00, "senior": 7.50 },
            "on_maturity": { "general": 7.17, "senior": 7.68, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "16 months to less than 27 months",
          "payout_rates": {
            "monthly": { "general": 6.90, "senior": 7.15 },
            "quarterly": { "general": 6.90, "senior": 7.15 },
            "half_yearly": { "general": 6.90, "senior": 7.15 },
            "yearly": { "general": 6.90, "senior": 7.15 },
            "on_maturity": { "general": 7.03, "senior": 7.28, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "27 months to less than 28 months",
          "payout_rates": {
            "monthly": { "general": 7.20, "senior": 7.70 },
            "quarterly": { "general": 7.20, "senior": 7.70 },
            "half_yearly": { "general": 7.20, "senior": 7.70 },
            "yearly": { "general": 7.20, "senior": 7.70 },
            "on_maturity": { "general": 7.38, "senior": 7.89, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "28 months to 60 months",
          "payout_rates": {
            "monthly": { "general": 7.00, "senior": 7.25 },
            "quarterly": { "general": 7.00, "senior": 7.25 },
            "half_yearly": { "general": 7.00, "senior": 7.25 },
            "yearly": { "general": 7.00, "senior": 7.25 },
            "on_maturity": { "general": 7.18, "senior": 7.43, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "Above 60 months to 61 months",
          "payout_rates": {
            "monthly": { "general": 7.20, "senior": 7.70 },
            "quarterly": { "general": 7.20, "senior": 7.70 },
            "half_yearly": { "general": 7.20, "senior": 7.70 },
            "yearly": { "general": 7.20, "senior": 7.70 },
            "on_maturity": { "general": 7.37, "senior": 7.88, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "Above 61 months to 120 months",
          "payout_rates": {
            "monthly": { "general": 7.00, "senior": 7.25 },
            "quarterly": { "general": 7.00, "senior": 7.25 },
            "half_yearly": { "general": 7.00, "senior": 7.25 },
            "yearly": { "general": 7.00, "senior": 7.25 },
            "on_maturity": { "general": 7.15, "senior": 7.40, "note": "Higher yield due to compounding till maturity" }
          }
        },
        {
          "range": "Above 120 months",
          "payout_rates": {
            "note": "Not available. DCB Bank does not offer FD tenures beyond 120 months."
          }
        }
      ]
    },
    {
      "category": "Bulk",
      "limit": "₹3 crore and above",
      "note": "Rates vary frequently and are available on request from DCB Bank treasury/branch.",
      "tenures": [
        {
          "range": "7 days to 10 years",
          "payout_rates": {
            "monthly": "Contact branch",
            "quarterly": "Contact branch",
            "half_yearly": "Contact branch",
            "yearly": "Contact branch",
            "on_maturity": "Contact branch"
          }
        }
      ]
    }
  ]
}


Payout options available: Quarterly, Half-yearly, At maturity, Monthly, Yearly

You can help with:
- FD maturity calculations using these exact rates
- Interest rate comparisons across tenures
- Compound interest calculations
- Investment planning advice
- FD tenure recommendations
- Tax implications on FD returns


{{{{trip_itenary_calculations}}}}: Trip Itenary calculations
{
  "countries": {
    "india": {
      "base_amount_inr": 30000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.7, "3": 2.3, "4_or_more": 2.8 },
        "trip_type": { "budget": 0.8, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "usa": {
      "base_amount_inr": 150000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.75, "3": 2.5, "4_or_more": 3.0 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.6 },
        "season": { "low": 0.9, "high": 1.3, "peak": 1.6 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.1, "all_inclusive": 1.5 }
      }
    },
    "france": {
      "base_amount_inr": 120000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.7, "3": 2.4, "4_or_more": 2.9 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.6 },
        "season": { "low": 0.8, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.2, "all_inclusive": 1.5 }
      }
    },
    "italy": {
      "base_amount_inr": 110000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.7, "3": 2.3, "4_or_more": 2.8 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "spain": {
      "base_amount_inr": 100000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.2, "4_or_more": 2.7 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.8, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "japan": {
      "base_amount_inr": 140000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.7, "3": 2.4, "4_or_more": 3.0 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.7 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.6 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.4, "relaxation": 1.2, "all_inclusive": 1.5 }
      }
    },
    "china": {
      "base_amount_inr": 90000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.2, "4_or_more": 2.8 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.9, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "vietnam": {
      "base_amount_inr": 65000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.2, "4_or_more": 2.7 },
        "trip_type": { "budget": 0.8, "standard": 1.0, "luxury": 1.4 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.4 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "australia": {
      "base_amount_inr": 160000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.8, "3": 2.5, "4_or_more": 3.2 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.6 },
        "season": { "low": 0.9, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.7 },
        "activities": { "sightseeing": 1.0, "adventure": 1.4, "relaxation": 1.1, "all_inclusive": 1.5 }
      }
    },
    "canada": {
      "base_amount_inr": 140000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.75, "3": 2.4, "4_or_more": 3.0 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.6 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.6 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "uk": {
      "base_amount_inr": 130000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.7, "3": 2.3, "4_or_more": 2.9 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.6 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.2, "all_inclusive": 1.5 }
      }
    },
    "germany": {
      "base_amount_inr": 115000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.65, "3": 2.3, "4_or_more": 2.9 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "thailand": {
      "base_amount_inr": 70000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.2, "4_or_more": 2.7 },
        "trip_type": { "budget": 0.8, "standard": 1.0, "luxury": 1.4 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.4 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.2, "all_inclusive": 1.5 }
      }
    },
    "singapore": {
      "base_amount_inr": 90000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.65, "3": 2.3, "4_or_more": 2.8 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "uae": {
      "base_amount_inr": 80000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.2, "4_or_more": 2.7 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.4 },
        "season": { "low": 0.9, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.4 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "malaysia": {
      "base_amount_inr": 75000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.2, "4_or_more": 2.7 },
        "trip_type": { "budget": 0.8, "standard": 1.0, "luxury": 1.4 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.4 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "switzerland": {
      "base_amount_inr": 180000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.8, "3": 2.6, "4_or_more": 3.2 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.7 },
        "season": { "low": 0.9, "high": 1.3, "peak": 1.6 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.7 },
        "activities": { "sightseeing": 1.0, "adventure": 1.4, "relaxation": 1.2, "all_inclusive": 1.6 }
      }
    },
    "maldives": {
      "base_amount_inr": 95000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.7, "3": 2.4, "4_or_more": 3.0 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.6 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.3, "all_inclusive": 1.5 }
      }
    },
    "bali": {
      "base_amount_inr": 85000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.3, "4_or_more": 2.9 },
        "trip_type": { "budget": 0.8, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.2, "all_inclusive": 1.4 }
      }
    },
    "south_africa": {
      "base_amount_inr": 100000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.65, "3": 2.3, "4_or_more": 2.9 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.9, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    },
    "egypt": {
      "base_amount_inr": 85000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.3, "4_or_more": 2.8 },
        "trip_type": { "budget": 0.8, "standard": 1.0, "luxury": 1.4 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.4 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.2, "all_inclusive": 1.4 }
      }
    },
    "turkey": {
      "base_amount_inr": 95000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.65, "3": 2.3, "4_or_more": 2.9 },
        "trip_type": { "budget": 0.85, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.9, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.2, "all_inclusive": 1.5 }
      }
    },
    "brazil": {
      "base_amount_inr": 110000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.7, "3": 2.4, "4_or_more": 3.0 },
        "trip_type": { "budget": 0.9, "standard": 1.0, "luxury": 1.6 },
        "season": { "low": 0.85, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.3, "long": 1.6 },
        "activities": { "sightseeing": 1.0, "adventure": 1.3, "relaxation": 1.2, "all_inclusive": 1.5 }
      }
    },
    "mexico": {
      "base_amount_inr": 95000,
      "multipliers": {
        "people": { "1": 1.0, "2": 1.6, "3": 2.3, "4_or_more": 2.9 },
        "trip_type": { "budget": 0.8, "standard": 1.0, "luxury": 1.5 },
        "season": { "low": 0.9, "high": 1.2, "peak": 1.5 },
        "duration": { "short": 1.0, "medium": 1.2, "long": 1.5 },
        "activities": { "sightseeing": 1.0, "adventure": 1.2, "relaxation": 1.1, "all_inclusive": 1.4 }
      }
    }
  }
}


{{{{niyo_offers_calculations}}}}: Niyo offers calculations

{
  "nyio_card_offers": {
    "zero_forex_markup": {
      "description": "Zero forex markup on international transactions; enjoy VISA exchange rates without extra fees—save up to 5%.",
      "benefit": "No additional forex fees when spending abroad.",
      "applies_to": ["debit_card", "credit_card"]
    },
    "lounge_access": {
      "description": "One complimentary international lounge pass per quarter upon spending ₹50,000 abroad (swipes & online transactions).",
      "benefit": "Access to 1,300+ lounges worldwide.",
      "criteria": {
        "spend_threshold": 50000,
        "transaction_types": ["POS", "ECOM"],
        "excludes": ["ATM_withdrawals"]
      },
      "validity": "Lounge pass valid for 30 days once generated."
    },
    "free_international_atm_withdrawal": {
      "description": "One free international ATM withdrawal per quarter.",
      "benefit": "Fee-free cash withdrawal abroad, with surcharge-free ATM locator feature."
    },
    "reward_coins": {
      "description": "Earn 'Niyo Coins' (1 coin = ₹0.10) on various spends and referrals, redeemable toward travel bookings like flights and visa.",
      "earning_channels": [
        "domestic UPI payments",
        "domestic credit card transactions",
        "referrals",
        "international ATM withdrawal fees reversal (up to ₹1,500 per quarter)",
        "visa bookings"
      ],
      "redemption_channels": [
        "flight bookings",
        "visa applications"
      ],
      "expiry": "12 months from issuance"
    },
    "zero_fee_services": {
      "description": "Enjoy zero convenience and service fees on select bookings.",
      "services": [
        "flight booking convenience fee waived",
        "visa application service fee waived"
      ]
    },
    "interest_on_savings": {
      "description": "Earn interest on your savings account balance linked to Niyo Global.",
      "rate": "Up to 6.5% p.a.",
      "payout": "Monthly"
    },
    "instant_loading_and_use": {
      "description": "Load in INR via UPI/IMPS/NEFT instantly and use it globally in 130+ currencies across 180+ countries."
    },
    "rewards_and_perks": [
      "Forex cash delivery at zero forex markup",
      "Exclusive travel and partner offers accessible in-app",
      "Doorstep KYC + Express delivery in select cities"
    ]
  }
}
 `,
                    },
                ],
            },
            generationConfig: {
                responseModalities: 'audio' as const,
            },
        });
    }, [setConfig]);

    useEffect(() => {
        if (!connected && connect) {
            console.log('🔗 Attempting initial connection...');
            connect()
                .then(() => {
                    console.log('✅ Connection successful!');
                })
                .catch((err: Error) => {
                    console.error('❌ Connection failed:', err.message || err);
                    setError('Failed to connect to voice service');
                });
        }
    }, [connected, connect]);

    // Send greeting only after setup is complete
    useEffect(() => {
        if (setupComplete && sendText) {
            setTimeout(() => {
                const initialGreeting = "You are an AI-powered agent named Vinay Bagree. How can I assist you today?";
                console.log('Sending initial greeting after setup complete...');
                try {
                    sendText(initialGreeting);
                } catch (error) {
                    console.error('Failed to send initial greeting:', error);
                }
            }, 500);
        }
    }, [setupComplete, sendText]);

    // Handle microphone audio streaming
    useEffect(() => {
        const onData = (base64: string) => {
            if (client && !isMuted) {
                client.sendRealtimeInput([
                    {
                        mimeType: 'audio/pcm;rate=16000',
                        data: base64,
                    },
                ]);
            }
        };

        const onVolume = (vol: number) => {
            setInVolume(vol);
        };

        if (connected && !isMuted && audioRecorder) {
            audioRecorder.on("data", onData).on("volume", onVolume);
            audioRecorder.start().catch((err) => {
                console.error('Failed to start audio recording:', err);
                setError('Failed to access microphone');
            });
        } else {
            audioRecorder.stop();
        }

        return () => {
            audioRecorder.off("data", onData).off("volume", onVolume);
        };
    }, [connected, client, isMuted, audioRecorder]);

    useEffect(() => {
        if (!client) return;

        // Listen for AI responses
        const handleContent = (content: any) => {
            console.log('💬 Received content from AI:', content);
            if (content.modelTurn?.parts) {
                for (const part of content.modelTurn.parts) {
                    if (part.text) {
                        setLastMessage(part.text);
                    }
                }
            }
        };

        const handleAudio = () => {
            setIsSpeaking(true);
        };

        const handleTurnComplete = () => {
            setIsSpeaking(false);
        };

        const handleSetupComplete = () => {
            console.log('🎉 Setup complete! Ready to send messages.');
            setSetupComplete(true);
        };

        client.on('content', handleContent);
        client.on('audio', handleAudio);
        client.on('turncomplete', handleTurnComplete);
        client.on('setupcomplete', handleSetupComplete);

        return () => {
            client.off('content', handleContent);
            client.off('audio', handleAudio);
            client.off('turncomplete', handleTurnComplete);
            client.off('setupcomplete', handleSetupComplete);
        };
    }, [client]);

    const toggleMute = async () => {
        const wasUnmuting = isMuted;
        setIsMuted(!isMuted);
        console.log(isMuted ? 'Unmuted' : 'Muted');
        
        // Initialize audio streamer on first unmute (user gesture)
        if (wasUnmuting && initializeAudioStreamer) {
            try {
                await initializeAudioStreamer();
                console.log('🎧 AudioStreamer initialized after user gesture');
            } catch (error) {
                console.error('❌ Failed to initialize AudioStreamer:', error);
            }
        }
    };

    const handleDisconnect = () => {
        disconnect();
        console.log('Disconnected from voice service');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex flex-col relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Niyo Jarvis 2.0 Title */}
                    <div className="mb-12">
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 mb-4 tracking-tight">
                            NIYO
                        </h1>
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1 max-w-32"></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-300 tracking-widest">
                                JARVIS 2.0
                            </h2>
                            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1 max-w-32"></div>
                        </div>
                        <p className="text-gray-300 text-lg font-light tracking-wide">
                            AI-Powered Voice Assistant
                        </p>
                    </div>

                    {/* Audio Visualization */}
                    <div className="mb-12">
                        <AudioVisualization
                            isListening={connected && !isMuted}
                            isSpeaking={isSpeaking}
                            audioLevel={volume || 0}
                            size={400}
                            className="transition-all duration-500"
                        />
                    </div>

                    {/* Connection Status */}
                    <div className="mb-8">
                        {connected ? (
                            <div className="flex items-center justify-center space-x-3 text-green-400 bg-green-900/20 backdrop-blur-sm px-6 py-3 rounded-full inline-flex border border-green-500/30">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                                <span className="text-sm font-medium tracking-wide">SYSTEM ONLINE</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-3 text-orange-400 bg-orange-900/20 backdrop-blur-sm px-6 py-3 rounded-full inline-flex border border-orange-500/30">
                                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50" />
                                <span className="text-sm font-medium tracking-wide">INITIALIZING...</span>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="mb-8 flex items-center justify-center space-x-6">
                        <button
                            onClick={toggleMute}
                            className={`px-10 py-5 text-lg font-bold rounded-full transition-all duration-300 flex items-center space-x-4 backdrop-blur-sm border-2 transform hover:scale-105 ${
                                isMuted
                                    ? 'bg-red-600/80 hover:bg-red-500/80 text-white border-red-400/50 shadow-lg shadow-red-500/25'
                                    : 'bg-blue-600/80 hover:bg-blue-500/80 text-white border-blue-400/50 shadow-lg shadow-blue-500/25'
                            }`}
                        >
                            {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                            <span className="tracking-wide">{isMuted ? 'ACTIVATE' : 'LISTENING'}</span>
                        </button>

                        <button
                            onClick={handleDisconnect}
                            className="px-8 py-5 text-lg font-bold rounded-full transition-all duration-300 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 flex items-center space-x-3 backdrop-blur-sm border-2 border-gray-600/50 shadow-lg transform hover:scale-105"
                        >
                            <PhoneOff className="w-6 h-6" />
                            <span className="tracking-wide">DISCONNECT</span>
                        </button>
                    </div>

                    {/* Last Message */}
                    {lastMessage && (
                        <div className="mb-8 max-w-2xl mx-auto">
                            <div className="px-8 py-6 bg-blue-900/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 shadow-xl">
                                <p className="text-blue-300 text-sm font-bold mb-3 tracking-widest uppercase">JARVIS RESPONSE</p>
                                <p className="text-gray-200 text-base leading-relaxed font-light">{lastMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Input Volume Indicator */}
                    {connected && !isMuted && (
                        <div className="mb-8 max-w-sm mx-auto">
                            <div className="flex items-center space-x-4 text-gray-300 text-sm bg-gray-900/40 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50">
                                <Mic className="w-5 h-5 text-blue-400" />
                                <div className="flex-1 bg-gray-700/50 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-100 shadow-sm"
                                        style={{ width: `${Math.min(inVolume * 100, 100)}%` }}
                                    />
                                </div>
                                <span className="text-xs tracking-wide font-medium">VOICE</span>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="mb-8 max-w-md mx-auto">
                            <div className="px-6 py-4 bg-red-900/20 backdrop-blur-sm rounded-2xl border border-red-500/30">
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                                <button 
                                    onClick={() => setError('')}
                                    className="mt-3 text-red-400 hover:text-red-300 text-xs underline tracking-wide"
                                >
                                    DISMISS
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoiceInterface;
