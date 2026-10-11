<template>
  <div class="app-root">
    <NuxtLoadingIndicator color="#E63757" :height="3" :duration="2000" :throttle="0" />
    
    <!-- Smooth Page Switch Loader Indicator -->
    <Transition name="fade">
      <div v-if="isPageLoading" class="page-nav-loader">
        <div class="spinner-pill">
          <span class="spinner-dot"></span>
          <span class="spinner-text">Loading...</span>
        </div>
      </div>
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const token = useCookie('auth_token');
const router = useRouter();

const isPageLoading = ref(false);

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    isPageLoading.value = true;
  }
  next();
});

router.afterEach(() => {
  setTimeout(() => {
    isPageLoading.value = false;
  }, 220);
});

if (token.value) {
  authStore.isAuthenticated = true;
  authStore.fetchProfile();
}
</script>

<style lang="scss">
.app-root {
  min-height: 100vh;
  position: relative;
}

.page-nav-loader {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;

  .spinner-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(14, 33, 56, 0.92);
    backdrop-filter: blur(8px);
    color: #FFFFFF;
    padding: 6px 14px;
    border-radius: 9999px;
    box-shadow: 0 4px 12px rgba(14, 33, 56, 0.25);
    font-size: 12px;
    font-weight: 600;
  }

  .spinner-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #E63757;
    animation: pulse 1s infinite alternate;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.3);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
