import { Title } from '@/styles/Pages/home'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

export default function Category({ products }) {
  const router = useRouter()
  if (router.isFallback) {
    return <p>Loading....</p>
  }
  return (
    <div>
      <section>
        <Title>Categories</Title>
        <ul>
          {products.map((product) => (
            <li id={product.id}>{product.title}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('http://localhost:3333/categories')
  const categories = await response.json()
  const paths = categories.map((category) => {
    return {
      params: { slug: category.id },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params
  const response = await fetch(
    `http://localhost:3333/products?category_id=${slug}`
  )
  const products = await response.json()
  return {
    props: {
      products,
    },
    revalidate: 60,
  }
}
