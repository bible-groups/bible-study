<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <h1 class="text-[1.8rem] xl:text-3xl font-bold text-gray-800 mb-4">말씀 묵상</h1>
        <p class="text-gray-600">하나님의 말씀을 깊이 묵상하고 나누세요</p>
      </div>

      <!-- 스위칭 버튼 -->
      <div class="flex justify-center mb-6">
        <div class="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'list' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            묵상 목록
          </button>
          <button
            @click="viewMode = 'add'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'add' 
                ? 'bg-indigo-500 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            묵상 추가
          </button>
        </div>
      </div>

      <!-- 검색 영역 -->
      <div class="max-w-md mx-auto mb-8">
        <div class="relative">
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="묵상 내용을 검색하세요..."
            class="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            <button
              @click="refreshData"
              :disabled="loading"
              class="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="새로고침"
            >
              <svg 
                :class="['w-4 h-4', loading ? 'animate-spin' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
            <div class="w-5 h-5 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 말씀 묵상 폼 -->
      <div v-if="viewMode === 'add'" class="w-full mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">새 묵상 추가</h2>
          
          <form @submit.prevent="addNewMeditation" class="space-y-4">
            <!-- 묵상 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">묵상 제목</label>
              <input 
                v-model="newMeditation.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="묵상 제목을 입력하세요"
              >
            </div>
            
            <!-- 묵상 내용 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">묵상 내용</label>
              <textarea 
                v-model="newMeditation.body"
                required
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="묵상 내용을 입력하세요"
              ></textarea>
            </div>
            
            <!-- 성경 구절 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">성경 구절</label>
              <input 
                v-model="newMeditation.reference"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="예: 요한복음 3:16"
              >
            </div>
            
            <!-- 기도 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">기도 제목</label>
              <textarea 
                v-model="newMeditation.prayer"
                required
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="기도 제목을 입력하세요"
              ></textarea>
            </div>
            
            <!-- 버튼 그룹 -->
            <div class="flex justify-center space-x-3 pt-4">
              <button
                type="button"
                @click="viewMode = 'list'"
                class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                :disabled="adding"
                class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <svg v-if="adding" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>{{ adding ? '추가 중...' : '묵상 추가' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="text-center py-12">
        <div class="flex flex-col items-center justify-center">
          <!-- 상단 구분선 -->
          <div class="w-32 h-px bg-gray-300 mb-8"></div>
          
          <!-- 중앙 아이콘 -->
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- 묵상 목록 (리스트 형식) -->
      <div v-else-if="viewMode === 'list'" class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div
          v-for="(meditation, index) in filteredMeditations"
          :key="meditation.id"
          :class="[
            'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
            index === filteredMeditations.length - 1 ? 'border-b-0' : ''
          ]"
          @click="openModal(meditation)"
        >
          <div class="p-6">
            <!-- 메인 내용 -->
            <div class="flex items-start space-x-4">
              <!-- 아이콘 -->
              <div class="flex-shrink-0 mt-1">
                <div class="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center">
                  <i class="fa fa-heart text-white text-lg fa-fw"></i>
                </div>
              </div>
              
              <!-- 내용 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-md xl:text-lg font-semibold text-gray-900 truncate">
                    {{ meditation.title }}
                  </h3>
                  <div class="flex items-center space-x-2 ml-4">
                    <span class="text-sm text-gray-500">{{ meditation.createdAt }}</span>
                    <span class="text-sm text-gray-400">{{ meditation.author }}</span>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ meditation.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {{ meditation.reference }}
                    </span>
                  </div>
                  
                  <button 
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                    @click.stop="openModal(meditation)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span>자세히</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="allFilteredMeditations.length > 0" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button :disabled="currentGroup <= 1" @click="goToPrevGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentPage === page ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']">{{ page }}</button>
          <button :disabled="currentGroup >= totalGroups" @click="goToNextGroup" :class="['w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors', currentGroup >= totalGroups ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700']"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
        </nav>
      </div>

      <!-- 데이터가 없을 때 -->
      <div v-if="!loading && allFilteredMeditations.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.751-6.281-2.02M12 15c2.34 0 4.515-.751 6.281-2.02M12 3v12"></path>
          </svg>
        </div>
        <p class="text-gray-500 mb-4">
          {{ searchTerm ? '검색 조건에 맞는 묵상이 없습니다.' : '등록된 묵상이 없습니다.' }}
        </p>
        <button 
          v-if="searchTerm"
          @click="clearFilters"
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          검색 초기화
        </button>
      </div>
    </div>

    <!-- 묵상 상세 모달 -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-[100vh] max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 모달 헤더 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="flex-1 pr-4">
            <!-- 제목 (편집 가능) -->
            <input 
              v-model="editTitle"
              class="w-full text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
              placeholder="묵상 제목을 입력하세요"
            >
          </div>
          <div class="flex items-center space-x-4 flex-shrink-0">
            <span class="text-sm text-gray-500">{{ selectedMeditation.createdAt }}</span>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 묵상 내용 영역 (60% 고정) -->
        <div class="p-6 overflow-y-auto" style="height: 60vh;">
          <!-- 묵상 내용 (편집 가능) -->
          <div class="mb-6">
            <label class="block text-base font-bold text-gray-700 mb-2">묵상 내용</label>
            <textarea 
              v-model="editBody"
              :rows="calculateRows(editBody)"
              class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50"
              placeholder="묵상 내용을 입력하세요"
            ></textarea>
          </div>
        </div>

        <!-- 성경 구절과 기도 제목 영역 -->
        <div class="p-6">
          <!-- 성경 구절 (편집 가능) -->
          <div class="mb-4">
            <label class="block text-base font-bold text-gray-700 mb-2">성경 구절</label>
            <input 
              v-model="editReference"
              class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg transition-all duration-200 hover:bg-gray-50"
              placeholder="성경 구절을 입력하세요"
            >
          </div>

          <!-- 기도 제목 (편집 가능) -->
          <div class="mb-4">
            <label class="block text-base font-bold text-gray-700 mb-2">기도 제목</label>
            <textarea 
              v-model="editPrayer"
              :rows="calculateRows(editPrayer)"
              class="w-full text-gray-700 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-3 focus:py-2 focus:border focus:border-gray-300 focus:rounded-lg resize-none transition-all duration-200 leading-relaxed hover:bg-gray-50"
              placeholder="기도 제목을 입력하세요"
            ></textarea>
          </div>
        </div>

         <!-- 모달 하단 -->
         <div class="p-6 border-t border-gray-200">
           <!-- 메타 정보 -->
           <div class="mb-10">
             <div class="flex flex-wrap gap-3 justify-center">
               <div class="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full text-sm font-medium">
                 <input 
                   v-model="editReference"
                   class="bg-transparent border-none outline-none focus:bg-indigo-200 focus:px-2 focus:py-2 focus:rounded-lg transition-all duration-200 hover:bg-indigo-200 text-center min-w-0"
                   placeholder="성경 구절"
                 >
               </div>
               <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-sm font-medium">
                 <input 
                   v-model="editAuthor"
                   class="bg-transparent border-none outline-none focus:bg-gray-200 focus:px-2 focus:py-2 focus:rounded-lg transition-all duration-200 hover:bg-gray-200 text-center min-w-0"
                   placeholder="작성자"
                 >
               </div>
             </div>
           </div>

           <!-- 버튼 그룹 -->
           <div class="flex justify-center space-x-4">
             <button
               @click="updateMeditation"
               :disabled="updating"
               class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 cursor-pointer"
             >
               <svg v-if="updating" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
               </svg>
               <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
               </svg>
               <span>{{ updating ? '수정 중...' : '수정' }}</span>
             </button>
             
             <button
               @click="deleteMeditation"
               :disabled="deleting"
               class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 cursor-pointer"
             >
               <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
               </svg>
               <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
               </svg>
               <span>{{ deleting ? '삭제 중...' : '삭제' }}</span>
             </button>
             
             <button
               @click="closeModal"
               class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2 cursor-pointer"
             >
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
               </svg>
               <span>창닫기</span>
             </button>
           </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const searchTerm = ref('')
const selectedMeditationId = ref(null)
const viewMode = ref('list') // 'list' 또는 'add'

// 사용자 인증 정보 (Pinia store 사용)
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)
const role = computed(() => authStore.currentUserRole)

// 모달 관련 변수들
const modalOpen = ref(false)
const selectedMeditation = ref({})
const editTitle = ref('')
const editBody = ref('')
const editReference = ref('')
const editPrayer = ref('')
const editAuthor = ref('')
const updating = ref(false)
const deleting = ref(false)

// 새 묵상 추가 관련 변수들
const newMeditation = ref({
  title: '',
  body: '',
  reference: '',
  prayer: ''
})
const adding = ref(false)

// 페이지네이션 관련
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pagesPerGroup = ref(10)
const currentGroup = ref(1)

// Firebase에서 묵상 데이터 가져오기
const meditations = ref([])
const loading = ref(true)

// Firebase Timestamp를 한국어 날짜 문자열로 변환하는 함수
const formatFirebaseDate = (timestamp) => {
  try {
    if (!timestamp) return ''
    
    let date
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      // Firebase Timestamp 객체
      date = timestamp.toDate()
    } else if (timestamp.seconds) {
      // Firebase Timestamp의 seconds 속성이 있는 경우
      date = new Date(timestamp.seconds * 1000)
    } else if (typeof timestamp === 'string') {
      // 이미 문자열인 경우
      return timestamp
    } else {
      // 기타 경우
      date = new Date(timestamp)
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('날짜 변환 오류:', error)
    return '날짜 오류'
  }
}

// Firebase에서 데이터 로드
onMounted(async () => {
  console.log('[PAGE] meditation mounted')
  await loadMeditationsFromFirebase()
})

const loadMeditationsFromFirebase = async () => {
  try {
    loading.value = true
    
    // Firebase에서 데이터 가져오기
    const { $db } = useNuxtApp()
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
    
    const meditationsCollection = collection($db, 'meditation')
    const q = query(meditationsCollection, orderBy('createdAt', 'desc')) // 최신순 정렬
    
    const querySnapshot = await getDocs(q)
    meditations.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      return {
        id: doc.id,
        title: data.title || '',
        body: data.body || '',
        reference: data.reference || '',
        prayer: data.prayer || '',
        author: data.author || '',
        createdAt: formatFirebaseDate(data.createdAt)
      }
    })
    
    console.log('Firebase에서 묵상 데이터 로드 완료:', meditations.value.length, '개')
  } catch (error) {
    console.error('묵상 데이터 로드 실패:', error)
    
    // 에러 발생시 빈 배열로 초기화
    meditations.value = []
    
    // 사용자에게 에러 메시지 표시 (선택사항)
    // alert('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}

// 필터링된 묵상 목록 (페이지네이션 전)
const allFilteredMeditations = computed(() => {
  let filtered = meditations.value

  // 검색어 필터
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter(meditation => 
      (meditation.title && meditation.title.toLowerCase().includes(search)) ||
      (meditation.body && meditation.body.toLowerCase().includes(search)) ||
      (meditation.author && meditation.author.toLowerCase().includes(search)) ||
      (meditation.reference && meditation.reference.toLowerCase().includes(search)) ||
      (meditation.prayer && meditation.prayer.toLowerCase().includes(search))
    )
  }

  return filtered
})

// 페이지네이션 계산
const totalPages = computed(() => Math.ceil(allFilteredMeditations.value.length / itemsPerPage.value))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

// 현재 페이지의 묵상 목록
const filteredMeditations = computed(() => {
  return allFilteredMeditations.value.slice(startIndex.value, endIndex.value)
})

// 페이지네이션 표시용 페이지 번호들
const visiblePages = computed(() => {
  const pages = []
  const start = (currentGroup.value - 1) * pagesPerGroup.value + 1
  const end = Math.min(currentGroup.value * pagesPerGroup.value, totalPages.value)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// 묵상 선택/해제 (기존 기능 유지)
const selectMeditation = (meditation) => {
  if (selectedMeditationId.value === meditation.id) {
    selectedMeditationId.value = null
  } else {
    selectedMeditationId.value = meditation.id
  }
}

// 모달 열기
const openModal = (meditation) => {
  selectedMeditation.value = meditation
  editTitle.value = meditation.title
  editBody.value = meditation.body
  editReference.value = meditation.reference
  editPrayer.value = meditation.prayer
  editAuthor.value = meditation.author
  modalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  modalOpen.value = false
  selectedMeditation.value = {}
  editTitle.value = ''
  editBody.value = ''
  editReference.value = ''
  editPrayer.value = ''
  editAuthor.value = ''
  updating.value = false
  deleting.value = false
}

// 텍스트 영역 행 수 계산
const calculateRows = (text) => {
  if (!text) return 3
  const lines = text.split('\n')
  let totalRows = lines.length
  for (let line of lines) {
    totalRows += Math.floor(line.length / 80) // 80자가 넘어가면 추가 행 계산
  }
  return Math.max(3, totalRows) // 최소 3행을 보장
}

// 페이지 이동
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    currentGroup.value = Math.ceil(page / pagesPerGroup.value)
    selectedMeditationId.value = null // 페이지 변경시 선택 해제
  }
}

const goToNextGroup = () => {
  if (currentGroup.value < totalGroups.value) {
    currentGroup.value++
    currentPage.value = (currentGroup.value - 1) * pagesPerGroup.value + 1
  }
}

const goToPrevGroup = () => {
  if (currentGroup.value > 1) {
    currentGroup.value--
    currentPage.value = (currentGroup.value - 1) * pagesPerGroup.value + 1
  }
}

// 데이터 새로고침
const refreshData = async () => {
  await loadMeditationsFromFirebase()
  currentPage.value = 1
  selectedMeditationId.value = null
}

// 필터 초기화
const clearFilters = () => {
  searchTerm.value = ''
  currentPage.value = 1
  selectedMeditationId.value = null
}

// 묵상 수정 함수
const updateMeditation = async () => {
  if (!selectedMeditation.value.id) return
  
  try {
    updating.value = true
    
    const { $db } = useNuxtApp()
    const { doc, updateDoc } = await import('firebase/firestore')
    
    const meditationDoc = doc($db, 'meditation', selectedMeditation.value.id)
    await updateDoc(meditationDoc, {
      title: editTitle.value,
      body: editBody.value,
      reference: editReference.value,
      prayer: editPrayer.value,
      author: editAuthor.value
    })
    
    // 로컬 데이터 업데이트
    const meditationIndex = meditations.value.findIndex(meditation => meditation.id === selectedMeditation.value.id)
    if (meditationIndex !== -1) {
      meditations.value[meditationIndex] = {
        ...meditations.value[meditationIndex],
        title: editTitle.value,
        body: editBody.value,
        reference: editReference.value,
        prayer: editPrayer.value,
        author: editAuthor.value
      }
    }
    
    // 선택된 묵상도 업데이트
    selectedMeditation.value = {
      ...selectedMeditation.value,
      title: editTitle.value,
      body: editBody.value,
      reference: editReference.value,
      prayer: editPrayer.value,
      author: editAuthor.value
    }
    
    console.log('묵상 수정 완료')
    alert('묵상이 성공적으로 수정되었습니다.')
    
  } catch (error) {
    console.error('묵상 수정 실패:', error)
    alert('묵상 수정 중 오류가 발생했습니다.')
  } finally {
    updating.value = false
  }
}

// 묵상 삭제 함수
const deleteMeditation = async () => {
  if (!selectedMeditation.value.id) return
  
  if (!confirm('정말로 이 묵상을 삭제하시겠습니까?')) {
    return
  }
  
  try {
    deleting.value = true
    
    const { $db } = useNuxtApp()
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    const meditationDoc = doc($db, 'meditation', selectedMeditation.value.id)
    await deleteDoc(meditationDoc)
    
    // 로컬 데이터에서 제거
    meditations.value = meditations.value.filter(meditation => meditation.id !== selectedMeditation.value.id)
    
    console.log('묵상 삭제 완료')
    alert('묵상이 성공적으로 삭제되었습니다.')
    
    // 모달 닫기
    closeModal()
    
  } catch (error) {
    console.error('묵상 삭제 실패:', error)
    alert('묵상 삭제 중 오류가 발생했습니다.')
  } finally {
    deleting.value = false
  }
}

// 새 묵상 추가 함수
const addNewMeditation = async () => {
  try {
    adding.value = true
    
    const { $db } = useNuxtApp()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    
    const meditationsCollection = collection($db, 'meditation')
    
    // 작성자(author)는 로그인한 사용자의 이메일로 저장
    console.log('현재 사용자 정보:', user.value)
    console.log('email:', user.value?.email)
    console.log('role:', role.value)
    const authorEmail = user.value?.email || ''
    console.log('설정된 authorEmail:', authorEmail)
    
    const docRef = await addDoc(meditationsCollection, {
      title: newMeditation.value.title,
      body: newMeditation.value.body,
      reference: newMeditation.value.reference,
      prayer: newMeditation.value.prayer,
      author: authorEmail,
      createdAt: serverTimestamp()
    })
    
    // 로컬 데이터에 새 묵상 추가
    const newMeditationData = {
      id: docRef.id,
      title: newMeditation.value.title,
      body: newMeditation.value.body,
      reference: newMeditation.value.reference,
      prayer: newMeditation.value.prayer,
      author: authorEmail,
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    meditations.value.unshift(newMeditationData) // 최신순으로 맨 앞에 추가
    
    // 폼 초기화
    newMeditation.value = {
      title: '',
      body: '',
      reference: '',
      prayer: ''
    }
    
    // 목록 보기로 전환
    viewMode.value = 'list'
    
    console.log('새 묵상 추가 완료')
    alert('묵상이 성공적으로 추가되었습니다.')
    
  } catch (error) {
    console.error('묵상 추가 실패:', error)
    alert('묵상 추가 중 오류가 발생했습니다.')
  } finally {
    adding.value = false
  }
}

// 검색 변경시 첫 페이지로 이동
watch([searchTerm], () => {
  currentPage.value = 1
  selectedMeditationId.value = null
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 1280px 밑에서 안쪽 스크롤바 제거 */
@media (max-width: 1280px) {
  .max-h-screen {
    max-height: none !important;
    overflow-y: visible !important;
  }
}
</style>
