'use client'

import { useEffect, useState } from 'react'
import React from 'react'
import { Product } from '@/types/product'
import api from '@/lib/api'
import { Link } from 'lucide-react'


export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
    .then((res) => { setProducts(res.data) } )
    .catch((err) => { console.error(err) })
    .finally(() => { setLoading(false) })
  })

  if (loading) return <p className='text-center mt-10'>Loading...</p>

  return (
    <>
        <div>
            {products.map((p) => (
                <Link key={p.id} href={'/products/{p.id}'}>
                    <div>
                        <img src={p.imageUrl} alt={p.name} />
                        <h1>{p.name}</h1>
                        <p>${p.price.toFixed(2)}</p>
                    </div>
                </Link>
            ))}
        </div>
    </>
  )
}
