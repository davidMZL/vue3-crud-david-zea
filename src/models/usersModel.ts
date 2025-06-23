interface FullUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    city: string
    zipcode: string
  }
  company: {
    name: string
    bs: string
  }
}

export type UserModel = Pick<FullUser, 'id' | 'name' | 'username' | 'email' | 'phone'>
