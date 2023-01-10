interface ProductMetadata {
  role: string
}

export interface Product {
  name: string
  images: string[]
  price: {
    amount: number,
    id: string
  }
  active: boolean
  description: string
  metadata: ProductMetadata
}
