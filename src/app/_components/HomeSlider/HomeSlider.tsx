"use client"
import img1 from "../../../../public/12314c28e35cb203fecbd3119e9134bc.jpg"
import img2 from "../../../../public/5caf66ede5627161b0ad983a00b74c81.jpg"

import React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

export default function HomeSlider() {
    const allImages = [
        "/12314c28e35cb203fecbd3119e9134bc.jpg",
        "/5caf66ede5627161b0ad983a00b74c81.jpg",
        "/6ddf0634083e029d7a117867019b8f0e.jpg",
        "/b6f48d731e8ed8bb57effe3cbe0c3d9d.jpg",
    ]

    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )

    return (
        <div style={{ padding: '0rem 5rem', position: 'relative', display: 'flex' ,}}>
            <div style={{ width: '100%' ,borderRadius:'0 0 0 10px', overflow:'hidden'}}>
                <Carousel
                    plugins={[plugin.current]}
                    opts={{
                        loop: true,
                        align: "start",
                    }}
                    className="w-full relative"
                >
                    <CarouselContent style={{ display: 'flex', marginLeft: 0 }}>
                        {allImages.map((src, index) => (
                            <CarouselItem
                                key={index}
                                style={{
                                    minWidth: '100%',
                                    flex: '0 0 100%',
                                    paddingLeft: 0
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '270px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Image
                                        src={src}
                                        alt={`Banner ${index}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority={index === 0}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div style={{borderRadius:'0 0 10px 0', overflow:'hidden'}}>
                <Image src={img1} className="" style={{ width: '200px', height: '135px', objectFit: 'cover' }}></Image>
                <Image src={img2} className="" style={{ width: '200px', height: '135px', objectFit: 'cover' }}></Image>
            </div>
        </div>
    )
}