import ProductDetails from "./ProductDetails";
import { appUrl } from "@/utils/api";

export async function generateMetadata({ params }) {
  const { category, slug } = await params;

  try {
    const res = await fetch(
      `${appUrl}/api/v1/product/${category}/${slug}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();
    const product = data?.product;

    if (!product) {
      return {
        title: "Product Not Found | UniQbd",
        description: "This product does not exist",
      };
    }

    return {
      title: `${product.name} | UniQbd`,
      description:
        product.shortDescription ||
        product.description?.slice(0, 160),
    };
  } catch (error) {
    return {
      title: "UniQbd",
      description: "Gaming Products Store",
    };
  }
}

export default function Page() {
  return <ProductDetails />;
}