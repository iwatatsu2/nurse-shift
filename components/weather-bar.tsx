'use client'

import { useEffect, useState } from 'react'
import { fetchWeather, getWeatherIcon, type WeatherDay } from '@/lib/weather'

export function WeatherBar() {
  const [weather, setWeather] = useState<WeatherDay[]>([])

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => {})
  }, [])

  if (weather.length === 0) return null

  return (
    <div className="border-t border-gray-100 px-4 py-3">
      <p className="text-[11px] text-gray-400 mb-2 tracking-wider text-center">7日間の天気</p>
      <div className="flex justify-between">
        {weather.map((day) => {
          const d = new Date(day.date + 'T00:00:00')
          const weekday = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
          const isToday = new Date().toDateString() === d.toDateString()

          return (
            <div key={day.date} className="flex flex-col items-center gap-0.5">
              <span className={`text-[10px] ${isToday ? 'font-bold text-slate-800' : 'text-gray-400'}`}>
                {isToday ? '今日' : weekday}
              </span>
              <span className="text-base leading-none">{getWeatherIcon(day.weatherCode)}</span>
              <div className="flex gap-0.5 text-[10px] font-[var(--font-inter)]">
                <span className="text-rose-400">{day.tempMax}°</span>
                <span className="text-sky-400">{day.tempMin}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
