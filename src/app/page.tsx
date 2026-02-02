import React from 'react'
import HomeSlider from './_components/HomeSlider/HomeSlider'
import Slider from './_components/Slider/Slider'
import AllProducts from './_components/AllProducts/AllProducts'



export default async function Home() {


  return <>
    <HomeSlider/>
    <Slider />
    <AllProducts/>
  </>
}