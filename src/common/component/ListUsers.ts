import { defineComponent, onMounted, ref } from 'vue'
import { useUsers } from '@/composables/useUsers.ts'
import AddEditUser from '@/views/modals/AddEditUser.vue'
import type { UserModel } from '@/models/usersModel'
export default defineComponent({
  name: 'ListUsers',
  components: { AddEditUser },
  props: {
    title: {
      type: String,
      default: 'Listado',
      required: true,
    },
  },
  setup(props) {
    const { users, fetchUsers, isLoading,deleteUser } = useUsers()
    const nameComponent = props.title
    const userModal = ref(false)
    const userToEdit = ref<null | UserModel>(null)
    onMounted(async () => {
      await fetchUsers()
    })
    const openModal = (user: UserModel | null = null) => {
      userToEdit.value = user
      userModal.value = true
    }
    return {
      users,
      isLoading,
      nameComponent,
      userModal,
      userToEdit,
      openModal,
      deleteUser
    }
  },
})
