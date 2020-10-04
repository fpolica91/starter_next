import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Title } from '../styles/Pages/home'

interface Products {
  id: string
  title: string
}

interface IHomeProps {
  recommendedProducts: Products[]
}
const Modal = dynamic(() => import('../components/modal'), {
  loading: () => <p>loading...</p>,
  ssr: false,
})

export default function Home({ recommendedProducts }: IHomeProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map((product) => (
            <li id={product.id}>{product.title}</li>
          ))}
        </ul>
      </section>
      <button onClick={() => setVisible(!visible)}>Add To Cart</button>
      {visible && <Modal />}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const response = await fetch('http://localhost:3333/recommended')
  const recommendedProducts = await response.json()
  return {
    props: {
      recommendedProducts,
    },
  }
}
