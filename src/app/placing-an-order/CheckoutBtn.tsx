"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CheckoutBtn(): JSX.Element {
  const router = useRouter();
  const handleBtnClick = async () => {
    try {
      const response = await fetch("/api/checkout");

      if (response.ok) {
        MySwal.fire({
          title: "Formalized!",
          text: "Your order has been sent.",
          icon: "success",
        }).then(() => {
          router.push("/orders");
        });
      } else {
        MySwal.fire({
          title: "Error",
          text: "Error:Your order has not been sent ",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: "Error:Your order has not been sent " + error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <button
      onClick={handleBtnClick}
      className="btn-primary btn  shadow-md hover:shadow-2xl sm:w-[200px]"
    >
      Checkout
    </button>
  );
}
