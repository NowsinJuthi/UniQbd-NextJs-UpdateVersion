import ProductDetails from "./ProductDetails";


export async function generateMetadata({ params }) {
  const { slug } = await params;

  const res = await fetch(
    `https://uniqbd-nextjs-updateversion-backend.onrender.com/api/v1/product/${slug}`,
    { cache: "no-store" }
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
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | UniQbd`,
      description: product.shortDescription,
      images: [
        `https://uniqbd-nextjs-updateversion-backend.onrender.com/uploads/${product.photo}`,
      ],
    },
  };
}

export default function Page() {
  return <ProductDetails />;
}