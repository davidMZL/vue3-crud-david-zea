import { defineStore } from 'pinia'
import usersService from '@/service/users.ts'
import type { UserModel } from '@/models/usersModel.ts'

export interface UserState {
  users: UserModel[]
  isLoading: boolean
}

export const useUsersStore = defineStore('usersStore', {
  state: (): UserState => ({
    users: [],
    isLoading: false,
  }),

  actions: {
    async fetchUsers(): Promise<void> {
      this.isLoading = true
      try {
        this.users = await usersService.getAll()
        //console.log("this.users", this.users)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        this.isLoading = false
      }
    },

    newUser(user: UserModel): void {
      const maxId = this.users.reduce((max, { id }) => (id > max ? id : max), 0)
      const newUser = { ...user, id: maxId + 1 }
      this.users = [newUser, ...this.users]
    },

    updateUser(user: UserModel): void {
      this.users = this.users.map(u => u.id === user.id ? { ...u, ...user } : u)
    },

    deleteUser(id: number): void {
      this.users = this.users.filter(u => u.id !== id)
    },
  }
})
