<template>
  <v-dialog v-model="modelValue" width="400" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="flat" @click="onCancel" :disabled="loading">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="onConfirm" :loading="loading">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: boolean
  title?: string
  message: string
  loading?: boolean
}>()
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])
const modelValue = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})
const loading = computed(() => props.loading ?? false)
const title = computed(() => props.title ?? 'Confirmar acción')
const onCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
const onConfirm = () => {
  emit('confirm')
}
</script>

<style scoped></style>
