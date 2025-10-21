'use client'

import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import Order from '@/types/order'
import React, { useEffect, useState } from 'react'

const OrdersPage = () => {
  const {user} = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      api.get('/orders/me')
        .then(res => setOrders(res.data))
        .catch(err => console.log(err)
        )
    }
  }, [user])

  if (!user) return <p className='text-center mt-10'>Please Login to view your Orders.</p>
  if (orders.length === 0) return <p className='text-center mt-10'>No orders yet.</p>

  return (
    <div>
      <h1>Total Orders</h1>
      <ul>
        <li>
          <p><strong>Order ID:</strong></p>
          <p><strong>Total:</strong></p>
          <p><strong>Status:</strong></p>
          <p>Date of Order</p>
        </li>
      </ul>
    </div>
  )
}

export default OrdersPage 



/* Express backend example
 router.get("/orders/me", authenticateUser, (req, res) => {
   const userId = req.user.id; // decoded from token
   const orders = getOrdersForUser(userId);
   res.json(orders);
 });
 ➡️ The backend now knows who "me" is, because it can decode the JWT from the Authorization header.
*/

