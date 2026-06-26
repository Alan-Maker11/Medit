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

export default function FareCalculator() {
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
        try {
          // Dominican Republic bounds
          const DR_BOUNDS = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(17.5, -74.5),
            new window.google.maps.LatLng(19.9, -68.3)
          )

          // Santo Domingo center
          const SANTO_DOMINGO_CENTER = new window.google.maps.LatLng(18.4861, -69.9312)

          // Setup pickup autocomplete
          const pickupInput = document.getElementById('pickup') as HTMLInputElement
          if (pickupInput) {
            const pickup = new window.google.maps.places.Autocomplete(pickupInput, {
              types: ['address'],
              bounds: DR_BOUNDS,
              strictBounds: true,
              location: SANTO_DOMINGO_CENTER,
              radius: 80000,
              componentRestrictions: { country: 'do' }
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
        } catch (err) {
          console.error('Error initializing Google Maps autocomplete:', err)
        }
      }
    }

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

  const handleWhatsAppClick = () => {
    if (!result) return
    
    const message = `Hola! Me gustaría reservar un viaje.\n\nDetalles:\n• Pickup: ${watch('pickup')}\n• Destination: ${watch('destination')}\n• Servicio: ${watch('serviceType')}\n• Costo estimado: RD$${result.totalFare.toLocaleString()}`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappLink = `https://api.whatsapp.com/send?phone=18293296920&text=${encodedMessage}`
    
    window.open(whatsappLink, '_blank')
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
          {/* Form Column */}
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
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
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

          {/* Results Column */}
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

                <div className="border-t-2 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Fare</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {result.totalFare.toLocaleString()} {CURRENCY}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center mb-4">
                  Confirm your booking on WhatsApp
                </p>

                <button
                  onClick={handleWhatsAppClick}
                  type="button"
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium text-center hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.226l-.012 7.387c0 .55.452 1.002 1.003 1.002h7.571c.55 0 1.002-.452 1.002-1.002v-7.387c-.002-.55-.453-1.002-1.004-1.002h-.782zm-4.38 8.68a.996.996 0 01-1.002-1.002c0-.552.451-1.002 1.002-1.002h7.571c.55 0 1.002.45 1.002 1.002 0 .55-.452 1.002-1.002 1.002h-7.571z"/>
                  </svg>
                  Confirm on WhatsApp
                </button>
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
