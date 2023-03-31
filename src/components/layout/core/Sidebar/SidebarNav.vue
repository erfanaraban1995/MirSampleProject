<template>
  <nav class="sidebar-nav">
    <VuePerfectScrollbar dir="ltr" class="scroll-area" :settings="psSettings" @ps-scroll-y="scrollHandle">
      <ul class="nav" :dir="$dir.ltr ? 'ltr' : 'rtl'">
        <template v-for="(item, index) in navItems">
          <template v-if="$hasPermissions(item.roles) && item.title">
            <SidebarNavTitle :key="index" :name="item.name" :classes="item.class" :wrapper="item.wrapper" />
          </template>
          <template v-else-if="item.divider">
            <SidebarNavDivider :key="index" :classes="item.class" />
          </template>
          <template v-else-if="item.label">
            <SidebarNavLabel
              :key="index"
              :name="item.name"
              :url="item.url"
              :icon="item.icon"
              :label="item.label"
              :classes="item.class"
            />
          </template>
          <template v-else>
            <template v-if="item.children && $hasPermissions(item.roles)">
              <!-- First level dropdown -->
              <SidebarNavDropdown :key="index" :name="item.name" :url="item.url" :icon="item.icon" class="first-level">
                <template v-for="(childL1, index1) in item.children">
                  <template v-if="$hasPermissions(item.roles) && childL1.children">
                    <!-- Second level dropdown -->
                    <SidebarNavDropdown
                      :key="index1"
                      :name="childL1.name"
                      :url="childL1.url"
                      :icon="childL1.icon"
                      class="second-level"
                    >
                      <li :key="index2" class="nav-item" v-for="(childL2, index2) in childL1.children">
                        <template v-if="$hasPermissions(item.roles)">
                          <SidebarNavLink
                            :name="childL2.name"
                            :url="childL2.url"
                            :icon="childL2.icon"
                            :badge="childL2.badge"
                            :variant="item.variant"
                          />
                        </template>
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else-if="$hasPermissions(item.roles)">
                    <SidebarNavItem :key="index1" :classes="item.class">
                      <SidebarNavLink
                        :name="childL1.name"
                        :url="childL1.url"
                        :icon="childL1.icon"
                        :badge="childL1.badge"
                        :variant="item.variant"
                      />
                    </SidebarNavItem>
                  </template>
                </template>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <SidebarNavItem v-if="$hasPermissions(item.roles)" :key="index" :classes="item.class">
                <SidebarNavLink
                  :name="item.name"
                  :url="item.url"
                  :icon="item.icon"
                  :badge="item.badge"
                  :variant="item.variant"
                />
              </SidebarNavItem>
            </template>
          </template>
        </template>
      </ul>
      <slot></slot>
    </VuePerfectScrollbar>
  </nav>
</template>

<script>
import SidebarNavDivider from './SidebarNavDivider'
import SidebarNavDropdown from './SidebarNavDropdown'
import SidebarNavLink from './SidebarNavLink'
import SidebarNavTitle from './SidebarNavTitle'
import SidebarNavItem from './SidebarNavItem'
import SidebarNavLabel from './SidebarNavLabel'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {permissionsHaveNamespaces} from '@/lib/account'

export default {
  name: 'SidebarNav',
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    SidebarNavDivider,
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle,
    SidebarNavItem,
    SidebarNavLabel,
    VuePerfectScrollbar
  },
  data() {
    return {
      psSettings: {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollX: true,
        wheelPropagation: false,
        interceptRailY: (styles) => ({...styles, height: 0})
      }
    }
  },
  methods: {
    scrollHandle() {
      // console.log(evt)
    },
    allowed(item) {
      let allowed = false
      let permissions = []
      if (typeof item.permissions === 'function') {
        permissions = item.permissions()
      } else {
        permissions = item.permissions
      }

      if (!permissions || !Array.isArray(permissions) || !permissions.length) {
        allowed = true
      } else if (this.$store.state.$account && this.$store.state.$account.permissions) {
        allowed = permissionsHaveNamespaces(permissions, this.$store.state.$account.permissions)
      }
      return allowed
    }
  }
}
</script>

<style scoped lang="css">
.scroll-area {
  position: absolute;
  height: 100%;
  margin: auto;
}
</style>
