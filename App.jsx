import React, { useState, useEffect } from 'react';
import france from './assets/france.jpg';
import japan from './assets/japan.jpg';
import qatar from './assets/qatar.jpg';
import tunisia from './assets/tunisia.jpg';
import north_america from './assets/north_america.jpg';
import './App.css';

const locations = [
  { name: 'France', lat: 46.2337295, lon: 5.3538775, file: france },
  { name: 'North America', lat: 51.4371483, lon: 5.9799001, file: north_america },
  { name: 'Qatar', lat: 39.1074426, lon: 47.5061085, file: qatar },
  { name: 'Japan', lat: 40.9921996, lon: -75.9078749, file: japan },
  { name: 'Tunisia', lat: 36.8002068, lon: 10.1857757, file: tunisia },
];

const API_KEY = 'b543da68018a588fb6d38cc7890d0310';

const ImageSwitcherWithData = () => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      const updatedImages = await Promise.all(
        locations.map(async (location) => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          return {
            name: location.name,
            degree: `${data.main.temp}°C`,
            situation: data.weather[0].description,
            humidity: `${data.main.humidity}%`,
            wind: `${data.wind.speed} km/h`,
            file: location.file,
          };
        })
      );
      setImages(updatedImages);
      setCurrentImage(updatedImages[0]);
    };
    fetchWeatherData();
  }, []);

  const changeImage = (imageName) => {
    const selectedImage = images.find((img) => img.name === imageName);
    setCurrentImage(selectedImage || currentImage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const selectedImage = images.find((img) =>
      img.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCurrentImage(selectedImage || currentImage);
    setSearchQuery('');
  };

  return (
    <div className="container">
      {/* Search Bar */}
      
      {/* Display the current image with overlay data */}
      <div className="image-container">
        {currentImage && (
          <img src={currentImage.file} alt="Displayed" className="display-image" />
        )}
        <div className="image-overlay">
          <p>Humidity: {currentImage?.humidity} | Wind Speed: {currentImage?.wind}</p>
        </div>
        <div className="image-overlay2">
          <p className="name">{currentImage?.name}</p>
          <p className="degree">{currentImage?.degree}</p>
          <p className="situation">{currentImage?.situation}</p>
        </div>
      </div>
        <br/>

       {/* Search container */}        
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Country"
            className="search-input"
          />
        </form>
      </div>


      {/* Buttons */}
      <div className="button-container">
        {images.map((img, index) => (
          <button
            key={img.name}
            onClick={() => changeImage(img.name)}
            className={`image-button button-${index}`}
          >
            {img.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSwitcherWithData;
