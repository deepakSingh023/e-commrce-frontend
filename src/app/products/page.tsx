import FilterProduct from "@/components/FilterProduct"
import { GetStaticProps } from 'next';
import { Product } from '../../types/product';
import { fetchAllProducts } from '../../lib/api';
import Link from 'next/link';



interface ProductsPageProps {
  products: Product[];
}


export default function product({ products }: ProductsPageProps){
    return(
        <div>
            <div>
            <h1 className="text-4xl m-5">My Products</h1>
            <h2 className="text-2xl ml-5">Discover all our products here</h2>
            </div>
            <div>
                <FilterProduct/>
            </div>
            <div>
                

            </div>
        </div>
        
    )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await fetchAllProducts();
  return {
    props: { products },
    revalidate: 60, // Optional: Rebuild page after 60 seconds (ISR)
  };
};