import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_KEY = 'e57999cfd071e836a12372261a1f23f6' // Your OpenWeather API key

const WeatherApp = () => {
	const [weather, setWeather] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [favoriteCities, setFavoriteCities] = useState(['New York', 'London', 'Tokyo'])
	const [newCity, setNewCity] = useState('')
	const [clock, setClock] = useState('')

	// Fetch weather data from OpenWeather API
	const fetchWeatherData = async (city) => {
		setLoading(true)
		setError(null)

		try {
			const response = await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
			)
			const weatherData = {
				city: response.data.name,
				temperature: `${response.data.main.temp}°C`,
				condition: response.data.weather[0].description,
			}
			setWeather(weatherData)
		} catch (error) {
			setError('Failed to fetch weather data. Please try again.')
		}

		setLoading(false)
	}

	// Handle adding a new favorite city
	const handleAddCity = () => {
		if (newCity.trim() !== '' && !favoriteCities.includes(newCity)) {
			setFavoriteCities([...favoriteCities, newCity])
			setNewCity('')
		}
	}

	// Handle removing a favorite city
	const handleRemoveCity = (cityToRemove) => {
		setFavoriteCities(favoriteCities.filter((city) => city !== cityToRemove))
	}

	// Update clock every second
	useEffect(() => {
		const updateClock = () => {
			const now = new Date()
			const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			setClock(timeString)
		}
		const timerId = setInterval(updateClock, 1000)
		return () => clearInterval(timerId)
	}, [])

	// Fetch default city weather on load
	useEffect(() => {
		fetchWeatherData('New York')
	}, [])

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 flex flex-col items-center justify-center text-white p-5 relative">
			{/* Real-Time Clock */}
			
			<div className="absolute top-4 left-4 text-xl font-bold">Time: {clock}</div>

			<h1 className="text-4xl font-bold mb-6">Personalized Weather App</h1>

			{/* Weather Display Section */}
			<div className="w-full max-w-md bg-black bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-6 text-center">
				{loading ? (
					<div className="flex justify-center items-center">
						<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 border-opacity-70"></div>
					</div>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : weather ? (
					<div
						className={`transition-transform duration-500 ${
							weather ? 'transform scale-105' : 'transform scale-100'
						}`}
					>
						<h2 className="text-2xl font-bold mb-2">{weather.city}</h2>
						<p className="text-xl">{weather.temperature}</p>
						<p>{weather.condition}</p>
					</div>
				) : (
					<p>No weather data available</p>
				)}
			</div>

			{/* Favorite Cities */}
			<div className="mt-8 w-full max-w-md">
				<h3 className="text-2xl mb-4">Favorite Cities</h3>
				<div className="flex space-x-4 mb-4">
					<input
						type="text"
						value={newCity}
						onChange={(e) => setNewCity(e.target.value)}
						placeholder="Add new city"
						className="px-3 py-2 rounded-lg w-full"
					/>
					<button
						className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400 transition duration-300 ease-in-out"
						onClick={handleAddCity}
					>
						Add
					</button>
				</div>

				{/* Display favorite cities with remove button */}
				<div className="grid grid-cols-2 gap-4">
					{favoriteCities.map((city) => (
						<div
							key={city}
							className="flex justify-between items-center bg-yellow-500 px-4 py-2 rounded-lg"
						>
							<button
								className="w-full text-left hover:text-gray-200"
								onClick={() => fetchWeatherData(city)}
							>
								{city}
							</button>
							<button
								className="text-red-600 hover:text-red-400"
								onClick={() => handleRemoveCity(city)}
							>
								&times;
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default WeatherApp
