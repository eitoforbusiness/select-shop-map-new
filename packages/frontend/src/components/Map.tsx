import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Paper } from '@mui/material';

interface Shop {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  brands: string[];
  description: string;
}

interface MapProps {
  shops: Shop[];
}

const Map: React.FC<MapProps> = ({ shops }) => {
  const [selectedShop, setSelectedShop] = React.useState<Shop | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 35.6812,
    lng: 139.7671
  };

  return (
    <Box sx={{ width: '100%', height: '600px' }}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
        >
          {shops.map((shop) => (
            <Marker
              key={shop.id}
              position={{ lat: shop.latitude, lng: shop.longitude }}
              onClick={() => setSelectedShop(shop)}
            />
          ))}

          {selectedShop && (
            <InfoWindow
              position={{ lat: selectedShop.latitude, lng: selectedShop.longitude }}
              onCloseClick={() => setSelectedShop(null)}
            >
              <Paper sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="h6">{selectedShop.name}</Typography>
                <Typography variant="body2">{selectedShop.address}</Typography>
                <Typography variant="body2">
                  取扱ブランド: {selectedShop.brands.join(', ')}
                </Typography>
                <Typography variant="body2">{selectedShop.description}</Typography>
              </Paper>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default Map; 