'use client';

import { useEffect } from 'react';
import { getSocket, disconnectSocket } from '@/api/socket';
import { productsStore } from '@/stores/products.store';
import type { Product } from '@/types';

export default function SocketProvider() {
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('product:created', (product: Product) => {
      productsStore.onProductCreated(product);
    });

    socket.on('product:updated', (product: Product) => {
      productsStore.onProductUpdated(product);
    });

    socket.on('product:deleted', ({ id }: { id: string }) => {
      productsStore.onProductDeleted(id);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return null;
}
