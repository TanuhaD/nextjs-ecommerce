"use client";

import { ProductType } from "@/types/product";
// @ts-ignore
import Glide from "@glidejs/glide";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SliderProductsProps {
  featuredProductS: ProductType[];
}
export default function SliderProducts({
  featuredProductS,
}: SliderProductsProps) {
  const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    const glide = new Glide(".glide", {
      type: "carousel",
      startAt: 0,
      perView: 3,
      gap: 10,
      autoplay: 3000,
      // peek: { before: 50, after: 50 },
      breakpoints: {
        2000: {
          perView: 5,
        },
        1024: {
          perView: 4,
        },
        500: {
          perView: 3,
        },
      },
    });
    glide.on("mount.after", function () {
      setShowSlider(true);
    });
    glide.mount();
    return () => {
      glide.destroy();
    };
  }, []);

  return (
    <div>
      <div
        className={`relative p-4 sm:h-[180px] sm:w-[300px] md:h-[300px]  md:w-[700px]  lg:w-[1000px] opacity-${
          showSlider ? "100" : "0"
        }`}
      >
        <div className="glide">
          <div
            className="glide__arrows absolute z-10 flex w-full justify-between sm:top-14 md:top-20 lg:top-24 "
            data-glide-el="controls"
          >
            <button
              className="glide__arrow glide__arrow--left"
              data-glide-dir="<"
            >
              &#5130;
            </button>
            <button
              className="glide__arrow glide__arrow--right"
              data-glide-dir=">"
            >
              &#5125;
            </button>
          </div>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {featuredProductS?.map((product) => (
                <li key={product.id} className="  ">
                  <Link
                    href={"/product/" + product.id}
                    className="glide__slide "
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        backgroundPosition: "top right, center",
                        display: "block",
                        // cover, contain, none
                      }}
                      className=" rounded-lg shadow-2xl  transition  duration-500  ease-in-out hover:scale-105  "
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
