<script src="./ListUsers.ts" lang="ts"></script>

<template>
  <!-- modales -->
  <AddEditUser v-model="userModal" v-if="userModal" :edit-data="userToEdit" />
  <ConfirmDialog
    v-model="confirmDialog"
    :message="confirmMessage"
    :loading="confirmLoading"
    :title="'Eliminar Usuario'"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
  <!-- Lista -->
  <VContainer fluid class="px-4">
    <VCard class="pa-4 elevation-2 mx-auto" width="1200" min-width="600" max-width="1200">
      <VRow no-gutters align="center">
        <VAvatar size="50" color="primary" tile>
          <VIcon dark>mdi-clipboard-text</VIcon>
        </VAvatar>
        <div class="ml-4 text-h5 font-weight-medium">
          {{ nameComponent }}
        </div>
        <VSpacer />
        <VBtn color="primary" @click="openModal(null)">
          <VIcon size="22" left> mdi-plus </VIcon>
          <span>Crear Usuario</span>
        </VBtn>
      </VRow>

      <VDivider class="my-4" />

      <VTable
        v-if="!isLoading"
        class="elevation-1"
        :height="users.length > 0 ? 'calc(90vh - 300px)' : 'auto'"
        fixed-header
      >
        <thead>
          <tr>
            <th class="text-center">ID</th>
            <th class="text-center">NOMBRE COMPLETO</th>
            <th class="text-center">USUARIO</th>
            <th class="text-center">EMAIL</th>
            <th class="text-center">TELÉFONO</th>
            <th class="text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tempUser in paginatedUsers" :key="tempUser.id">
            <td class="text-center">{{ tempUser.id }}</td>
            <td class="text-center">{{ tempUser.name }}</td>
            <td class="text-center">{{ tempUser.username }}</td>
            <td class="text-center">{{ tempUser.email }}</td>
            <td class="text-center">{{ tempUser.phone }}</td>
            <td class="text-center">
              <div class="d-flex justify-center">
                <VTooltip text="Editar" top>
                  <template v-slot:activator="{ props }">
                    <VBtn
                      color="info"
                      variant="plain"
                      size="x-small"
                      v-bind="props"
                      @click="openModal(tempUser)"
                    >
                      <VIcon icon="mdi-account-edit" size="22" />
                    </VBtn>
                  </template>
                </VTooltip>
                <VTooltip text="Eliminar" top>
                  <template v-slot:activator="{ props }">
                    <VBtn
                      color="error"
                      variant="plain"
                      size="x-small"
                      v-bind="props"
                      @click="handleDelete(tempUser)"
                    >
                      <VIcon icon="mdi-trash-can" size="22" />
                    </VBtn>
                  </template>
                </VTooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </VTable>

      <div class="d-flex justify-center align-center mt-4">
        <VPagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          :disabled="totalPages === 1"
          rounded
          prev-icon="mdi-chevron-left"
          next-icon="mdi-chevron-right"
        />
        <span class="ml-4 text-caption text-grey-darken-1">{{ visibleRangeLabel }}</span>
      </div>

      <div v-if="isLoading" class="d-flex justify-center align-center" style="height: 200px">
        <div class="text-center">
          <VProgressCircular indeterminate color="primary" size="40" />
          <div class="mt-3">Cargando usuarios...</div>
        </div>
      </div>
    </VCard>
  </VContainer>
</template>

<style scoped></style>
