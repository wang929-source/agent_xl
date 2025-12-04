import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom"

const routerArr = [
    {
      path: '/',
      title: '首页',
      element: lazy(() => import('../views/home/index.jsx')),
    },
    {
        path: '/interview_aid',
        title: '面试小助手',
        element: lazy(() => import('../views/interviewAid/index.jsx')),
    }
]

const MyRoute = (items) => {
    return items.map((item, key) => {
        return (
        <Route key={key} path={item.path} element={<item.element />}>
            {item.children && MyRoute(item.children)}
        </Route>
        )
    })
}

const Index = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        {MyRoute(routerArr)}
        <Route path="*" element={<Navigate to="/" replace />} ></Route>
      </Routes>
    </Suspense>
  )
}

export default Index
