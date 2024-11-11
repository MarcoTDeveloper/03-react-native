import { createBottomTabNavigator, type BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { Exercise } from '@screens/Exercise'
import { History } from '@screens/History'
import { Home } from '@screens/Home'
import { Profile } from '@screens/Profile'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { Platform } from 'react-native'

type AppRoutes = {
  home: undefined
  history: undefined
  profile: undefined
  exercise: { exerciseId: string }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  const iconSize = gluestackUIConfig.tokens.space['8']

  return (
    <Navigator 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: gluestackUIConfig.tokens.colors.green500,
        tabBarInactiveTintColor: gluestackUIConfig.tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: gluestackUIConfig.tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: gluestackUIConfig.tokens.space["10"],
          paddingTop: gluestackUIConfig.tokens.space["10"],
        }
      }}
    >
      <Screen 
        name='home'
        component={Home}
        options={{ 
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize}/>
          )
        }}
      />
      <Screen 
        name='history'
        component={History}
        options={{ 
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize}/>
          )
        }}
      />
      <Screen 
        name='profile'
        component={Profile}
        options={{ 
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize}/>
          )
        }}
      />
      <Screen 
        name='exercise'
        component={Exercise}
        options={{
          tabBarButton: () => null
        }}
      />
    </Navigator>
  )
}