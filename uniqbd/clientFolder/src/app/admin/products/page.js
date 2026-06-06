import { Suspense } from "react";
import Products from "./Products";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Products />
    </Suspense>
  );
}