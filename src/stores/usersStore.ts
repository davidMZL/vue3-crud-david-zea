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
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        this.isLoading = false
      }
    },
    newUser(user: UserModel): void {
      const maxId = this.users.reduce((max, { id }) => (id && id > max ? id : max), 0)
      user.id = maxId + 1
      this.users.push(user)
    },
    updateUser(user: UserModel): void {
      const idx = this.users.findIndex(({ id }) => id == user.id)
      if (idx > -1) {
        this.users[idx] = { ...user }
      }
    },
    deleteUser(id: number): void {
      const idx = this.users.findIndex(({ id: userId }) => userId == id)
      if (idx > -1) {
        this.users.splice(idx, 1)
      }
    },
  },
})
