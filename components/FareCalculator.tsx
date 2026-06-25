'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SERVICE_TYPES, PRICING, CURRENCY } from '@/lib/constants'
import { getServices } from '@/lib/supabase'

interface CalculatorFormData {
  pickup: string
  destination: string
  serviceType: string
  tripType: 'one-way' | 'round-trip'
  transportationMode: 'private' | 'public'
  waitingHours: number
  additionalFees: number
  clientName?: string
  clientPhone?: string
}

interface CalculationResult {
  distance: number
  duration: number
  baseFare: number
  distanceCost: number
  durationCost: number
  waitingCost: number
  totalFare: number
}

declare global {
  interface Window {
    google: any
  }
}

export default function Calculator() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CalculatorFormData>({
    defaultValues: {
      tripType: 'one-way',
      transportationMode: 'private',
      waitingHours: 0,
      additionalFees: 0,
    },
  })

  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pickupAutocomplete, setPickupAutocomplete] = useState<any>(null)
  const [destinationAutocomplete, setDestinationAutocomplete] = useState<any>(null)

  const tripType = watch('tripType')
  const additionalFees = watch('additionalFees') || 0

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error: err } = await getServices()
        if (err) throw err
        setServices(data || SERVICE_TYPES)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

  // Initialize Google Maps Autocomplete with Dominican Republic restriction
  useEffect(() => {
    const initializeAutocomplete = () => {
      if (window.google) {
        // Dominican Republic bounds
        const DR_BOUNDS = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(17.5, -74.5),  // Southwest corner
          new window.google.maps.LatLng(19.9, -68.3)   // Northeast corner
        )

        // Santo Domingo center (for biasing results)
        const SANTO_DOMINGO_CENTER = new window.google.maps.LatLng(18.4861, -69.9312)

        // Setup pickup autocomplete
        const pickupInput = document.getElementById('pickup') as HTMLInputElement
        if (pickupInput) {
          const pickup = new window.google.maps.places.Autocomplete(pickupInput, {
            types: ['address'],
            bounds: DR_BOUNDS,
            strictBounds: true,  // Strictly enforce bounds
            location: SANTO_DOMINGO_CENTER,  // Bias towards Santo Domingo
            radius: 80000,  // 80km radius
            componentRestrictions: { country: 'do' }  // Restrict to Dominican Republic
          })
          setPickupAutocomplete(pickup)
        }

        // Setup destination autocomplete
        const destinationInput = document.getElementById('destination') as HTMLInputElement
        if (destinationInput) {
          const destination = new window.google.maps.places.Autocomplete(destinationInput, {
            types: ['address'],
            bounds: DR_BOUNDS,
            strictBounds: true,
            location: SANTO_DOMINGO_CENTER,
            radius: 80000,
            componentRestrictions: { country: 'do' }
          })
          setDestinationAutocomplete(destination)
        }
      }
    }

    // Small delay to ensure Google Maps is fully loaded
    const timer = setTimeout(initializeAutocomplete, 500)
    return () => clearTimeout(timer)
  }, [])

  const calculateFare = async (data: CalculatorFormData) => {
    setCalculating(true)
    setError(null)

    try {
      if (!data.pickup || !data.destination) {
        setError('Please enter both pickup and destination addresses')
        setCalculating(false)
        return
      }

      // Mock data - replace with Google Maps API in production
      const mockDistance = 25
      const mockDuration = 45

      const distanceCost = mockDistance * PRICING.DISTANCE_MULTIPLIER * PRICING.DISTANCE_RATE
      const durationCost = mockDuration * PRICING.DURATION_MULTIPLIER * PRICING.DURATION_RATE
      const waitingCost = data.tripType === 'round-trip' 
        ? (data.waitingHours || 0) * PRICING.WAITING_RATE 
        : 0
      const totalFare = PRICING.BASE_FARE + distanceCost + durationCost + waitingCost + additionalFees

      setResult({
        distance: mockDistance,
        duration: mockDuration,
        baseFare: PRICING.BASE_FARE,
        distanceCost,
        durationCost,
        waitingCost,
        totalFare,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCalculating(false)
    }
  }

  const onSubmit = (data: CalculatorFormData) => {
    calculateFare(data)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medit Fare Calculator</h1>
          <p className="text-gray-600">Calculate your transportation cost instantly</p>
          <p className="text-sm text-gray-500 mt-2">🇩🇴 Available in Dominican Republic</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location (Dominican Republic)
                </label>
                <input
                  id="pickup"
                  type="text"
                  placeholder="e.g., Calle Principal, Santo Domingo"
                  {...register('pickup', { required: 'Pickup is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {errors.pickup && <p className="text-red-500 text-sm mt-1">{errors.pickup.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination (Dominican Republic)
                </label>
                <input
                  id="destination"
                  type="text"
                  placeholder="e.g., Hospital San Rafael, Santo Domingo"
                  {...register('destination', { required: 'Destination is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  {...register('serviceType', { required: 'Service type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a service</option>
                  {(services || SERVICE_TYPES).map((service: any) => (
                    <option key={service.id} value={service.name}>
                      {service.label || service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" value="one-way" {...register('tripType')} className="mr-2" />
                    <span className="text-gray-700">One-way</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" value="round-trip" {...register('tripType')} className="mr-2" />
                    <span className="text-gray-700">Round-trip</span>
                  </label>
                </div>
              </div>

              {tripType === 'round-trip' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waiting Time (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    {...register('waitingHours', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transportation Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" value="private" {...register('transportationMode')} className="mr-2" />
                    <span className="text-gray-700">Private</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" value="public" {...register('transportationMode')} className="mr-2" />
                    <span className="text-gray-700">Public (Metro + Meditiko)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Fees ({CURRENCY})
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('additionalFees', { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={calculating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {calculating ? 'Calculating...' : 'Calculate Fare'}
              </button>
            </form>
          </div>

          <div>
            {result ? (
              <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Fare Breakdown</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-medium">{result.distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{result.duration} minutes</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Base Fare</span>
                    <span className="font-medium">{result.baseFare.toLocaleString()} {CURRENCY}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Distance Cost</span>
                    <span className="font-medium">{result.distanceCost.toLocaleString()} {CURRENCY}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Duration Cost</span>
                    <span className="font-medium">{result.durationCost.toLocaleString()} {CURRENCY}</span>
                  </div>
                  {result.waitingCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Waiting Time Cost</span>
                      <span className="font-medium">{result.waitingCost.toLocaleString()} {CURRENCY}</span>
                    </div>
                  )}
                  {additionalFees > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Additional Fees</span>
                      <span className="font-medium">{additionalFees.toLocaleString()} {CURRENCY}</span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Fare</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {result.totalFare.toLocaleString()} {CURRENCY}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center mt-6">
                  Contact us to confirm your booking
                </p>

                
                  href="https://wa.me/1234567890?text=I%20would%20like%20to%20book%20a%20ride"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full bg-green-500 text-white py-3 rounded-lg font-medium text-center hover:bg-green-600 transition-colors"
                >
                  Confirm on WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-500">Fill in the form and click "Calculate Fare"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
