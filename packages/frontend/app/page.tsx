'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Map from './components/Map';
import axios from 'axios';

interface Shop {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  brands: string[];
  description: string;
}

export default function Home() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [open, setOpen] = useState(false);
  const [newShop, setNewShop] = useState({
    name: '',
    address: '',
    brands: '',
    description: ''
  });

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const shopData = {
        ...newShop,
        brands: newShop.brands.split(',').map((brand: string) => brand.trim())
      };
      
      await axios.post('http://localhost:8000/api/shops', shopData);
      setOpen(false);
      setNewShop({ name: '', address: '', brands: '', description: '' });
      fetchShops();
    } catch (error) {
      console.error('Error creating shop:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          セレクトショップマップ
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          新しい店舗を追加
        </Button>

        <Map shops={shops} />

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>新しい店舗を追加</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="店舗名"
              fullWidth
              value={newShop.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewShop({ ...newShop, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="住所"
              fullWidth
              value={newShop.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewShop({ ...newShop, address: e.target.value })}
            />
            <TextField
              margin="dense"
              label="取扱ブランド（カンマ区切り）"
              fullWidth
              value={newShop.brands}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewShop({ ...newShop, brands: e.target.value })}
            />
            <TextField
              margin="dense"
              label="説明"
              fullWidth
              multiline
              rows={4}
              value={newShop.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewShop({ ...newShop, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>キャンセル</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              追加
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
} 