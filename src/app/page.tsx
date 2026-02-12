import React from 'react'
import HomeSlider from './_components/HomeSlider/HomeSlider'
import AllProducts from './_components/AllProducts/AllProducts'
import { getCategories } from '@/api/category.api'
import CategorySlider from './_components/CategorySlider/CategorySlider'

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <HomeSlider />
      <CategorySlider categories={categories} />
      <AllProducts />
    </>
  )
}