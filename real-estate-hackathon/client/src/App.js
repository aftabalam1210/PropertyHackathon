import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    googleLocation: '',
    brokerDetails: '',
    parcelSize: '',
    pricePerAcre: '',
    city: '',
    microMarket: '',
  });

  useEffect(() => {
    axios.get('/api/properties')
      .then(response => {
        setProperties(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the properties!", error);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/properties', form)
      .then(response => {
        setProperties([...properties, response.data]);
        setForm({
          googleLocation: '',
          brokerDetails: '',
          parcelSize: '',
          pricePerAcre: '',
          city: '',
          microMarket: '',
        });
      })
      .catch(error => {
        console.error("There was an error adding the property!", error);
      });
  };

  return (
    <div>
      <h1>Real Estate Data Visualization</h1>
      <form onSubmit={handleSubmit}>
        <input name="googleLocation" value={form.googleLocation} onChange={handleChange} placeholder="Google Location" />
        <input name="brokerDetails" value={form.brokerDetails} onChange={handleChange} placeholder="Broker Details" />
        <input name="parcelSize" value={form.parcelSize} onChange={handleChange} placeholder="Parcel Size" />
        <input name="pricePerAcre" value={form.pricePerAcre} onChange={handleChange} placeholder="Price Per Acre" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <input name="microMarket" value={form.microMarket} onChange={handleChange} placeholder="Micro Market" />
        <button type="submit">Add Property</button>
      </form>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {properties.map((property, idx) => (
          <Marker key={idx} position={[51.505, -0.09]}>
            <Popup>
              <div>
                <h2>{property.city}</h2>
                <p>Broker: {property.brokerDetails}</p>
                <p>Parcel Size: {property.parcelSize} Acres</p>
                <p>Price per Acre: {property.pricePerAcre}</p>
                <p>Micro Market: {property.microMarket}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
