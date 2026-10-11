<template>
  <div class="login-container">
    <div class="login-card card">
      <div class="logo-container">
        <img src="https://susiair.com/images/susiair-logo.png" alt="Susi Air Logo" class="brand-logo" />
        <h2 class="brand-title">Pilot Portal</h2>
        <p class="brand-subtitle">Flight Operations Sign In</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-wrap">
            <User :size="18" class="input-icon" />
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="e.g. johndoe" 
              autocomplete="username"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrap">
            <Lock :size="18" class="input-icon" />
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="••••••••" 
              autocomplete="current-password"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn-primary login-btn" :disabled="authStore.loading">
          <Loader2 v-if="authStore.loading" :size="18" class="spin-icon" />
          <span>{{ authStore.loading ? 'Authenticating...' : 'Sign In' }}</span>
        </button>
      </form>
    </div>

    <!-- Error Popup Modal -->
    <Transition name="fade">
      <div v-if="showErrorPopup" class="popup-overlay" @click.self="closePopup">
        <div class="popup-modal">
          <div class="popup-icon-container">
            <AlertCircle :size="32" class="popup-icon" />
          </div>
          <h3 class="popup-title">Login Failed</h3>
          <p class="popup-message">{{ errorMessage }}</p>
          <button type="button" class="btn-primary popup-btn" @click="closePopup">
            Try Again
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User, Lock, Loader2, AlertCircle } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'empty'
});

const username = ref('');
const password = ref('');
const showErrorPopup = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

const closePopup = () => {
  showErrorPopup.value = false;
};

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value);
    router.push('/');
  } catch (e: any) {
    const rawMsg = authStore.error || e?.data?.message || 'Invalid username or password';
    errorMessage.value = Array.isArray(rawMsg) ? rawMsg.join(', ') : rawMsg;
    showErrorPopup.value = true;
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables.scss' as *;

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(135deg, #0A1728 0%, #0E2138 50%, #162E4D 100%);
  position: relative;
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 36px 24px;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  background: #FFFFFF;
}

.logo-container {
  text-align: center;
  margin-bottom: 28px;
  
  .brand-logo {
    max-width: 160px;
    height: auto;
    margin-bottom: 14px;
  }
  
  .brand-title {
    color: $primary-navy;
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 4px;
    letter-spacing: -0.02em;
  }

  .brand-subtitle {
    color: $text-secondary;
    font-size: 13px;
    font-weight: 500;
  }
}

.login-form {
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;

    .input-icon {
      position: absolute;
      left: 14px;
      color: #9CA3AF;
      pointer-events: none;
    }

    input {
      padding-left: 42px;
    }
  }
}

.login-btn {
  width: 100%;
  margin-top: 20px;
  padding: 13px;
  font-size: 15px;

  .spin-icon {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(14, 33, 56, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
}

.popup-modal {
  background-color: #FFFFFF;
  border-radius: 18px;
  padding: 30px 24px;
  width: 100%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 25px 35px -5px rgba(0, 0, 0, 0.25);
  animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.popup-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba($danger, 0.12);
  color: $danger;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
}

.popup-title {
  color: $primary-navy;
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
}

.popup-message {
  color: $text-secondary;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
}

.popup-btn {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
