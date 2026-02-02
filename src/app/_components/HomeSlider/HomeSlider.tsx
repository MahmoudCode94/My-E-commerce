"use client";
import img1 from "../../../../public/12314c28e35cb203fecbd3119e9134bc.jpg";
import img2 from "../../../../public/5caf66ede5627161b0ad983a00b74c81.jpg";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

export default function HomeSlider() {
    const allImages = [
        "/img22.jpg",
        "/img44.jpg",
        "/img11.jpg",
        "/img33.jpg",
    ];

    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    );

    return (
        <div className="flex px-6 md:px-20 relative">
            <div className="flex-1 overflow-hidden rounded-b-xl lg:rounded-t-none lg:rounded-br-none">
                <Carousel
                    plugins={[plugin.current]}
                    opts={{
                        loop: true,
                        align: "start",
                    }}
                    className="w-full relative"
                >
                    <CarouselContent className="flex ml-0">
                        {allImages.map((src, index) => (
                            <CarouselItem
                                key={index}
                                className="min-w-full flex-[0_0_100%] pl-0"
                            >
                                <div className="relative w-full h-30 md:h-50 lg:h-55 overflow-hidden">
                                    <Image
                                        src={src}
                                        alt={`Banner ${index}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="hidden md:flex flex-col rounded-br-xl overflow-hidden">
                <Image 
                    src={img1} 
                    alt="staticSlider" 
                    className="w-50 h-15 md:h-25 lg:h-27.5  object-cover"
                />
                <Image 
                    src={img2} 
                    alt="staticSlider" 
                    className="w-50 h-15 md:h-25 lg:h-27.5  object-cover"
                />
            </div>
        </div>
    );
}