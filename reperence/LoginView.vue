<template>
  <div class="login">
    <v-container>
      <v-row justify="center">
        <v-col>
          <v-card>
            <v-card-title class="headline text-center font-weight-bold my-4">로그인</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="이메일"
                  v-model="email"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  type="email"
                  required
                ></v-text-field>
                <v-text-field
                  label="비밀번호"
                  v-model="password"
                  prepend-icon="mdi-lock"
                  variant="outlined"
                  type="password"
                  required
                ></v-text-field>
                <!-- <v-text-field
                  label="성경공부 그룹명"
                  v-model="selectedGroupName"
                  prepend-icon="mdi-account-multiple"
                  variant="outlined"
                  type="text"
                  required
                ></v-text-field> -->
                <div class="text-center mt-7 mb-3">
                  <v-btn
                    :disabled="!valid"
                    color="primary"
                    class="mr-4"
                    @click="login"
                  >
                    로그인
                  </v-btn>
                  <v-btn
                    color="info"
                    @click="reset"
                  >
                    초기화
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn text color="primary" @click="switchToSignUp">
                계정이 없으신가요? 가입하기
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import { auth, db } from '@/firebase'
import { auth } from '@/firebase'
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
// import { query, where, getDocs, collection } from 'firebase/firestore';
import { useStore } from 'vuex';      // Vuex 호출  <= 추가

export default {
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const selectedGroupName = ref(''); 
    const router = useRouter();
    const store = useStore();         // Vuex 스토어 인스턴스를 가져옴     <= 추가

    const valid = computed(() => {
      return email.value.includes('@') && password.value.length >= 6;
    });

    const login = async () => {
      try {
        // Firestore의 'users' 컬렉션에서 이메일을 기준으로 문서를 찾기 위한 쿼리
        // const usersRef = collection(db, 'users');
        // const q = query(usersRef, where('email', '==', email.value));
        // const querySnapshot = await getDocs(q);

        // console.log(`쿼리 결과 문서 수: ${querySnapshot.size}`);
        // querySnapshot.forEach(doc => {
        //   console.log(`문서 ID: ${doc.id}, 데이터: `, doc.data());
        // });

        // let groupExists = false;

        // querySnapshot.forEach(doc => {
        //   const userData = doc.data();
        //   // console.log(`문서 데이터: ${JSON.stringify(userData)}`);
        //   // if (userData.group && Array.isArray(userData.group) && userData.group.includes(groupName.value)) {
        //   //   groupExists = true;
        //   // }
        //   if (userData.group && Array.isArray(userData.group) && userData.group.includes(selectedGroupName.value)) {
        //       groupExists = true;
        //     }
        //   });

        // if (!groupExists) {
        //   // 입력받은 groupName이 없는 경우
        //   alert('성경공부 그룹명을 확인 후 다시 입력해주세요!');
        //   return;
        // }

        // 이메일과 비밀번호 유효성 검사 추가
        if (!email.value || !password.value) {
          alert('이메일과 비밀번호를 모두 입력해주세요.');
          return;
        }

        // 그룹명이 존재하는 경우 로그인 진행
        await signInWithEmailAndPassword(auth, email.value, password.value);

        // 로그인 성공 시 Vuex 스토어에 로그인 상태 반영      
        store.dispatch('login');

        alert('로그인 성공!');
        router.push({ name: 'home' });
      } catch (error) {
        let errorMessage = '로그인에 실패했습니다.';
        if (error.code === 'auth/user-not-found') {           
          errorMessage = '등록되지 않은 이메일입니다.';
        } else if (error.code === 'auth/wrong-password') {    
          errorMessage = '잘못된 비밀번호입니다.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = '잘못된 이메일 형식입니다.';
        }
        alert(errorMessage);
      }
    };

    const reset = () => {
      email.value = '';
      password.value = '';
      selectedGroupName.value = '';
    };

    const switchToSignUp = () => {
      router.push({ name: 'signup' });
    };

    return { email, password, valid, selectedGroupName, login, reset, switchToSignUp };
  }
}
</script>

<style scoped lang="scss">
  .login .v-card{
    width: 55%;
    margin-top: 60px;
    margin: 150px auto 100px;
  }

  @media screen and (max-width: 768px) {
    .login .v-card{
      width: 80%;
      margin: 60px auto 100px;
    }
  }

  @media screen and (max-width: 480px) {
    .login .v-card{
      width: 90%;
    }
  }
</style>
