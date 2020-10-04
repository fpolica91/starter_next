import { Title } from '@/styles/Pages/home'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { client } from '@/lib/prismic'
import { Document } from 'prismic-javascript/types/documents'

interface CategoryProps {
  category: Document
  products: Document[]
}

export default function Category({ category, products }: CategoryProps) {
  const router = useRouter()
  if (router.isFallback) {
    return <p>Loading....</p>
  }
  return (
    <div>
      <section>
        <Title>{PrismicDOM.RichText.asText(category.data.title)}</Title>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`catalog/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ])

  const paths = categories.results.map((category) => {
    return {
      params: { slug: category.uid },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params
  const category = await client().getByUID('category', String(slug), {})
  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id),
  ])
  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  }
}
