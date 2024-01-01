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
  // const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    const glide = new Glide(".glide", {
      type: "carousel",
      startAt: 0,
      perView: 3,
      gap: 10,
      autoplay: 3000,
      focusAt: "center",

      breakpoints: {
        2000: {
          perView: 5,
        },
        1024: {
          perView: 4,
        },
        900: {
          perView: 4,
        },
        800: {
          perView: 4,
        },
        760: {
          perView: 2,
        },
        748: {
          perView: 2,
        },
        730: {
          perView: 2,
        },
        700: {
          perView: 2,
        },
        600: {
          perView: 2,
        },
        320: {
          perView: 2,
        },
      },
    });
    // glide.on("mount.after", function () {
    //   setShowSlider(true);
    // });

    glide.mount();

    return () => {
      glide.destroy();
    };
  }, [featuredProductS]);

  return (
    <div
      className={`relative p-4 opacity-100 sm:mb-2 sm:w-[280px] md:mb-4 md:w-[700px] lg:w-[1000px] `}
    >
      <div className="glide w-full ">
        <div
          className="glide__arrows absolute z-10 flex w-full justify-between sm:top-8 md:top-10  "
          data-glide-el="controls"
        >
          <button
            className="glide__arrow glide__arrow--left "
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
        <div className="glide__track " data-glide-el="track">
          <ul className="glide__slides p-2 lg:gap-2 ">
            {featuredProductS?.map((product) => (
              <li key={product.id} className=" shadow-2xl">
                <Link
                  href={"/product/" + product.id}
                  className="glide__slide block "
                >
                  <div className="relative rounded-lg border sm:h-[100px] sm:w-[120px] md:h-[150px] md:w-[150px] lg:h-[170px] lg:w-[190px]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="100%"
                      className="rounded-lg border  transition  duration-500 ease-in-out  hover:scale-105 "
                      style={{
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
