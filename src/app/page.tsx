import React from 'react'
import HomeSlider from './_components/HomeSlider/HomeSlider'
import AllProducts from './_components/AllProducts/AllProducts'
import { getCategories, Category } from '@/api/category.api'
import CategorySlider from './_components/CategorySlider/CategorySlider'

export default async function Home() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <>
      <HomeSlider />
      <CategorySlider categories={categories} />
      <AllProducts />
    </>
  )
}