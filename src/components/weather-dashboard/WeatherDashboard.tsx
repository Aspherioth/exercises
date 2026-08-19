import { useState, type ChangeEvent } from "react";

type SearchHistoryCity = {
  id: number;
  name: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
};

export default function WeatherDashboard() {
  const mockWeatherData = {
    "New York": {
      temperature: "22°C",
      humidity: "56%",
      windSpeed: "15 km/h",
    },
    "Los Angeles": {
      temperature: "27°C",
      humidity: "45%",
      windSpeed: "10 km/h",
    },
    London: {
      temperature: "15°C",
      humidity: "70%",
      windSpeed: "20 km/h",
    },
  };

  const [userInput, setUserInput] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<SearchHistoryCity[]>([]);
  const [result, setResult] = useState<SearchHistoryCity | "not-found" | null>(
    null,
  );

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setUserInput(evt.target.value);
  };

  const onSearchClick = () => {
    const cityDetails = mockWeatherData[userInput];

    if (!cityDetails) {
      setResult("not-found");
      return;
    }

    // Prepend to show the latest searches at the top.
    const newCity = { ...cityDetails, id: Math.random(), name: userInput };
    setSearchHistory((prev) => [newCity, ...prev]);
    setResult(newCity);
  };

  const updateSelectedCity = (id: number) => {
    setResult(searchHistory.find((c) => c.id === id) || null);
  };

  const hasResult = result && result !== "not-found";
  return (
    <div>
      <input
        type="text"
        id="citySearch"
        placeholder="Search for a city..."
        value={userInput}
        onChange={onInputChange}
      />
      <button id="searchButton" onClick={onSearchClick}>
        Search
      </button>
      <div id="weatherData">
        {hasResult && (
          <>
            <h2>{result.name}</h2>
            <div>
              Temperature: <span>{result.temperature}</span>
            </div>
            <div>
              Humidity: <span>{result.humidity}</span>
            </div>
            <div>
              Wind Speed: <span>{result.windSpeed}</span>
            </div>
          </>
        )}
        {result === "not-found" && <div>City not found.</div>}
      </div>
      <div id="previousSearches">
        <h3>Previous Results</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            justifyContent: "center",
          }}
        >
          {searchHistory.map((h) => (
            <button key={h.id} onClick={() => updateSelectedCity(h.id)}>
              {h.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
