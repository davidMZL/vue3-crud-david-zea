<template>
  <v-dialog v-model="value" width="500" persistent>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        {{ props.editData ? 'Editar Usuario' : 'Agregar Usuario' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            variant="outlined"
            v-model="name"
            :rules="[validators.required, validators.namesValidator]"
            label="Nombre"
            required
          />

          <v-text-field
            variant="outlined"
            v-model="email"
            :rules="[validators.required, validators.emailValidator]"
            label="E-mail"
            placeholder="ejemplo@correo.com"
            required
          />
          <v-text-field
            variant="outlined"
            v-model="username"
            :rules="[validators.required, validators.userNamesValidator]"
            label="Nombre de Usuario"
            required
          />

          <v-text-field
            variant="outlined"
            v-model="phone"
            :rules="[validators.required, validators.phoneNumberValidator]"
            label="Nro. de teléfono"
            required
          />
          <v-btn type="button" @click="onSaveClick" color="success" class="mr-4"> Guardar </v-btn>

          <v-btn color="error" type="button" class="mr-4" @click="close"> Cancelar </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <ConfirmDialog
    v-model="confirmDialog"
    :message="confirmMessage"
    :loading="confirmLoading"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
<script setup lang="ts">
import type { UserModel } from '@/models/usersModel.ts'
import { useUsersStore } from '@/stores/usersStore.ts'
import { computed, ref } from 'vue'
import ConfirmDialog from '@/common/component/confirm-dialog/ConfirmDialog.vue'
import {
  emailValidator,
  namesValidator,
  phoneNumberValidator,
  required,
  userNamesValidator,
} from '@/common/validators'
const form = ref()
const name = ref('')
const username = ref('')
const email = ref('')
const phone = ref('')
const userStore = useUsersStore()
const props = defineProps<{
  modelValue: boolean
  editData?: UserModel
}>()
if (props.editData) {
  name.value = props.editData.name
  username.value = props.editData.username
  email.value = props.editData.email
  phone.value = props.editData.phone
}
const validators = {
  required,
  emailValidator,
  phoneNumberValidator,
  namesValidator,
  userNamesValidator,
}
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const confirmDialog = ref(false)
const confirmMessage = ref('')
const confirmLoading = ref(false)
let saveAction: (() => Promise<void>) | null = null

const onSaveClick = async () => {
  const { valid } = (await form.value?.validate()) ?? { valid: false }
  if (!valid) return
  confirmMessage.value = props.editData
    ? '¿Deseas guardar los cambios de este usuario?'
    : '¿Deseas agregar este usuario?'
  saveAction = save
  confirmDialog.value = true
}

const onConfirm = async () => {
  if (saveAction) {
    confirmLoading.value = true
    await new Promise((r) => setTimeout(r, 1200))
    await saveAction()
    confirmLoading.value = false
    confirmDialog.value = false
    saveAction = null
  }
}
const onCancel = () => {
  confirmDialog.value = false
  saveAction = null
}

const save = async () => {
  const { valid } = (await form.value?.validate()) ?? { valid: false }
  if (!valid) return
  const data: UserModel = {
    name: name.value,
    username: username.value,
    email: email.value,
    phone: phone.value,
  }
  if (!props.editData) {
    userStore.newUser(data)
  } else {
    userStore.updateUser({
      id: props.editData.id,
      ...data,
    })
  }
  close()
}
const close = () => {
  emit('update:modelValue', false)
}
</script>
<style scoped></style>
