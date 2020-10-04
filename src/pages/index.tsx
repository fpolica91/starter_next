import { GetServerSideProps } from 'next'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Title } from '../styles/Pages/home'
import SEO from '@/components/SEO'
import { client } from '../lib/prismic'

interface IHomeProps {
  recommendedProducts: Document[]
}
const Modal = dynamic(() => import('../components/modal'), {
  loading: () => <p>loading...</p>,
  ssr: false,
})

export default function Home({ recommendedProducts }: IHomeProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <SEO title="Home" />
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map((product) => (
            <li key={product.id}>
              <Link href={`catalog/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <button onClick={() => setVisible(!visible)}>Add To Cart</button>
      {visible && <Modal />}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
  ])
  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  }
}
