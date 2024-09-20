import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Replace this with your API key
const API_KEY = 'e57999cfd071e836a12372261a1f23f6'

const WeatherApp = () => {
	const [weather, setWeather] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [favoriteCities, setFavoriteCities] = useState(['New York', 'London', 'Tokyo'])

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

	useEffect(() => {
		// Fetch weather for default city on load
		fetchWeatherData('Ilorin')
	}, [])

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 flex flex-col items-center justify-center text-white p-5">
			<h1 className="text-4xl font-bold mb-6">Personalized Weather App</h1>

			{/* Weather Display Section */}
			<div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-6 text-center">
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
			<div className="mt-8">
				<h3 className="text-2xl mb-4">Favorite Cities</h3>
				<div className="flex space-x-4">
					{favoriteCities.map((city) => (
						<button
							key={city}
							className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-110"
							onClick={() => fetchWeatherData(city)}
						>
							{city}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default WeatherApp
