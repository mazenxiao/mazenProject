<template>
  <div class="login-page">
    <div class="login-page__header">
      <h1 class="login-page__title">{{ t('login.title') }}</h1>
      <p class="login-page__sub">YFPO MES · BS Mode · v{{ version.current }}</p>
    </div>

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.userAccount"
          :label="t('login.userAccount')"
          :placeholder="t('login.userAccount')"
          :rules="[{ required: true, message: t('login.errAccountRequired') }]"
          clearable
        />
        <van-field
          v-model="form.userPassword"
          type="password"
          :label="t('login.userPassword')"
          :placeholder="t('login.userPassword')"
          :rules="[{ required: true, message: t('login.errPasswordRequired') }]"
        />

        <van-field
          readonly
          clickable
          :label="t('login.factory')"
          :model-value="currentFactoryName"
          :placeholder="t('login.factory')"
          :rules="[{ required: true, message: t('login.errFactoryRequired') }]"
          @click="showFactoryPicker = true"
        />

        <van-field
          v-if="companyOptions.length"
          readonly
          clickable
          :label="t('login.company')"
          :model-value="currentCompanyName"
          :placeholder="t('login.company')"
          @click="showCompanyPicker = true"
        />
      </van-cell-group>

      <div class="login-page__actions">
        <van-button block type="primary" native-type="submit" :loading="submitting">
          {{ t('login.submit') }}
        </van-button>
      </div>

      <div class="login-page__lang">
        <van-button size="small" plain @click="toggleLang">
          {{ t('login.switchLang') }}：{{ user.lang }}
        </van-button>
      </div>
    </van-form>

    <van-popup v-model:show="showFactoryPicker" position="bottom" round>
      <van-picker
        :columns="factoryOptions"
        :columns-field-names="{ text: 'name', value: 'code' }"
        @confirm="onFactoryConfirm"
        @cancel="showFactoryPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showCompanyPicker" position="bottom" round>
      <van-picker
        :columns="companyOptions"
        :columns-field-names="{ text: 'CompanyName', value: 'CompanyCode' }"
        @confirm="onCompanyConfirm"
        @cancel="showCompanyPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录页 —— 对应旧 LoginPage
 *
 * 流程：
 *   1. 选工厂（FACTORIES 静态列表，写 localStorage）
 *   2. 输入账号 / 密码
 *   3. 可选：拉公司列表（ComPanyOP.GetAvailCompanies）
 *   4. 提交 UserOP.Login → 写 user store → 跳 /home
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useUserStore, useFactoriesStore, useCompanyStore, useVersionStore } from '@/store'
import { UserOP, ComPanyOP } from '@/services/ops'
import type { Company } from '@/models'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const factoriesStore = useFactoriesStore()
const companyStore = useCompanyStore()
const version = useVersionStore()

const form = ref({
  userAccount: user.user?.UserAccount ?? '',
  userPassword: '',
})

const showFactoryPicker = ref(false)
const showCompanyPicker = ref(false)
const submitting = ref(false)

const factoryOptions = computed(() =>
  factoriesStore.factories.map((f) => ({ ...f })),
)
const currentFactoryCode = ref<string>(factoriesStore.lastUseFactoryCode)
const currentFactoryName = computed(
  () =>
    factoriesStore.factories.find((f) => f.code === currentFactoryCode.value)
      ?.name ?? '',
)

const companyOptions = ref<Company[]>([])
const currentCompanyCode = ref<string>('')
const currentCompanyName = computed(
  () =>
    companyOptions.value.find((c) => c.CompanyCode === currentCompanyCode.value)
      ?.CompanyName ?? '',
)

function onFactoryConfirm({ selectedOptions }: any) {
  const opt = selectedOptions?.[0]
  if (!opt) return
  currentFactoryCode.value = opt.code
  factoriesStore.setLastUseFactoryCode(opt.code)
  showFactoryPicker.value = false
}

function onCompanyConfirm({ selectedOptions }: any) {
  const opt = selectedOptions?.[0]
  if (!opt) return
  currentCompanyCode.value = opt.CompanyCode
  companyStore.setCompany(opt)
  showCompanyPicker.value = false
}

function toggleLang() {
  const next = user.lang === 'zh-CN' ? 'en' : 'zh-CN'
  user.setLang(next)
  locale.value = next
}

async function loadCompanies() {
  try {
    const list = await ComPanyOP.GetAvailCompanies<Company[]>()
    if (Array.isArray(list)) {
      companyOptions.value = list
      if (list.length === 1) {
        currentCompanyCode.value = list[0].CompanyCode ?? ''
        companyStore.setCompany(list[0])
      }
    }
  } catch (e: any) {
    // 拉不到公司不阻塞登录（旧版也是非必填）
    console.warn('[login] GetAvailCompanies failed:', e?.message)
  }
}

async function onSubmit() {
  if (!currentFactoryCode.value) {
    showFailToast(t('login.errFactoryRequired'))
    return
  }
  submitting.value = true
  try {
    // 设置 factory 让 ClientInfo 带上 FactoryCode
    companyStore.setFactory({
      FactoryCode: currentFactoryCode.value,
      FactoryName: currentFactoryName.value,
    })

    const result = await UserOP.Login<any>(
      form.value.userAccount,
      form.value.userPassword,
    )

    // 旧版 result 多种形态：可能是 user 对象、布尔、字符串
    if (result && typeof result === 'object') {
      user.setUser({
        UserAccount: result.UserAccount ?? form.value.userAccount,
        UserName: result.UserName,
        ...result,
      })
    } else if (result === true) {
      user.setUser({ UserAccount: form.value.userAccount })
    } else {
      throw new Error(typeof result === 'string' ? result : '登录失败')
    }

    showToast({ type: 'success', message: '登录成功' })
    const redirect = (route.query.redirect as string) || '/home'
    router.replace(redirect)
  } catch (e: any) {
    showFailToast(e?.message || '登录失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 进入登录页主动尝试加载公司列表（可能依赖前端选 factory）
  loadCompanies()
})
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1989fa 0%, #f5f7fa 60%);
  padding-top: 12vh;

  &__header {
    text-align: center;
    margin-bottom: 24px;
    color: #fff;
  }
  &__title {
    font-size: 22px;
    margin: 0 0 6px;
  }
  &__sub {
    font-size: 12px;
    margin: 0;
    opacity: 0.85;
  }

  &__actions {
    margin: 24px 16px 12px;
  }

  &__lang {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
