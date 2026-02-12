import React from 'react'
import CategorySlider from '../CategorySlider/CategorySlider'
import { Category } from '@/api/category.api'

export default function Slider({ categories }: { categories: Category[] }) {
    return (
        <div className="w-full">
            <CategorySlider categories={categories} />
        </div>
    )
}