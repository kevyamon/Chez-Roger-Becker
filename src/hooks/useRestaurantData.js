/**
 * Hook centralisé pour les données publiques du restaurant (useRestaurantData).
 * Gère le chargement initial, la résilience au réveil du serveur (cold start),
 * et la synchronisation en temps réel via Socket.IO.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/api';
import { socket } from '../services/socket';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getOrderStatusLabel } from '../utils/statusLabels';

export const useRestaurantData = () => {
  const { setDeliveryFee } = useCart();
  const { showInfo } = useToast();

  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isServerWaking, setIsServerWaking] = useState(false);

  const wakingTimerRef = useRef(null);

  const fetchAllData = useCallback(async () => {
    // Déclenche l'indicateur de réveil si le serveur met plus de 2.5s à répondre
    wakingTimerRef.current = setTimeout(() => {
      setIsServerWaking(true);
    }, 2500);

    try {
      const [catRes, dishRes, promoRes, restRes] = await Promise.all([
        apiClient.get('/categories').catch(() => ({ success: false })),
        apiClient.get('/dishes').catch(() => ({ success: false })),
        apiClient.get('/promotions').catch(() => ({ success: false })),
        apiClient.get('/restaurant').catch(() => ({ success: false }))
      ]);

      if (catRes.success && catRes.data?.categories) {
        setCategories(catRes.data.categories);
      }
      if (dishRes.success && dishRes.data?.dishes) {
        setDishes(dishRes.data.dishes);
      }
      if (promoRes.success && promoRes.data?.promotions) {
        setPromotions(promoRes.data.promotions);
      }
      if (restRes.success && restRes.data?.restaurant) {
        setRestaurant(restRes.data.restaurant);
        if (restRes.data.restaurant.deliveryFee !== undefined) {
          setDeliveryFee(restRes.data.restaurant.deliveryFee);
        }
      }
    } catch (err) {
      console.warn('Erreur lors de la récupération des données :', err.message);
    } finally {
      clearTimeout(wakingTimerRef.current);
      setIsLoading(false);
      setIsServerWaking(false);
    }
  }, [setDeliveryFee]);

  // Chargement initial
  useEffect(() => {
    fetchAllData();
    return () => clearTimeout(wakingTimerRef.current);
  }, [fetchAllData]);

  // Synchronisation temps réel via Socket.IO
  useEffect(() => {
    const onRestaurantUpdate = (upd) => {
      setRestaurant((prev) => ({ ...prev, ...upd }));
      if (upd.deliveryFee !== undefined) setDeliveryFee(upd.deliveryFee);
    };

    const onDishCreated = (d) => setDishes((prev) => [d, ...prev.filter((i) => i._id !== d._id)]);
    const onDishUpdated = (d) => setDishes((prev) => prev.map((i) => (i._id === d._id ? { ...i, ...d } : i)));
    const onDishDeleted = ({ dishId }) => setDishes((prev) => prev.filter((i) => i._id !== dishId));

    const onCatCreated = (c) => setCategories((prev) => [...prev.filter((i) => i._id !== c._id), c]);
    const onCatUpdated = (c) => setCategories((prev) => prev.map((i) => (i._id === c._id ? { ...i, ...c } : i)));
    const onCatDeleted = ({ categoryId }) => setCategories((prev) => prev.filter((i) => i._id !== categoryId));

    const onPromoCreated = (p) => setPromotions((prev) => [p, ...prev.filter((item) => item._id !== p._id)]);
    const onPromoUpdated = (p) => setPromotions((prev) => prev.map((item) => (item._id === p._id ? { ...item, ...p } : item)));
    const onPromoDeleted = ({ promoId }) => setPromotions((prev) => prev.filter((item) => item._id !== promoId));

    const onOrderStatus = (data) => {
      try {
        const history = JSON.parse(localStorage.getItem('rb_orders_history') || '[]');
        const match = history.find((o) => o.trackingToken === data.trackingToken || o.orderNumber === data.orderNumber);
        if (match) {
          const updated = history.map((o) =>
            o.trackingToken === data.trackingToken || o.orderNumber === data.orderNumber
              ? { ...o, status: data.status }
              : o
          );
          localStorage.setItem('rb_orders_history', JSON.stringify(updated));
          showInfo(`Votre commande #${data.orderNumber || match.orderNumber} : ${getOrderStatusLabel(data.status)}`);
        }
      } catch {}
    };

    socket.on('restaurant:updated', onRestaurantUpdate);
    socket.on('dish:created', onDishCreated);
    socket.on('dish:updated', onDishUpdated);
    socket.on('dish:deleted', onDishDeleted);
    socket.on('category:created', onCatCreated);
    socket.on('category:updated', onCatUpdated);
    socket.on('category:deleted', onCatDeleted);
    socket.on('promotion:created', onPromoCreated);
    socket.on('promotion:updated', onPromoUpdated);
    socket.on('promotion:deleted', onPromoDeleted);
    socket.on('order:status-changed', onOrderStatus);

    return () => {
      socket.off('restaurant:updated', onRestaurantUpdate);
      socket.off('dish:created', onDishCreated);
      socket.off('dish:updated', onDishUpdated);
      socket.off('dish:deleted', onDishDeleted);
      socket.off('category:created', onCatCreated);
      socket.off('category:updated', onCatUpdated);
      socket.off('category:deleted', onCatDeleted);
      socket.off('promotion:created', onPromoCreated);
      socket.off('promotion:updated', onPromoUpdated);
      socket.off('promotion:deleted', onPromoDeleted);
      socket.off('order:status-changed', onOrderStatus);
    };
  }, [setDeliveryFee, showInfo]);

  return {
    categories,
    dishes,
    promotions,
    restaurant,
    isLoading,
    isServerWaking,
    refreshData: fetchAllData
  };
};
