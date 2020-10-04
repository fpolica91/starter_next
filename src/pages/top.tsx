import { GetStaticProps } from 'next'
import { Title } from '../styles/Pages/home'

interface Products {
  id: string
  title: string
}

interface TopProps {
  products: Products[]
}

export default function Top({ products }: TopProps) {
  return (
    <div>
      <section>
        <Title>Products</Title>
        <ul>
          {products.map((product) => (
            <li id={product.id}>{product.title}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps<TopProps> = async (context) => {
  const response = await fetch('http://localhost:3333/products')
  const products = await response.json()
  return {
    props: {
      products,
    },
    revalidate: 5,
  }
}
