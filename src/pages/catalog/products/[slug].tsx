import { Title } from '@/styles/Pages/home'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { client } from '@/lib/prismic'
import { Document } from 'prismic-javascript/types/documents'

interface ProductProps {
  product: Document
}

export default function Product({ product }: ProductProps) {
  const router = useRouter()
  if (router.isFallback) {
    return <p>Loading....</p>
  }

  return (
    <div>
      <Title>{PrismicDOM.RichText.asText(product.data.title)}</Title>
      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      ></div>
      <img src={product.data.thumbnail.url} alt="product image" width="300" />
      <p>Price: ${product.data.price}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // fallback will try to find any page that has not been created
    // if fallback false, will return not found.
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params
  const product = await client().getByUID('product', String(slug), {})
  return {
    props: {
      product,
    },
    revalidate: 10,
  }
}
