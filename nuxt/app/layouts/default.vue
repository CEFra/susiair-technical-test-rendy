<template>
<div class="mobile-viewport">
    <div class="app-layout">
        <main class="main-content">
            <slot />
        </main>

        <nav class="bottom-nav">
            <NuxtLink to="/" class="nav-item" exact-active-class="active">
                <div class="icon-wrap">
                    <Home class="icon" :size="20" :stroke-width="2.2" />
                </div>
                <span>Home</span>
            </NuxtLink>
            <NuxtLink to="/schedule" class="nav-item" active-class="active">
                <div class="icon-wrap">
                    <CalendarDays class="icon" :size="20" :stroke-width="2.2" />
                </div>
                <span>Schedule</span>
            </NuxtLink>
            <NuxtLink to="/logbook" class="nav-item" active-class="active">
                <div class="icon-wrap">
                    <Plane class="icon" :size="20" :stroke-width="2.2" />
                </div>
                <span>Logbook</span>
            </NuxtLink>
            <NuxtLink to="/more" class="nav-item" active-class="active">
                <div class="icon-wrap">
                    <MoreHorizontal class="icon" :size="20" :stroke-width="2.2" />
                </div>
                <span>More</span>
            </NuxtLink>
        </nav>
    </div>
</div>
</template>

<script setup lang="ts">
import {
    Home,
    CalendarDays,
    Plane,
    MoreHorizontal
} from "lucide-vue-next";
import {
    useAuthStore
} from "@/stores/auth";
import {
    useRouter
} from "vue-router";
import {
    onMounted,
    watch
} from "vue";

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
    if (!authStore.isAuthenticated) {
        router.push("/login");
    }
});

watch(
    () => authStore.isAuthenticated,
    (isAuth) => {
        if (!isAuth) {
            router.push("/login");
        }
    },
);
</script>

<style lang="scss" scoped>
@use "@/assets/scss/variables.scss"as *;

.mobile-viewport {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background-color: #eceef2;
    overflow-x: hidden;
}

.app-layout {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px));
    background-color: $background;
    position: relative;
    box-shadow: 0 0 40px rgba(14, 33, 56, 0.08);
    min-width: 0;
    overflow-x: hidden;
    transition: max-width 0.2s ease;

    @media (min-width: 768px) {
        max-width: 680px;
    }

    @media (min-width: 1024px) {
        max-width: 800px;
    }
}

.main-content {
    flex: 1;
    width: 100%;
    min-width: 0;
}

.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: calc(66px + env(safe-area-inset-bottom, 0px));
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(14px);
    border-top: 1px solid rgba(229, 231, 235, 0.85);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
    padding: 0 8px env(safe-area-inset-bottom, 0px) 8px;
    transition: max-width 0.2s ease;

    @media (min-width: 768px) {
        max-width: 680px;
    }

    @media (min-width: 1024px) {
        max-width: 800px;
    }

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: $text-secondary;
        font-size: 11px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 12px;
        transition:
            color 0.2s ease,
            transform 0.15s ease;

        .icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 3px;
            transition: transform 0.2s ease;
        }

        .icon {
            color: $text-secondary;
            transition: color 0.2s ease;
        }

        &:active {
            transform: scale(0.92);
        }

        &.active {
            color: $primary-navy;

            .icon {
                color: $brand-red;
            }

            .icon-wrap {
                transform: translateY(-1px);
            }
        }
    }
}
</style>
