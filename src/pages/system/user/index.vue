<template>
  <BasicContent v-if="pagePermission.page">
    <template #top>
      <BasicSearch
        :list="searchList"
        :data="searches.data"
        :isLoading="isLoading"
        :isCreate="pagePermission.create"
        @onCreate="onCreate"
        @handleFinish="handleSearch"
      />
    </template>

    <BasicTable
      :data="tables"
      :columns="tableColumns"
      :isLoading="isLoading"
    >
      <template v-slot:operate='row'>
        <Button
          v-if="pagePermission.permission"
          class="mr-2"
          :isLoading="isLoading"
          @click="openPermission(row.record.id)"
        >
          权限
        </Button>
        <UpdateBtn
          v-if="pagePermission.update"
          class="mr-2"
          :isLoading="isCreateLoading"
          @click="onUpdate(row.record)"
        />
        <DeleteBtn
          v-if="pagePermission.delete"
          :isLoading="isLoading"
          @click="handleDelete(row.record.id)"
        />
      </template>
    </BasicTable>

    <template #footer>
      <BasicPagination
        :page="pagination.page"
        :pageSize="pagination.pageSize"
        :total="tables.total"
        :isLoading="isLoading"
        @handleChange="handlePagination"
      />
    </template>
  </BasicContent>

  <BasicModal
    v-model:isVisible="creates.isVisible"
    :isLoading="isCreateLoading"
    :title="creates.title"
    @handleFinish="createSubmit"
    @handleCancel="onCloseCreate"
  >
    <BasicForm
      ref="createFormRef"
      :list="createList"
      :labelCol="{ span: 6 }"
      :data="creates.data"
      @handleFinish="handleCreate"
    />
  </BasicModal>

  <PermissionDrawer
    :isVisible="permissionConfig.isVisible"
    :treeData="permissionConfig.treeData"
    :checkedKeys="permissionConfig.checkedKeys"
    @onClose="closePermission"
    @onSubmit="permissionSubmit"
  />
</template>

<script lang="ts" setup>
import type { FormData } from '#/form';
import type { BasicFormProps } from '@/components/Form/model';
import type { CreateData, SearchData, TableData, PaginationData } from '#/public';
import type { DataNode } from 'ant-design-vue/lib/tree';
import type { Key } from 'ant-design-vue/lib/vc-tree/interface';
import { message, Button } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { UpdateBtn, DeleteBtn } from '@/components/Buttons';
import { ADD_TITLE, EDIT_TITLE } from '@/utils/config';
import { searchList, createList, tableColumns } from './model';
import { useTitle } from '@/hooks/useTitle';
import { checkPermission } from '@/utils/permissions';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { getPermission, savePermission } from '@/servers/system/menu';
import {
  getSystemUserPage,
  getSystemUserById,
  createSystemUser,
  updateSystemUser,
  deleteSystemUser,
} from '@/servers/system/user';
import BasicContent from '@/components/Content/BasicContent.vue';
import BasicTable from '@/components/Table/BasicTable.vue';
import BasicPagination from '@/components/Pagination/BasicPagination.vue';
import BasicSearch from '@/components/Search/BasicSearch.vue';
import BasicForm from '@/components/Form/BasicForm.vue';
import BasicModal from '@/components/Modal/BasicModal.vue';
import PermissionDrawer from './components/PermissionDrawer.vue';

interface PermissionConfig {
  id: string;
  isVisible: boolean;
  checkedKeys: Key[];
  treeData: DataNode[];
}

defineOptions({
  name: 'SystemUser'
});

useTitle('用户管理');
const userStore = useUserStore();
const { permissions } = storeToRefs(userStore);
const isLoading = ref(false);
const isCreateLoading = ref(false);
const createFormRef = ref<BasicFormProps>();

// 权限前缀
const permissionPrefix = '/authority/user';

// 权限
const pagePermission = reactive({
  page: checkPermission(`${permissionPrefix}/index`, permissions.value),
  create: checkPermission(`${permissionPrefix}/create`, permissions.value),
  update: checkPermission(`${permissionPrefix}/update`, permissions.value),
  delete: checkPermission(`${permissionPrefix}/delete`, permissions.value),
  permission: checkPermission(`${permissionPrefix}/authority`, permissions.value)
});

// 权限配置
const permissionConfig = reactive<PermissionConfig>({
  id: '',
  isVisible: false,
  checkedKeys: [],
  treeData: []
});

// 初始化新增数据
const initCreate = {
  status: 1,
  user: { name: { test: '1234' } }
};

// 搜索数据
const searches = reactive<SearchData>({
  data: {}
});

// 新增数据
const creates = reactive<CreateData>({
  id: '',
  isVisible: false,
  title: '新增',
  data: initCreate
});

// 表格数据
const tables = reactive<TableData>({
  total: 0,
  data: []
});

// 分页数据
const pagination = reactive<PaginationData>({
  page: 1,
  pageSize: 20,
});

onMounted(() => {
  getPage();
});

/** 获取表格数据 */
const getPage = async () => {
  handleSearch(searches.data);
};

/** 表格提交 */
const createSubmit = () => {
  createFormRef.value?.handleSubmit();
};

/**
 * 搜索提交
 * @param values - 表单返回数据
 */
const handleSearch = async (values: FormData) => {
  searches.data = values;
  const query = { ...pagination, ...values };
  try {
    isLoading.value = true;
    const { data } = await getSystemUserPage(query);
    const { items, total } = data;
    tables.data = items;
    tables.total = total;
  } finally {
    isLoading.value = false;
  }
};

/** 点击新增 */
const onCreate = () => {
  creates.isVisible = !creates.isVisible;
  creates.title = ADD_TITLE;
  creates.id = '';
  creates.data = initCreate;
};

/**
 * 点击编辑
 * @param record - 当前行数据
 */
const onUpdate = async (record: FormData) => {
  const { id, name } = record;
  creates.isVisible = !creates.isVisible;
  creates.id = id as string;
  creates.title = EDIT_TITLE(name as string);

  try {
    isCreateLoading.value = true;
    const { data } = await getSystemUserById(id as string);
    creates.data = data;
  } finally {
    isCreateLoading.value = false;
  }
};

/**
 * 新增/编辑提交
 * @param values - 表单返回数据
 */
const handleCreate = async (values: FormData) => {
  try {
    isCreateLoading.value = true;
    const functions = () => creates.id ? updateSystemUser(creates.id, values) : createSystemUser(values);
    const { data } = await functions();
    getPage();
    creates.id = '';
    creates.isVisible = false;
    creates.data = initCreate;
    createFormRef.value?.handleReset();
    message.success(data?.message || '操作成功');
  } finally {
    isCreateLoading.value = false;
  }
};

/** 关闭新增/编辑 */
const onCloseCreate = () => {
  creates.isVisible = false;
};

/**
 * 删除
 * @param id
 */
const handleDelete = async (id: string | number) => {
  try {
    isLoading.value = true;
    const data = await deleteSystemUser(id as string);
    if (data?.code === 200) {
      message.success(data?.message || '删除成功');
      getPage();
    }
  } finally {
    isLoading.value = false;
  }
};

/**
 * 分页
 * @param page - 当前页
 * @param pageSize - 分页总数
 */
const handlePagination = (page: number, pageSize: number) => {
  pagination.page = page;
  pagination.pageSize = pageSize;
  getPage();
};

/** 开启权限 */
const openPermission = async (id: string) => {
  try {
    isLoading.value = true;
    const params = { userId: id };
    const { data } = await getPermission(params);
    const { defaultCheckedKeys, treeData } = data;
    permissionConfig.id = id;
    permissionConfig.treeData = treeData;
    permissionConfig.checkedKeys = Object.values(defaultCheckedKeys);
    permissionConfig.isVisible = true;
  } finally {
    isLoading.value = false;
  }
};

/** 关闭权限 */
const closePermission = () => {
  permissionConfig.isVisible = false;
};

/**
 * 权限提交
 */
const permissionSubmit = async (checked: Key[]) => {
  try {
    isLoading.value = true;
    const params = {
      menuIds: checked,
      userId: permissionConfig.id
    };
    const data = await savePermission(params);
    message.success(data.message || '授权成功');
    permissionConfig.isVisible = false;
  } finally {
    isLoading.value = false;
  }
};
</script>
