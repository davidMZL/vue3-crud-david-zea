<template>
  <v-dialog v-model="value" width="500">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2"> Privacy Policy </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="name"
            :counter="10"
            :rules="[isRequired]"
            label="Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="[isRequired, isEmail]"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="username"
            :counter="10"
            :rules="[isRequired]"
            label="Username"
            required
          ></v-text-field>

          <v-text-field
            v-model="phone"
            :counter="10"
            :rules="[isRequired]"
            label="Phone"
            required
          ></v-text-field>
          <v-btn type="button" @click="save" color="success" class="mr-4"> Save </v-btn>

          <v-btn color="error" type="button" class="mr-4" @click="close"> Cancel </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type { UserModel } from '@/models/usersModel'
import { useUsersStore } from '@/stores/usersStore'
import { computed, ref } from 'vue'
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
const isRequired = (value: string) => !!value || 'This field is required'
const isEmail = (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid'
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

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
