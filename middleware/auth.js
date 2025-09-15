import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $authReady } = useNuxtApp()
  const authStore = useAuthStore()

  // 인증 준비 완료 대기
  await $authReady

  // 로딩 중일 때 대기
  if (authStore.loading) {
    return
  }

  // 1. 로그인/회원가입 페이지 체크
  if (['/login', '/signup'].includes(to.path)) {
    if (authStore.authenticated) {      
      // 디버깅 시 불필요한 로그를 정리
      nextTick(() => { 
        console.clear()
      })      

      // 메인 페이지로 리다이렉트
      return navigateTo('/', {
        replace: true,
        immediate: true
      })
    }
    return
  }

  // 2. 기본 인증 체크 (로그인 여부만 확인)
  if (!authStore.authenticated) {
    // 디버깅 시 불필요한 로그를 정리
    nextTick(() => {
      console.clear()
    })
    
    // 로그인 페이지로 리다이렉트
    return navigateTo('/login', {
      replace: true,
      query: {
        redirect: to.fullPath
      }
    })
  }
})