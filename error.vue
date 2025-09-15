<!-- error.vue -->
<template>
  <div class="error-page">
    <!-- 배경 오버레이 -->
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <!-- 모달 컨테이너 -->
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md text-center relative">
        <!-- 닫기 버튼 -->
        <button 
          @click="handleNavigation"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- 모달 내용 -->
        <div class="p-8">
          <!-- 아이콘 -->
          <div class="mb-6 flex justify-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <!-- <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/> -->
                <path d="M12 5v9" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
                <circle cx="12" cy="18" r="1.3" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <!-- 에러 코드 -->
          <h1 class="mb-4 text-2xl font-bold text-gray-900">{{ error?.statusCode || '404' }}</h1>
          
          <!-- 에러 메시지 -->
          <p class="mb-6 text-base xl:text-md text-gray-700">{{ getErrorMessage() }}</p>
          
          <!-- 액션 버튼 -->
          <button
            @click="handleNavigation"
            class="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {{ getButtonText() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const error = useError()
const authStore = useAuthStore()

// 에러 메시지 결정 함수
const getErrorMessage = () => {
  return '페이지를 찾을 수 없습니다.'
}

// 버튼 텍스트 결정 함수
const getButtonText = () => {
  return '홈으로 가기'
}

const handleNavigation = async () => {
  try {
    await clearError()
    await navigateTo('/', { 
      replace: true,
      immediate: true 
    })
  } catch (e) {
    console.error('Navigation error:', e)
  }
}

useHead({
  title: '페이지를 찾을 수 없습니다 | Bible Story',
  meta: [
    { name: 'description', content: '페이지를 찾을 수 없습니다.' }
  ]
})
</script>

<style scoped>

</style>