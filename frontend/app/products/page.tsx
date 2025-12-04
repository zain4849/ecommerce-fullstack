'use client'

import { useEffect, useState } from 'react'
import React from 'react'
import { Product } from '@/types/product'
import api from '@/lib/api'
import { Link } from 'lucide-react'
import useBlur from '@/context/BlurContext'


export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
const {isBlur} = useBlur()

  useEffect(() => {
    api.get('/products')
    .then((res) => { setProducts(res.data) } )
    .catch((err) => { console.error(err) })
    .finally(() => { setLoading(false) })
  }, [])

  if (loading) return <p className='text-center mt-10'>Loading...</p>

  return (
    <>
        <div className={isBlur ? 'blur-lg': ''}>
            {products.map((p) => (
                <Link key={p._id} href={'/products/{p.id}'}>
                    <div>
                        <img src={p.images} alt={p.name} />
                        <h1>{p.name}</h1>
                        <p><svg className='w-2 h-2'><path d='../public/UAE_Dirham_Symbol.svg'></path></svg>{p.price.toFixed(2)}</p>
                    </div>
                </Link>
            ))}
        </div>
    </>
  )
}
