import React, { useState, useEffect } from 'react';
import delhi from './assets/delhi.jpg';
import gujrat from './assets/gujrat.jpg';
import jammu from './assets/jammu.jpg';
import kolkata from './assets/kolkata.jpg';
import mumbai from './assets/mumbai.jpg';
import './App.css';

const locations = [
  { name: 'Maharashtra', lat: 19.601194, lon: 75.552979, file: mumbai },
  { name: 'Gujrat', lat: 22.309425, lon: 72.136230, file: gujrat },
  { name: 'Delhi', lat: 28.679079, lon: 77.069710, file: delhi },
  { name: 'Kolkata', lat: 22.572645, lon: 88.363892, file: kolkata },
  { name: 'Jammu', lat: 32.732998, lon: 74.864273, file: jammu },
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
            placeholder="Search State"
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
