import { defineComponent, onMounted, ref } from 'vue'
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
    const { users, fetchUsers, isLoading,deleteUser } = useUsers()
    const nameComponent = props.title
    const userModal = ref(false)
    const userToEdit = ref<null | UserModel>(null)
    const confirmDialog = ref(false)
    const confirmMessage = ref('')
    const confirmLoading = ref(false)
    const confirmAction = ref<null | (() => Promise<void>)>(null)

    onMounted(async () => {
      await fetchUsers()
    })
    const openModal = (user: UserModel | null = null) => {
      userToEdit.value = user
      userModal.value = true
    }

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
      handleDelete
    }
  },
})
