import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Paper } from '@mui/material';
import type { Shop } from '../../../scheme/generated';

interface MapProps {
  shops: Shop[];
}

const Map: React.FC<MapProps> = ({ shops }) => {
  const [selectedShop, setSelectedShop] = React.useState<Shop | null>(null);
  const [mapError, setMapError] = React.useState<string | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 35.6812,
    lng: 139.7671
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Box sx={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">
          Google Maps APIキーが設定されていません。
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '600px' }}>
      {mapError ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="error">{mapError}</Typography>
        </Box>
      ) : (
        <LoadScript
          googleMapsApiKey={apiKey}
          onError={(error) => setMapError('Google Mapsの読み込みに失敗しました: ' + error.message)}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            onLoad={() => setMapError(null)}
          >
            {shops.map((shop) => (
              shop.latitude !== undefined && shop.longitude !== undefined && (
                <Marker
                  key={shop.id}
                  position={{ lat: shop.latitude, lng: shop.longitude }}
                  onClick={() => setSelectedShop(shop)}
                />
              )
            ))}

            {selectedShop && selectedShop.latitude !== undefined && selectedShop.longitude !== undefined && (
              <InfoWindow
                position={{ lat: selectedShop.latitude, lng: selectedShop.longitude }}
                onCloseClick={() => setSelectedShop(null)}
              >
                <Paper sx={{ p: 2, maxWidth: 300 }}>
                  <Typography variant="h6">{selectedShop.name}</Typography>
                  <Typography variant="body2">{selectedShop.address}</Typography>
                  <Typography variant="body2">
                    取扱ブランド: {selectedShop.brands?.join(', ') || 'なし'}
                  </Typography>
                  <Typography variant="body2">{selectedShop.description}</Typography>
                </Paper>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </Box>
  );
};

export default Map; 