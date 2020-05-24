const Settings = () => import(/* webpackChunkName: "setting" */ './Settings.vue')
const ProfileSetting = () => import(/* webpackChunkName: "setting" */ './children/ProfileSetting.vue')
const SecuritySetting = () => import(/* webpackChunkName: "setting" */ './children/SecuritySetting.vue')
const AccountSetting = () => import(/* webpackChunkName: "setting" */ './children/AccountSetting.vue')
const CertificationSetting = () => import(/* webpackChunkName: "setting" */ './children/CertificationSetting.vue')
export {Settings, ProfileSetting, SecuritySetting, AccountSetting, CertificationSetting}
