import { defineComponent, onMounted, ref, computed, watch } from 'vue'
import { useUsers } from '@/composables/useUsers.ts'
import AddEditUser from '@/views/modals/AddEditUser.vue'
import type { UserModel } from '@/models/usersModel.ts'
import ConfirmDialog from '@/common/component/confirm-dialog/ConfirmDialog.vue'

export default defineComponent({
  name: 'ListUsers',
  components: { AddEditUser, ConfirmDialog },
  props: {
    title: {
      type: String,
      default: 'Listado',
      required: true,
    },
  },
  setup(props) {
    const { users, fetchUsers, isLoading, deleteUser } = useUsers()
    const nameComponent = props.title
    const userModal = ref(false)
    const userToEdit = ref<null | UserModel>(null)
    const confirmDialog = ref(false)
    const confirmMessage = ref('')
    const confirmLoading = ref(false)
    const confirmAction = ref<null | (() => Promise<void>)>(null)


    // Paginación inicio
    const pageSize = 8
    const currentPage = ref(1)
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      return users.value.slice(start, start + pageSize)
    })
    const totalPages = computed(() => Math.ceil(users.value.length / pageSize))

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }
    const goToPrev = () => { if (currentPage.value > 1) currentPage.value-- }
    const goToNext = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
    // Paginación final

    const openModal = (user: UserModel | null = null) => {
      userToEdit.value = user
      userModal.value = true
    }

    watch(users, (newVal, oldVal) => {
      if (newVal.length > oldVal.length) {
        currentPage.value = 1
      }
    })

    onMounted(async () => {
      await fetchUsers()
    })

    const showConfirm = (message: string, action: () => Promise<void>) => {
      confirmMessage.value = message
      confirmAction.value = action
      confirmDialog.value = true
    }

    const handleDelete = async (id: number) => {
      showConfirm('¿Deseas borrar este usuario?', async () => {
        confirmLoading.value = true
        await new Promise(r => setTimeout(r, 1200))
        deleteUser(id)
        confirmLoading.value = false
        confirmDialog.value = false
      })
    }

    const onConfirm = async () => {
      if (confirmAction.value) await confirmAction.value()
    }

    const onCancel = () => {
      confirmDialog.value = false
    }

    return {
      users,
      paginatedUsers,
      isLoading,
      nameComponent,
      userModal,
      userToEdit,
      openModal,
      deleteUser,
      confirmDialog,
      confirmMessage,
      confirmLoading,
      onConfirm,
      onCancel,
      handleDelete,
      currentPage,
      totalPages,
      goToPage,
      goToPrev,
      goToNext
    }
  },
})
