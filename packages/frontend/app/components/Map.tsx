import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Paper } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 35.6895,
  lng: 139.7007
};

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
  onMarkerClick?: (shop: Shop) => void;
}

const Map: React.FC<MapProps> = ({ shops, onMarkerClick }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
    if (shops.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      shops.forEach((shop: Shop) => {
        bounds.extend({ lat: shop.latitude, lng: shop.longitude });
      });
      map.fitBounds(bounds);
    }
  }, [shops]);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={shops.length === 0 ? 13 : undefined}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {shops.map((shop: Shop) => (
        <Marker
          key={shop.id}
          position={{ lat: shop.latitude, lng: shop.longitude }}
          onClick={() => {
            setSelectedShop(shop);
            if (onMarkerClick) onMarkerClick(shop);
          }}
        />
      ))}

      {selectedShop && (
        <InfoWindow
          position={{ lat: selectedShop.latitude, lng: selectedShop.longitude }}
          onCloseClick={() => setSelectedShop(null)}
        >
          <Paper elevation={3} sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="h6">{selectedShop.name}</Typography>
            <Typography variant="body2">{selectedShop.address}</Typography>
            {selectedShop.brands && selectedShop.brands.length > 0 && (
              <Typography variant="body2">
                取扱ブランド: {selectedShop.brands.join(', ')}
              </Typography>
            )}
            {selectedShop.description && (
              <Typography variant="body2">{selectedShop.description}</Typography>
            )}
          </Paper>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map; 