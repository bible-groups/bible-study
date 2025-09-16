<template>
  <div class="default-layout min-h-screen flex flex-col">
    <div class="border-b border-gray-200 header">
      <Header />
    </div>
    <!-- 보호 페이지 깜빡임 방지: 인증 확인 전에는 콘텐츠 렌더를 지연 -->
    <main v-if="!needsAuth || (authReady && isLoggedIn)" class="flex-1 container mx-auto py-10 px-4">
      <slot />
    </main>
    <main v-else class="flex-1 container mx-auto py-10 px-4">
      <div class="h-[40vh] flex items-center justify-center text-gray-400">
        <!-- 인증 확인 중 -->
      </div>
    </main>
    <div class="footer bg-gray-50">
      <Footer />
    </div>

    <!-- 사이드바 -->
    <div 
      class="fixed top-0 left-0 z-50 w-64 h-full transition-transform duration-300 ease-in-out transform bg-white shadow-lg xl:hidden"
      :class="{ '-translate-x-full': !isOpen }"
    >
      <div class="p-6 sidebar">
        <div class="text-right close-button xl:hidden">
          <button class="flex-none mobile-button" @click="closeSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h1 class="mb-6 text-2xl font-bold">BIBLE STORY</h1>
        
        <!-- 사용자 정보 표시 -->
        <div class="mb-15 p-3 bg-gray-200 rounded-lg" v-if="isLoggedIn && user?.displayName">
          <div class="text-sm text-gray-600 mb-1"></div>
          <div class="font-medium text-gray-800">
            {{ user.displayName }} 님, 환영합니다!
          </div>
        </div>
        
        <nav class="flex flex-col gap-4 lnb">
          <ul>
            <li v-for="menu in menus" :key="menu.name">
              <nuxt-link 
                :to="menu.path" 
                @click="closeSidebar"
                :class="[
                  'block py-2 px-3 rounded-lg transition-all duration-200',
                  isCurrentRoute(menu.path) 
                    ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                ]"
              >
                {{ menu.name }}
              </nuxt-link>
            </li>
          </ul>
        </nav>

      </div>
    </div>

    <!-- 오버레이 -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40 bg-black/50"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const isOpen = useSidebar()
const authStore = useAuthStore()
const route = useRoute()

// 반응형 데이터 (store에서 가져오기)
const user = computed(() => authStore.currentUser)
const isLoggedIn = computed(() => authStore.isAuthenticated)
const role = computed(() => authStore.currentUserRole)

// 현재 라우트가 보호되는지 여부
const needsAuth = computed(() => {
  const m = route.meta?.middleware
  if (Array.isArray(m)) return m.includes('auth')
  if (typeof m === 'string') return m === 'auth'
  return false
})

// 인증 준비 완료 여부 (플러그인에서 제공)
const { $authReady } = useNuxtApp()
const authReady = ref(false)
onMounted(async () => {
  try {
    await $authReady
  } finally {
    authReady.value = true
  }
})

// 메뉴 구성 (헤더와 동일)
const menus = ref([
  { name: '홈', path: '/main', active: false },
  { name: '용어', path: '/glossary', active: false },
  { name: '말씀안내', path: '/guide', active: false },
  { name: '말씀묵상', path: '/meditation', active: false },
  { name: '일기장', path: '/journal', active: false },
  { name: '현금출납장', path: '/ledger', active: false },
  { name: '기도장', path: '/prayer', active: false },
  { name: '기타', path: '/more', active: false },
  { name: '블로그작성', path: '/blog-write', active: false },
])

// 현재 라우트 체크 함수 (헤더와 동일)
const isCurrentRoute = (path) => {
  return route.path === path
}

const closeSidebar = () => {
  isOpen.value = false  
}
</script>